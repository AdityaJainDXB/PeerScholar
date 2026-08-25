import Link from "next/link";
import type { Profile } from "@shared/types";
import RatingStars from "./RatingStars";
import Badge from "./Badge";

export default function TutorCard({ tutor }: { tutor: Profile }) {
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
    >
      <div className="flex items-center gap-3">
        <img
          src={`https://i.pravatar.cc/96?u=${tutor.id}`}
          alt={tutor.fullName}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm transition duration-300 group-hover:scale-105"
        />
        <div>
          <p className="font-semibold text-slate-900">{tutor.fullName}</p>
          <RatingStars rating={tutor.ratingAvg ?? 0} count={tutor.ratingCount} />
        </div>
        {tutor.isIdVerified && <Badge label="Verified" tone="verified" />}
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{tutor.bio}</p>
    </Link>
  );
}
