import Badge from "@/components/Badge";
import { mockCourses, mockQaQueue } from "@/lib/mockData";
import { QA_RUBRIC_CRITERIA } from "@shared/constants";

export default function QaQueuePage() {
  const queue = mockQaQueue.map((qa) => ({
    ...qa,
    course: mockCourses.find((c) => c.id === qa.targetId),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">QA Review Queue</h1>
      <p className="mt-1 text-slate-600">
        As a QA Reviewer, you check submitted courses against the quality rubric before they can
        publish. See{" "}
        <a href="/docs/PRODUCT.md" className="text-brand-700 hover:underline">
          the QA program details
        </a>
        .
      </p>

      <div className="mt-8 space-y-6">
        {queue.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{item.course?.title ?? item.targetTitle}</p>
                <p className="text-sm text-slate-500">by {item.course?.tutorName}</p>
              </div>
              <Badge label="pending_review" />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {QA_RUBRIC_CRITERIA.map((c) => (
                <div key={c.key} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-700">{c.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        className="h-6 w-6 rounded text-xs font-medium text-slate-500 hover:bg-brand-100 hover:text-brand-700"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Notes for the tutor (required if rejecting)…"
              className="mt-4 w-full rounded-lg border border-slate-300 p-3 text-sm"
              rows={3}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                Reject
              </button>
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Approve &amp; publish
              </button>
            </div>
          </div>
        ))}
        {queue.length === 0 && <p className="text-slate-500">Nothing waiting on review right now.</p>}
      </div>
    </div>
  );
}
