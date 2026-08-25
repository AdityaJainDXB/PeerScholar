import { mockCourses, mockLiveSessions } from "@/lib/mockData";
import Link from "next/link";
import { VideoIcon } from "@/components/icons";

export default function StudentDashboard() {
  const enrolled = mockCourses.filter((c) => c.status === "published").slice(0, 3);
  const upcoming = mockLiveSessions;
  const progressByCourse: Record<string, number> = { c1: 62, c2: 18, c4: 90 };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">My Learning</h1>
      <p className="mt-1 text-slate-600">Pick up where you left off, or join a live class.</p>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <VideoIcon className="h-4 w-4 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">Live classes</h2>
        </div>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {upcoming.map((s) => {
            const startsInMs = new Date(s.scheduledAt).getTime() - Date.now();
            const startsSoon = startsInMs < 1000 * 60 * 30;
            return (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                <div>
                  <p className="font-medium text-slate-900">{s.title}</p>
                  <p className="text-sm text-slate-500">
                    with {s.tutorName} ·{" "}
                    {new Date(s.scheduledAt).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
                {s.joinUrl ? (
                  <a
                    href={s.joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      startsSoon
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {startsSoon ? "Join now" : "Get link"}
                  </a>
                ) : (
                  <span className="text-sm text-slate-400">Link posted soon</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Continue learning</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrolled.map((c) => {
            const progress = progressByCourse[c.id] ?? 0;
            return (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-brand-500 to-purple-500 text-3xl font-black text-white/90">
                  {c.subject.slice(0, 2).toUpperCase()}
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 font-semibold text-slate-900">{c.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{c.tutorName}</p>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-slate-500">{progress}% complete</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
