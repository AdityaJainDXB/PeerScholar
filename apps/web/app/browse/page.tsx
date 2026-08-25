import CourseCard from "@/components/CourseCard";
import SessionCard from "@/components/SessionCard";
import { mockCourses, mockLiveSessions } from "@/lib/mockData";

export default function BrowsePage() {
  const courses = mockCourses.filter((c) => c.status === "published");
  const sessions = mockLiveSessions.filter((s) => s.status === "scheduled");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Browse</h1>
      <p className="mt-1 text-slate-600">Find a live session or a recorded course by subject.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All subjects", "Math", "Science", "Computer Science", "World Language", "History", "Test Prep"].map((tag, i) => (
          <button
            key={tag}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              i === 0 ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Upcoming live sessions</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-slate-900">On-demand courses</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
