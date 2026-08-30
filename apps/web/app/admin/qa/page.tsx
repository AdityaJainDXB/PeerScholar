"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/Badge";
import { useToast } from "@/components/Toast";
import { useAppStore } from "@/lib/AppStore";
import { mockCourses, mockQaQueue } from "@/lib/mockData";
import { QA_RUBRIC_CRITERIA } from "@shared/constants";

export default function QaQueuePage() {
  const { qaDecisions, setQaDecision, hydrated } = useAppStore();
  const { toast } = useToast();
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const queue = mockQaQueue.map((qa) => ({
    ...qa,
    course: mockCourses.find((c) => c.id === qa.targetId),
  }));

  const pending = queue.filter((item) => !hydrated || !qaDecisions[item.targetId]);
  const reviewed = queue.filter((item) => hydrated && qaDecisions[item.targetId]);

  function setScore(targetId: string, key: string, value: number) {
    setScores((s) => ({ ...s, [targetId]: { ...(s[targetId] ?? {}), [key]: value } }));
  }

  function decide(targetId: string, title: string, decision: "approved" | "rejected") {
    const given = scores[targetId] ?? {};
    const missing = QA_RUBRIC_CRITERIA.filter((c) => !given[c.key]);

    if (missing.length > 0) {
      toast(`Score all ${QA_RUBRIC_CRITERIA.length} criteria before deciding.`, "error");
      return;
    }
    if (decision === "rejected" && !(notes[targetId] ?? "").trim()) {
      toast("Add notes for the tutor when rejecting.", "error");
      return;
    }

    setQaDecision(targetId, decision);
    toast(
      decision === "approved" ? `Approved — ${title} is now published.` : `Sent back to ${title}'s tutor.`,
      decision === "approved" ? "success" : "info"
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="animate-fade-in-up text-3xl font-bold text-slate-900">QA Review Queue</h1>
      <p className="stagger-1 animate-fade-in-up mt-1 text-slate-600">
        As a QA Reviewer, you check submitted courses against the quality rubric before they can
        publish.
      </p>

      <div className="stagger-2 animate-fade-in-up mt-6 grid grid-cols-3 gap-4">
        <StatCard label="Awaiting review" value={String(pending.length)} />
        <StatCard label="Reviewed by you" value={String(reviewed.length)} />
        <StatCard label="Rubric criteria" value={String(QA_RUBRIC_CRITERIA.length)} />
      </div>

      <div className="mt-8 space-y-6">
        {pending.map((item) => {
          const given = scores[item.targetId] ?? {};
          const scored = QA_RUBRIC_CRITERIA.filter((c) => given[c.key]).length;
          const complete = scored === QA_RUBRIC_CRITERIA.length;

          return (
            <div
              key={item.id}
              className="animate-fade-in-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center gap-4 border-b border-slate-100 p-5">
                <img
                  src={`https://picsum.photos/seed/${item.targetId}/96/96`}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  {item.course ? (
                    <Link
                      href={`/courses/${item.course.id}`}
                      className="font-semibold text-slate-900 hover:text-brand-700 hover:underline"
                    >
                      {item.course.title}
                    </Link>
                  ) : (
                    <p className="font-semibold text-slate-900">{item.targetTitle}</p>
                  )}
                  <p className="text-sm text-slate-500">by {item.course?.tutorName ?? "Unknown tutor"}</p>
                </div>
                <Badge label="pending_review" />
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Quality rubric</p>
                  <p className={`text-xs font-medium ${complete ? "text-emerald-600" : "text-slate-500"}`}>
                    {scored} of {QA_RUBRIC_CRITERIA.length} scored
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {QA_RUBRIC_CRITERIA.map((c) => (
                    <div
                      key={c.key}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                    >
                      <span className="text-sm text-slate-700">{c.label}</span>
                      <div className="flex gap-1" role="group" aria-label={`${c.label} score`}>
                        {[1, 2, 3, 4, 5].map((n) => {
                          const active = given[c.key] === n;
                          return (
                            <button
                              key={n}
                              onClick={() => setScore(item.targetId, c.key, n)}
                              aria-pressed={active}
                              aria-label={`${c.label}: ${n} out of 5`}
                              className={`h-7 w-7 rounded text-xs font-semibold transition ${
                                active
                                  ? "bg-brand-600 text-white shadow-sm"
                                  : "text-slate-500 hover:bg-brand-100 hover:text-brand-700"
                              }`}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <label htmlFor={`notes-${item.targetId}`} className="mt-4 block text-sm font-medium text-slate-700">
                  Notes for the tutor
                  <span className="font-normal text-slate-500"> (required if rejecting)</span>
                </label>
                <textarea
                  id={`notes-${item.targetId}`}
                  value={notes[item.targetId] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [item.targetId]: e.target.value }))}
                  placeholder="What worked, and what needs another pass…"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  rows={3}
                />

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => decide(item.targetId, item.course?.title ?? item.targetTitle, "rejected")}
                    className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    Send back
                  </button>
                  <button
                    onClick={() => decide(item.targetId, item.course?.title ?? item.targetTitle, "approved")}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
                  >
                    Approve &amp; publish
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {pending.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-4xl" aria-hidden="true">
              ✅
            </p>
            <p className="mt-3 font-semibold text-slate-900">Queue is clear</p>
            <p className="mt-1 text-sm text-slate-600">
              Nothing is waiting on review right now. Nice work.
            </p>
          </div>
        )}
      </div>

      {reviewed.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Recently reviewed</h2>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {reviewed.map((item) => {
              const decision = qaDecisions[item.targetId];
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <p className="min-w-0 truncate text-sm text-slate-700">
                    {item.course?.title ?? item.targetTitle}
                  </p>
                  <Badge
                    label={decision === "approved" ? "published" : "rejected"}
                    tone={decision === "approved" ? "published" : "rejected"}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}
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
