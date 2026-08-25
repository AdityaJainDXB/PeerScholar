import { mockCourses, mockLiveSessions } from "@/lib/mockData";
import Link from "next/link";

export default function StudentDashboard() {
  const enrolled = mockCourses.filter((c) => c.status === "published").slice(0, 2);
  const upcoming = mockLiveSessions.slice(0, 2);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">My Learning</h1>
      <p className="mt-1 text-slate-600">Your enrolled courses and upcoming sessions.</p>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Upcoming sessions</h2>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {upcoming.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">{s.title}</p>
                <p className="text-sm text-slate-500">
                  with {s.tutorName} · {new Date(s.scheduledAt).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
              <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50">
                Join
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Enrolled courses</h2>
        <div className="space-y-4">
          {enrolled.map((c, i) => {
            const progress = i === 0 ? 62 : 18;
            return (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{c.title}</p>
                  <span className="text-sm text-slate-500">{progress}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
