import Link from "next/link";
import type { Course } from "@shared/types";
import { centsToDisplay } from "@shared/types";
import RatingStars from "./RatingStars";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${course.id}/480/320`}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
        <span className="absolute bottom-2 left-3 text-xs font-bold uppercase tracking-wide text-white drop-shadow">
          {course.subject}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-900">{course.title}</h3>
        <p className="mt-1 text-sm text-slate-500">by {course.tutorName}</p>
        <div className="mt-3 flex items-center justify-between">
          <RatingStars rating={course.ratingAvg} count={course.ratingCount} />
          <span className="font-semibold text-slate-900">{centsToDisplay(course.priceCents)}</span>
        </div>
      </div>
    </Link>
  );
}
