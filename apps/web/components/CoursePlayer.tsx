"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/AppStore";
import { useToast } from "@/components/Toast";
import { lessonsForCourse, formatDuration } from "@/lib/lessons";
import { centsToDisplay, type Course } from "@shared/types";

export default function CoursePlayer({ course }: { course: Course }) {
  const searchParams = useSearchParams();
  const { isEnrolled, enroll, isLessonComplete, toggleLesson, courseProgress, hydrated } = useAppStore();
  const { toast } = useToast();

  const lessons = lessonsForCourse(course);
  const requested = Number(searchParams.get("lesson") ?? 0);
  const [current, setCurrent] = useState(
    Number.isFinite(requested) && requested >= 0 && requested < lessons.length ? requested : 0
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const enrolled = hydrated && isEnrolled(course.id);
  const progress = courseProgress(course.id, lessons.length);
  const lesson = lessons[current];
  const unlocked = enrolled || lesson.isPreview;
  const done = hydrated && isLessonComplete(course.id, lesson.id);
  const completedCount = lessons.filter((l) => hydrated && isLessonComplete(course.id, l.id)).length;
  const allDone = completedCount === lessons.length && lessons.length > 0;

  // Keep the URL in step with the lesson being watched so the page is
  // linkable and the back button moves between lessons as people expect.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("lesson", String(current));
    window.history.replaceState(null, "", url.toString());
  }, [current]);

  function selectLesson(index: number) {
    setCurrent(index);
    setSidebarOpen(false);
  }

  function handleToggleComplete() {
    toggleLesson(course.id, lesson.id);
    if (!done) {
      const isLast = current === lessons.length - 1;
      toast(isLast ? "Course complete — nice work!" : "Lesson complete");
      if (!isLast) setTimeout(() => setCurrent((c) => Math.min(c + 1, lessons.length - 1)), 400);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-brand-700"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to course
        </Link>
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 lg:hidden"
        >
          {sidebarOpen ? "Hide" : "Lessons"} ({completedCount}/{lessons.length})
        </button>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">{course.title}</h1>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-[width] duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="shrink-0 text-sm font-medium text-slate-600">{progress}%</span>
      </div>

      {allDone && (
        <div className="animate-fade-in-up mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <span className="text-2xl" aria-hidden="true">
            🎓
          </span>
          <div>
            <p className="font-semibold text-emerald-900">You finished the course!</p>
            <p className="text-sm text-emerald-800">
              Your certificate for {course.title} is ready in your dashboard.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
            {unlocked ? (
              <>
                <img
                  src={`https://picsum.photos/seed/${lesson.id}/900/500`}
                  alt=""
                  className="h-full w-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <p className="px-4 text-sm text-white/90">
                    Video playback arrives with Firebase Storage — see the roadmap.
                  </p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="text-3xl" aria-hidden="true">
                  🔒
                </span>
                <p className="font-semibold text-white">This lesson is for enrolled students</p>
                <button
                  onClick={() => {
                    enroll(course.id);
                    toast(`You're enrolled in ${course.title}`);
                  }}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Enroll for {course.priceCents === 0 ? "free" : centsToDisplay(course.priceCents)}
                </button>
              </div>
            )}
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
              Lesson {current + 1} of {lessons.length}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{lesson.title}</h2>
            <p className="mt-2 text-slate-600">
              {lesson.durationMinutes} minutes · taught by {course.tutorName}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {unlocked && (
              <button
                onClick={handleToggleComplete}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  done
                    ? "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-brand-600 text-white hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
                }`}
              >
                {done ? "✓ Completed" : "Mark complete"}
              </button>
            )}
            <button
              onClick={() => setCurrent((c) => Math.min(lessons.length - 1, c + 1))}
              disabled={current === lessons.length - 1}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next lesson
            </button>
          </div>
        </div>

        <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
              <p className="font-semibold text-slate-900">Course content</p>
              <p className="text-xs text-slate-500">
                {completedCount} of {lessons.length} complete · {formatDuration(course.totalDurationMinutes)}
              </p>
            </div>
            <ol className="max-h-[28rem] divide-y divide-slate-100 overflow-y-auto">
              {lessons.map((l, i) => {
                const lDone = hydrated && isLessonComplete(course.id, l.id);
                const lUnlocked = enrolled || l.isPreview;
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => selectLesson(i)}
                      aria-current={i === current ? "true" : undefined}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                        i === current ? "bg-brand-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                          lDone
                            ? "bg-emerald-100 text-emerald-700"
                            : lUnlocked
                              ? "bg-brand-100 text-brand-700"
                              : "bg-slate-100 text-slate-400"
                        }`}
                        aria-hidden="true"
                      >
                        {lDone ? "✓" : lUnlocked ? i + 1 : "🔒"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-sm ${
                            i === current ? "font-semibold text-brand-800" : "text-slate-700"
                          }`}
                        >
                          {l.title}
                        </span>
                        <span className="text-xs text-slate-500">{l.durationMinutes}m</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
