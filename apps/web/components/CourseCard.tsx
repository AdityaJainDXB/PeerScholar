import Link from "next/link";
import type { Course } from "@shared/types";
import { centsToDisplay } from "@shared/types";
import RatingStars from "./RatingStars";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
    >
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-500 to-purple-500 text-3xl font-black text-white/90 transition group-hover:scale-105">
        {course.subject.slice(0, 2).toUpperCase()}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{course.subject}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900">{course.title}</h3>
        <p className="mt-1 text-sm text-slate-500">by {course.tutorName}</p>
        <div className="mt-3 flex items-center justify-between">
          <RatingStars rating={course.ratingAvg} count={course.ratingCount} />
          <span className="font-semibold text-slate-900">{centsToDisplay(course.priceCents)}</span>
        </div>
      </div>
    </Link>
  );
}
