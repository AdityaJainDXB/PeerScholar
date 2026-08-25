import { notFound } from "next/navigation";
import Link from "next/link";
import Badge from "@/components/Badge";
import RatingStars from "@/components/RatingStars";
import { mockCourses } from "@/lib/mockData";
import { centsToDisplay } from "@shared/types";

export function generateStaticParams() {
  return mockCourses.map((c) => ({ id: c.id }));
}

function formatDuration(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = mockCourses.find((c) => c.id === params.id);
  if (!course) return notFound();

  const lessons = Array.from({ length: Math.min(course.lessonCount, 6) }).map((_, i) => ({
    id: `${course.id}-lesson-${i + 1}`,
    title: `Lesson ${i + 1}: ${course.subject} fundamentals, part ${i + 1}`,
    durationMinutes: Math.round(course.totalDurationMinutes / course.lessonCount),
    isPreview: i === 0,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{course.subject}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{course.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars rating={course.ratingAvg} count={course.ratingCount} />
            <Badge label={course.status} />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Taught by{" "}
            <Link href={`/tutors/${course.tutorId}`} className="font-medium text-brand-700 hover:underline">
              {course.tutorName}
            </Link>
          </p>
          <p className="mt-4 text-slate-700">{course.description}</p>

          <div className="mt-8 flex aspect-video items-center justify-center rounded-xl bg-slate-900 text-slate-300">
            {lessons[0]?.isPreview ? "Preview: Lesson 1 video player" : "Enroll to watch"}
          </div>

          <section className="mt-10">
            <h2 className="mb-3 text-lg font-bold text-slate-900">
              Curriculum — {course.lessonCount} lessons · {formatDuration(course.totalDurationMinutes)}
            </h2>
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {lessons.map((l) => (
                <div key={l.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-700">{l.title}</span>
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    {l.isPreview && <Badge label="Preview" tone="verified" />}
                    {l.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-3xl font-bold text-slate-900">{centsToDisplay(course.priceCents)}</p>
          <button className="mt-4 w-full rounded-lg bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700">
            Enroll now
          </button>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            <li>{course.enrollmentCount} students enrolled</li>
            <li>{course.lessonCount} lessons on demand</li>
            <li>Certificate on completion</li>
            <li>Lifetime access</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
