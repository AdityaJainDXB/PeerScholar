"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Course, LiveSession } from "@shared/types";

/**
 * Client-side app state for the prototype: enrollments, lesson progress,
 * session bookings, QA decisions, and tutor-created content.
 *
 * This persists to localStorage rather than Firestore because the site ships
 * as a static export and runs on mock data by default — so the whole product
 * flow is explorable without anyone having to provision a backend first.
 * The shapes here intentionally mirror the Firestore collections documented in
 * docs/FIRESTORE_SCHEMA.md, so swapping the implementation for real writes is
 * a change inside this file rather than across every screen.
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

interface AppStoreValue extends StoreShape {
  /** False until localStorage has been read, so SSG markup and first client render match. */
  hydrated: boolean;
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
  const [state, setState] = useState<StoreShape>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

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
