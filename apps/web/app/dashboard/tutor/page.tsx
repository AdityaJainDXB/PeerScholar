"use client";

import { useState } from "react";
import Badge from "@/components/Badge";
import { CURRENT_USER_ID, mockCourses, mockEarningsHistory, mockLiveSessions } from "@/lib/mockData";
import { centsToDisplay } from "@shared/types";

export default function TutorDashboard() {
  const myCourses = mockCourses.filter((c) => c.tutorId === CURRENT_USER_ID);
  const mySessions = mockLiveSessions.filter((s) => s.tutorId === CURRENT_USER_ID);
  const earningsCents = myCourses.reduce((sum, c) => sum + c.enrollmentCount * c.priceCents * 0.85, 0);
  const totalStudents = myCourses.reduce((sum, c) => sum + c.enrollmentCount, 0);
  const avgRating =
    myCourses.filter((c) => c.ratingCount > 0).reduce((sum, c) => sum + c.ratingAvg, 0) /
    Math.max(1, myCourses.filter((c) => c.ratingCount > 0).length);

  const topSelling = [...myCourses].sort((a, b) => b.enrollmentCount - a.enrollmentCount);
  const newestCourse = [...myCourses].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  )[0];
  const maxWeekly = Math.max(...mockEarningsHistory.map((w) => w.cents));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="mt-1 text-slate-600">How your courses and live sessions are doing.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
            + Schedule a session
          </button>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
            + Upload a course
          </button>
        </div>
      </div>

      {newestCourse && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
            New
          </span>
          <p className="text-sm text-brand-900">
            <span className="font-semibold">{newestCourse.title}</span> is your newest class — {newestCourse.enrollmentCount}{" "}
            students enrolled so far.
          </p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Est. earnings (after 15% fee)" value={centsToDisplay(Math.round(earningsCents))} />
        <StatCard label="Total students" value={String(totalStudents)} />
        <StatCard label="Published courses" value={String(myCourses.filter((c) => c.status === "published").length)} />
        <StatCard label="Avg. rating" value={avgRating ? `${avgRating.toFixed(1)}★` : "—"} />
      </div>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Earnings, last 6 weeks</h2>
        <div className="mt-6 flex h-40 items-end gap-4">
          {mockEarningsHistory.map((w) => (
            <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-500">{centsToDisplay(w.cents)}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400"
                style={{ height: `${Math.max(8, (w.cents / maxWeekly) * 96)}px` }}
              />
              <span className="text-xs text-slate-400">{w.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Top-selling courses</h2>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {topSelling.map((c, i) => (
            <div key={c.id} className="flex items-center gap-4 px-4 py-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{c.title}</p>
                <p className="text-sm text-slate-500">
                  {c.enrollmentCount} enrolled · {centsToDisplay(c.priceCents)} · {c.ratingCount > 0 ? `${c.ratingAvg}★` : "no ratings yet"}
                </p>
              </div>
              <p className="hidden shrink-0 text-sm font-semibold text-slate-900 sm:block">
                {centsToDisplay(Math.round(c.enrollmentCount * c.priceCents * 0.85))} earned
              </p>
              <Badge label={c.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Your upcoming live sessions</h2>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {mySessions.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
        </div>
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

function SessionRow({ session }: { session: (typeof mockLiveSessions)[number] }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!session.joinUrl) return;
    try {
      await navigator.clipboard.writeText(session.joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard permissions denied — no-op
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
      <div>
        <p className="font-medium text-slate-900">{session.title}</p>
        <p className="text-sm text-slate-500">
          {new Date(session.scheduledAt).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })} ·{" "}
          {session.bookedCount}/{session.maxParticipants} booked
        </p>
      </div>
      <div className="flex items-center gap-2">
        {session.joinUrl && (
          <button
            onClick={copyLink}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        )}
        <Badge label={session.status} />
      </div>
    </div>
  );
}
