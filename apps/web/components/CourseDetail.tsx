"use client";

import Link from "next/link";
import { useState } from "react";
import Badge from "@/components/Badge";
import RatingStars from "@/components/RatingStars";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import { useAppStore } from "@/lib/AppStore";
import { lessonsForCourse, formatDuration } from "@/lib/lessons";
import { centsToDisplay, type Course } from "@shared/types";

export default function CourseDetail({ course }: { course: Course }) {
  const { isEnrolled, enroll, courseProgress, isLessonComplete, hydrated } = useAppStore();
  const { toast } = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const lessons = lessonsForCourse(course);
  const enrolled = hydrated && isEnrolled(course.id);
  const progress = courseProgress(course.id, lessons.length);
  const isFree = course.priceCents === 0;

  async function confirmEnroll() {
    setEnrolling(true);
    // Simulated settlement delay so the confirm step reads as a real action.
    // Replaced by the Stripe PaymentIntent round-trip once payments land.
    await new Promise((r) => setTimeout(r, 700));
    enroll(course.id);
    setEnrolling(false);
    setCheckoutOpen(false);
    toast(`You're enrolled in ${course.title}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/browse" className="transition hover:text-brand-700">
          Browse
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700">{course.subject}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{course.subject}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{course.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <RatingStars rating={course.ratingAvg} count={course.ratingCount} />
            <Badge label={course.status} />
            {enrolled && <Badge label="Enrolled" tone="verified" />}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Taught by{" "}
            <Link href={`/tutors/${course.tutorId}`} className="font-medium text-brand-700 hover:underline">
              {course.tutorName}
            </Link>
          </p>
          <p className="mt-4 text-slate-700">{course.description}</p>

          <Link
            href={enrolled ? `/courses/${course.id}/learn` : "#curriculum"}
            className="group relative mt-8 block aspect-video overflow-hidden rounded-xl bg-slate-900"
          >
            <img
              src={`https://picsum.photos/seed/${course.id}/900/500`}
              alt=""
              className="h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand-700 shadow-lg transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
            <p className="absolute bottom-3 left-4 text-sm font-medium text-white drop-shadow">
              {enrolled ? "Continue where you left off" : "Preview: Lesson 1 — free"}
            </p>
          </Link>

          <section id="curriculum" className="mt-10 scroll-mt-24">
            <h2 className="mb-3 text-lg font-bold text-slate-900">
              Curriculum — {course.lessonCount} lessons · {formatDuration(course.totalDurationMinutes)}
            </h2>
            <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
              {lessons.slice(0, 8).map((l) => {
                const unlocked = enrolled || l.isPreview;
                const done = hydrated && isLessonComplete(course.id, l.id);
                const row = (
                  <>
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                          done
                            ? "bg-emerald-100 text-emerald-700"
                            : unlocked
                              ? "bg-brand-50 text-brand-600"
                              : "bg-slate-100 text-slate-400"
                        }`}
                        aria-hidden="true"
                      >
                        {done ? "✓" : unlocked ? "▶" : "🔒"}
                      </span>
                      <span className={`truncate text-sm ${unlocked ? "text-slate-700" : "text-slate-400"}`}>
                        {l.title}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
                      {l.isPreview && !enrolled && <Badge label="Free preview" tone="verified" />}
                      {l.durationMinutes}m
                    </span>
                  </>
                );

                return unlocked ? (
                  <Link
                    key={l.id}
                    href={`/courses/${course.id}/learn?lesson=${l.position}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50"
                  >
                    {row}
                  </Link>
                ) : (
                  <div key={l.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    {row}
                  </div>
                );
              })}
              {lessons.length > 8 && (
                <p className="px-4 py-3 text-sm text-slate-500">
                  + {lessons.length - 8} more lessons
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="sticky top-24 h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {enrolled ? (
            <>
              <p className="text-sm font-medium text-emerald-700">✓ You're enrolled</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-[width] duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs font-medium text-slate-500">{progress}% complete</p>
              <Link
                href={`/courses/${course.id}/learn`}
                className="mt-4 block w-full rounded-lg bg-brand-600 py-3 text-center font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
              >
                {progress > 0 ? "Continue learning" : "Start course"}
              </Link>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-slate-900">
                {isFree ? "Free" : centsToDisplay(course.priceCents)}
              </p>
              <button
                onClick={() => setCheckoutOpen(true)}
                className="mt-4 w-full rounded-lg bg-brand-600 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
              >
                {isFree ? "Enroll for free" : "Enroll now"}
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">
                Lesson 1 is free to preview
              </p>
            </>
          )}

          <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-600">
            <li>{course.enrollmentCount.toLocaleString()} students enrolled</li>
            <li>
              {course.lessonCount} lessons · {formatDuration(course.totalDurationMinutes)}
            </li>
            <li>Certificate on completion</li>
            <li>Lifetime access</li>
          </ul>
        </aside>
      </div>

      <Modal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={isFree ? "Enroll in this course" : "Confirm enrollment"}
        description={isFree ? undefined : "Review your order before enrolling."}
      >
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <img
              src={`https://picsum.photos/seed/${course.id}/80/80`}
              alt=""
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{course.title}</p>
              <p className="text-sm text-slate-500">by {course.tutorName}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-1.5 border-t border-slate-200 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Course price</dt>
              <dd className="font-medium text-slate-900">{isFree ? "Free" : centsToDisplay(course.priceCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Lifetime access</dt>
              <dd className="text-slate-900">Included</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1.5 text-base">
              <dt className="font-semibold text-slate-900">Total</dt>
              <dd className="font-bold text-slate-900">{isFree ? "$0.00" : centsToDisplay(course.priceCents)}</dd>
            </div>
          </dl>
        </div>

        {!isFree && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            This prototype doesn't process real payments — enrolling is free while Stripe
            Connect is still being wired up. See the roadmap.
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setCheckoutOpen(false)}
            className="flex-1 rounded-lg border border-slate-300 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmEnroll}
            disabled={enrolling}
            className="flex-1 rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {enrolling ? "Enrolling…" : "Confirm & enroll"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
