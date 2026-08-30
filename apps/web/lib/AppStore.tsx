"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Course, LiveSession } from "@shared/types";
import { useAuth } from "./AuthProvider";
import {
  EMPTY_LEARNER_STATE,
  fetchLearnerState,
  mergeLearnerState,
  saveLearnerState,
  type LearnerState,
} from "./learnerState";

/**
 * Client-side app state: enrollments, lesson progress, session bookings, QA
 * decisions, and tutor-created content.
 *
 * Two layers, deliberately:
 *  - localStorage always. The site is a static export that runs on mock data,
 *    so the whole product flow stays explorable signed-out and offline.
 *  - Firestore when signed in. Learning progress syncs to `learnerState/{uid}`
 *    so it follows the person across devices. Every cloud call is best-effort:
 *    if Firestore is unreachable, rules aren't deployed, or the project isn't
 *    configured, the app keeps working locally instead of breaking.
 */

const STORAGE_KEY = "peerscholar:store:v1";

export type QaDecision = "approved" | "rejected";

interface StoreShape {
  enrollments: string[];
  completedLessons: Record<string, string[]>;
  bookings: string[];
  qaDecisions: Record<string, QaDecision>;
  createdCourses: Course[];
  createdSessions: LiveSession[];
}

const EMPTY: StoreShape = {
  enrollments: [],
  completedLessons: {},
  bookings: [],
  qaDecisions: {},
  createdCourses: [],
  createdSessions: [],
};

export type SyncStatus = "local" | "syncing" | "synced" | "error";

interface AppStoreValue extends StoreShape {
  /** False until localStorage has been read, so SSG markup and first client render match. */
  hydrated: boolean;
  /** Whether learning progress is currently backed by Firestore. */
  syncStatus: SyncStatus;
  isEnrolled: (courseId: string) => boolean;
  enroll: (courseId: string) => void;
  unenroll: (courseId: string) => void;
  isLessonComplete: (courseId: string, lessonId: string) => boolean;
  toggleLesson: (courseId: string, lessonId: string) => void;
  courseProgress: (courseId: string, totalLessons: number) => number;
  isBooked: (sessionId: string) => boolean;
  book: (sessionId: string) => void;
  cancelBooking: (sessionId: string) => void;
  setQaDecision: (targetId: string, decision: QaDecision) => void;
  addCourse: (course: Course) => void;
  addSession: (session: LiveSession) => void;
  reset: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<StoreShape>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      // corrupt or unavailable storage — fall back to defaults
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or blocked (private mode) — state still works in-memory
    }
  }, [state, hydrated]);

  // On sign-in, pull cloud state and union it with whatever was built up
  // locally, then push the result back so both sides agree.
  const syncedUid = useRef<string | null>(null);
  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      syncedUid.current = null;
      setSyncStatus("local");
      return;
    }
    if (syncedUid.current === user.uid) return;
    syncedUid.current = user.uid;

    let cancelled = false;
    setSyncStatus("syncing");

    (async () => {
      try {
        const remote = (await fetchLearnerState(user.uid)) ?? EMPTY_LEARNER_STATE;
        if (cancelled) return;

        let merged: LearnerState = EMPTY_LEARNER_STATE;
        setState((s) => {
          merged = mergeLearnerState(
            { enrollments: s.enrollments, completedLessons: s.completedLessons, bookings: s.bookings },
            remote
          );
          return { ...s, ...merged };
        });

        await saveLearnerState(user.uid, merged);
        if (!cancelled) setSyncStatus("synced");
      } catch {
        // Rules not deployed, offline, or project misconfigured — the local
        // layer already has everything, so degrade instead of failing.
        if (!cancelled) setSyncStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, hydrated]);

  // Push subsequent changes up, debounced so rapid actions (ticking through
  // lessons) don't turn into a write per keystroke.
  useEffect(() => {
    if (!hydrated || !user || syncStatus === "syncing") return;
    const t = setTimeout(() => {
      saveLearnerState(user.uid, {
        enrollments: state.enrollments,
        completedLessons: state.completedLessons,
        bookings: state.bookings,
      })
        .then(() => setSyncStatus("synced"))
        .catch(() => setSyncStatus("error"));
    }, 800);
    return () => clearTimeout(t);
  }, [state.enrollments, state.completedLessons, state.bookings, user, hydrated, syncStatus]);

  const isEnrolled = useCallback(
    (courseId: string) => state.enrollments.includes(courseId),
    [state.enrollments]
  );

  const enroll = useCallback((courseId: string) => {
    setState((s) =>
      s.enrollments.includes(courseId) ? s : { ...s, enrollments: [...s.enrollments, courseId] }
    );
  }, []);

  const unenroll = useCallback((courseId: string) => {
    setState((s) => ({ ...s, enrollments: s.enrollments.filter((id) => id !== courseId) }));
  }, []);

  const isLessonComplete = useCallback(
    (courseId: string, lessonId: string) => (state.completedLessons[courseId] ?? []).includes(lessonId),
    [state.completedLessons]
  );

  const toggleLesson = useCallback((courseId: string, lessonId: string) => {
    setState((s) => {
      const done = s.completedLessons[courseId] ?? [];
      const next = done.includes(lessonId)
        ? done.filter((id) => id !== lessonId)
        : [...done, lessonId];
      return { ...s, completedLessons: { ...s.completedLessons, [courseId]: next } };
    });
  }, []);

  const courseProgress = useCallback(
    (courseId: string, totalLessons: number) => {
      if (totalLessons <= 0) return 0;
      const done = (state.completedLessons[courseId] ?? []).length;
      return Math.round((done / totalLessons) * 100);
    },
    [state.completedLessons]
  );

  const isBooked = useCallback(
    (sessionId: string) => state.bookings.includes(sessionId),
    [state.bookings]
  );

  const book = useCallback((sessionId: string) => {
    setState((s) => (s.bookings.includes(sessionId) ? s : { ...s, bookings: [...s.bookings, sessionId] }));
  }, []);

  const cancelBooking = useCallback((sessionId: string) => {
    setState((s) => ({ ...s, bookings: s.bookings.filter((id) => id !== sessionId) }));
  }, []);

  const setQaDecision = useCallback((targetId: string, decision: QaDecision) => {
    setState((s) => ({ ...s, qaDecisions: { ...s.qaDecisions, [targetId]: decision } }));
  }, []);

  const addCourse = useCallback((course: Course) => {
    setState((s) => ({ ...s, createdCourses: [course, ...s.createdCourses] }));
  }, []);

  const addSession = useCallback((session: LiveSession) => {
    setState((s) => ({ ...s, createdSessions: [session, ...s.createdSessions] }));
  }, []);

  const reset = useCallback(() => setState(EMPTY), []);

  const value = useMemo<AppStoreValue>(
    () => ({
      ...state,
      hydrated,
      syncStatus,
      isEnrolled,
      enroll,
      unenroll,
      isLessonComplete,
      toggleLesson,
      courseProgress,
      isBooked,
      book,
      cancelBooking,
      setQaDecision,
      addCourse,
      addSession,
      reset,
    }),
    [
      state,
      hydrated,
      syncStatus,
      isEnrolled,
      enroll,
      unenroll,
      isLessonComplete,
      toggleLesson,
      courseProgress,
      isBooked,
      book,
      cancelBooking,
      setQaDecision,
      addCourse,
      addSession,
      reset,
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside <AppStoreProvider>");
  return ctx;
}
