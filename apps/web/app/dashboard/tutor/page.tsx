"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Badge from "@/components/Badge";
import CreateCourseModal from "@/components/CreateCourseModal";
import ScheduleSessionModal from "@/components/ScheduleSessionModal";
import { useToast } from "@/components/Toast";
import { useAppStore } from "@/lib/AppStore";
import { CURRENT_USER_ID, mockCourses, mockEarningsHistory, mockLiveSessions } from "@/lib/mockData";
import { centsToDisplay, type LiveSession } from "@shared/types";

const TUTOR_NAME = "Maya Chen";

export default function TutorDashboard() {
  const { createdCourses, createdSessions, hydrated } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [courseModal, setCourseModal] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  useEffect(() => setMounted(true), []);

  // Merge seeded demo data with anything the tutor created this session so the
  // dashboard reflects their actions immediately.
  const myCourses = useMemo(
    () => [...(hydrated ? createdCourses : []), ...mockCourses.filter((c) => c.tutorId === CURRENT_USER_ID)],
    [createdCourses, hydrated]
  );
  const mySessions = useMemo(
    () => [
      ...(hydrated ? createdSessions : []),
      ...mockLiveSessions.filter((s) => s.tutorId === CURRENT_USER_ID),
    ],
    [createdSessions, hydrated]
  );

  const published = myCourses.filter((c) => c.status === "published");
  const earningsCents = published.reduce((sum, c) => sum + c.enrollmentCount * c.priceCents * 0.85, 0);
  const totalStudents = myCourses.reduce((sum, c) => sum + c.enrollmentCount, 0);
  const rated = myCourses.filter((c) => c.ratingCount > 0);
  const avgRating = rated.length ? rated.reduce((sum, c) => sum + c.ratingAvg, 0) / rated.length : 0;

  const topSelling = [...myCourses].sort((a, b) => b.enrollmentCount - a.enrollmentCount);
  const newestCourse = [...myCourses].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  )[0];
  const maxWeekly = Math.max(...mockEarningsHistory.map((w) => w.cents));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="animate-fade-in-up flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="mt-1 text-slate-600">How your courses and live sessions are doing.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSessionModal(true)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
          >
            + Schedule a session
          </button>
          <button
            onClick={() => setCourseModal(true)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-md"
          >
            + Upload a course
          </button>
        </div>
      </div>

      {newestCourse && (
        <div className="stagger-1 animate-fade-in-up mt-6 flex items-center gap-3 overflow-hidden rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
          <img
            src={`https://picsum.photos/seed/${newestCourse.id}/80/80`}
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />
          <p className="text-sm text-brand-900">
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">New</span>{" "}
            <span className="font-semibold">{newestCourse.title}</span>
            {newestCourse.status === "pending_review"
              ? " is waiting on QA review."
              : ` is your newest class — ${newestCourse.enrollmentCount} students enrolled so far.`}
          </p>
        </div>
      )}

      <div className="stagger-2 animate-fade-in-up mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Est. earnings (after 15% fee)" value={centsToDisplay(Math.round(earningsCents))} />
        <StatCard label="Total students" value={totalStudents.toLocaleString()} />
        <StatCard label="Published courses" value={String(published.length)} />
        <StatCard label="Avg. rating" value={avgRating ? `${avgRating.toFixed(1)}★` : "—"} />
      </div>

      <section className="stagger-3 animate-fade-in-up mt-10 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Earnings, last 6 weeks</h2>
        <div className="mt-6 flex h-40 items-end gap-4">
          {mockEarningsHistory.map((w) => (
            <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-500">{centsToDisplay(w.cents)}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400 transition-[height] duration-700 ease-out"
                style={{ height: mounted ? `${Math.max(8, (w.cents / maxWeekly) * 96)}px` : "0px" }}
              />
              <span className="text-xs text-slate-500">{w.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="stagger-4 animate-fade-in-up mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Your courses</h2>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {topSelling.map((c, i) => (
            <div key={c.id} className="flex items-center gap-4 px-4 py-4 transition hover:bg-slate-50">
              <img
                src={`https://picsum.photos/seed/${c.id}/80/80`}
                alt=""
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
              />
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/courses/${c.id}`}
                  className="block truncate font-medium text-slate-900 hover:text-brand-700 hover:underline"
                >
                  {c.title}
                </Link>
                <p className="text-sm text-slate-500">
                  {c.enrollmentCount} enrolled · {centsToDisplay(c.priceCents)} ·{" "}
                  {c.ratingCount > 0 ? `${c.ratingAvg}★` : "no ratings yet"}
                </p>
              </div>
              <p className="hidden shrink-0 text-sm font-semibold text-slate-900 sm:block">
                {centsToDisplay(Math.round(c.enrollmentCount * c.priceCents * 0.85))} earned
              </p>
              <Badge label={c.status} />
            </div>
          ))}
          {topSelling.length === 0 && (
            <EmptyRow
              emoji="📚"
              title="No courses yet"
              body="Upload your first course to start earning."
              action={{ label: "Upload a course", onClick: () => setCourseModal(true) }}
            />
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Your upcoming live sessions</h2>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {mySessions.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
          {mySessions.length === 0 && (
            <EmptyRow
              emoji="🎥"
              title="No sessions scheduled"
              body="Open a slot and learners can book it right away."
              action={{ label: "Schedule a session", onClick: () => setSessionModal(true) }}
            />
          )}
        </div>
      </section>

      <CreateCourseModal open={courseModal} onClose={() => setCourseModal(false)} tutorName={TUTOR_NAME} />
      <ScheduleSessionModal open={sessionModal} onClose={() => setSessionModal(false)} tutorName={TUTOR_NAME} />
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

function EmptyRow({
  emoji,
  title,
  body,
  action,
}: {
  emoji: string;
  title: string;
  body: string;
  action: { label: string; onClick: () => void };
}) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-3xl" aria-hidden="true">
        {emoji}
      </p>
      <p className="mt-2 font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
      <button
        onClick={action.onClick}
        className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {action.label}
      </button>
    </div>
  );
}

function SessionRow({ session }: { session: LiveSession }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!session.joinUrl) return;
    try {
      await navigator.clipboard.writeText(session.joinUrl);
      setCopied(true);
      toast("Join link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Couldn't copy — check clipboard permissions.", "error");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 transition hover:bg-slate-50">
      <div>
        <p className="font-medium text-slate-900">{session.title}</p>
        <p className="text-sm text-slate-500">
          {new Date(session.scheduledAt).toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}{" "}
          · {session.bookedCount}/{session.maxParticipants} booked
        </p>
      </div>
      <div className="flex items-center gap-2">
        {session.joinUrl && (
          <button
            onClick={copyLink}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        )}
        <Badge label={session.status} />
      </div>
    </div>
  );
}
