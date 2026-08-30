"use client";

import Link from "next/link";
import { useMemo } from "react";
import { VideoIcon } from "@/components/icons";
import { useAppStore } from "@/lib/AppStore";
import { lessonsForCourse } from "@/lib/lessons";
import { mockCourses, mockLiveSessions } from "@/lib/mockData";

export default function StudentDashboard() {
  const { enrollments, bookings, courseProgress, hydrated } = useAppStore();

  const enrolledCourses = useMemo(
    () => (hydrated ? mockCourses.filter((c) => enrollments.includes(c.id)) : []),
    [enrollments, hydrated]
  );

  // Sessions you've booked come first; the rest stay visible as suggestions so
  // the page never looks empty for someone who hasn't booked anything yet.
  const bookedSessions = useMemo(
    () => (hydrated ? mockLiveSessions.filter((s) => bookings.includes(s.id)) : []),
    [bookings, hydrated]
  );
  const suggestedSessions = useMemo(
    () => mockLiveSessions.filter((s) => !bookings.includes(s.id)).slice(0, 3),
    [bookings]
  );

  const completedCount = enrolledCourses.filter(
    (c) => courseProgress(c.id, lessonsForCourse(c).length) === 100
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="animate-fade-in-up text-3xl font-bold text-slate-900">My Learning</h1>
      <p className="stagger-1 animate-fade-in-up mt-1 text-slate-600">
        Pick up where you left off, or join a live class.
      </p>

      <div className="stagger-1 animate-fade-in-up mt-6 grid grid-cols-3 gap-4">
        <StatCard label="Courses enrolled" value={String(enrolledCourses.length)} />
        <StatCard label="Sessions booked" value={String(bookedSessions.length)} />
        <StatCard label="Courses completed" value={String(completedCount)} />
      </div>

      <section className="stagger-2 animate-fade-in-up mt-10">
        <div className="mb-3 flex items-center gap-2">
          <VideoIcon className="h-4 w-4 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {bookedSessions.length > 0 ? "Your live classes" : "Live classes you can join"}
          </h2>
        </div>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {(bookedSessions.length > 0 ? bookedSessions : suggestedSessions).map((s) => {
            const startsInMs = new Date(s.scheduledAt).getTime() - Date.now();
            const startsSoon = startsInMs < 1000 * 60 * 30;
            const isBooked = bookedSessions.some((b) => b.id === s.id);
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/64?u=${s.tutorId}`}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{s.title}</p>
                    <p className="text-sm text-slate-500">
                      with {s.tutorName} ·{" "}
                      {new Date(s.scheduledAt).toLocaleString(undefined, {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {isBooked && s.joinUrl ? (
                  <a
                    href={s.joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      startsSoon
                        ? "bg-brand-600 text-white hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
                        : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {startsSoon ? "Join now" : "Get link"}
                  </a>
                ) : (
                  <Link
                    href="/browse"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Book a seat
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="stagger-3 animate-fade-in-up mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Continue learning</h2>

        {enrolledCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-4xl" aria-hidden="true">
              📚
            </p>
            <p className="mt-3 font-semibold text-slate-900">You haven't enrolled in anything yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
              Browse peer-taught courses and enroll — lesson one of every course is free to preview.
            </p>
            <Link
              href="/browse"
              className="mt-5 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
            >
              Find a course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((c) => {
              const progress = courseProgress(c.id, lessonsForCourse(c).length);
              return (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}/learn`}
                  className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${c.id}/480/280`}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                    <span className="absolute bottom-2 left-3 text-xs font-bold uppercase tracking-wide text-white drop-shadow">
                      {c.subject}
                    </span>
                    {progress === 100 && (
                      <span className="absolute right-3 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Complete
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 font-semibold text-slate-900">{c.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{c.tutorName}</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-[width] duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-slate-500">
                      {progress}% complete · {progress === 0 ? "Start course" : "Continue"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
    </div>
  );
}
