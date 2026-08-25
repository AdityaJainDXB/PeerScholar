import Link from "next/link";
import type { Profile } from "@shared/types";
import RatingStars from "./RatingStars";
import Badge from "./Badge";

export default function TutorCard({ tutor }: { tutor: Profile }) {
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-500 font-semibold text-white">
          {tutor.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
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
