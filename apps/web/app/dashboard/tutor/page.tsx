import Badge from "@/components/Badge";
import { mockCourses, mockLiveSessions } from "@/lib/mockData";
import { centsToDisplay } from "@shared/types";

export default function TutorDashboard() {
  const myCourses = mockCourses.filter((c) => c.tutorId === "t1");
  const mySessions = mockLiveSessions.filter((s) => s.tutorId === "t1");
  const earningsCents = myCourses.reduce((sum, c) => sum + c.enrollmentCount * c.priceCents * 0.85, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teach</h1>
          <p className="mt-1 text-slate-600">Manage your courses and live sessions.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50">
            + Schedule a session
          </button>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
            + Upload a course
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Est. earnings (after 15% fee)</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{centsToDisplay(Math.round(earningsCents))}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Published courses</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{myCourses.filter((c) => c.status === "published").length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Upcoming sessions</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{mySessions.length}</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Your courses</h2>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {myCourses.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">{c.title}</p>
                <p className="text-sm text-slate-500">
                  {c.enrollmentCount} enrolled · {centsToDisplay(c.priceCents)}
                </p>
              </div>
              <Badge label={c.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-slate-900">Your upcoming sessions</h2>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {mySessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">{s.title}</p>
                <p className="text-sm text-slate-500">
                  {new Date(s.scheduledAt).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })} ·{" "}
                  {s.bookedCount}/{s.maxParticipants} booked
                </p>
              </div>
              <Badge label={s.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
