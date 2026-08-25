import { notFound } from "next/navigation";
import RatingStars from "@/components/RatingStars";
import Badge from "@/components/Badge";
import CourseCard from "@/components/CourseCard";
import SessionCard from "@/components/SessionCard";
import { mockCourses, mockLiveSessions, mockReviews, mockTutors } from "@/lib/mockData";

export function generateStaticParams() {
  return mockTutors.map((t) => ({ id: t.id }));
}

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const tutor = mockTutors.find((t) => t.id === params.id);
  if (!tutor) return notFound();

  const courses = mockCourses.filter((c) => c.tutorId === tutor.id && c.status === "published");
  const sessions = mockLiveSessions.filter((s) => s.tutorId === tutor.id);
  const reviews = mockReviews.filter((r) => r.targetType === "tutor" && r.targetId === tutor.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="animate-fade-in-up flex items-start gap-4">
        <img
          src={`https://i.pravatar.cc/160?u=${tutor.id}`}
          alt={tutor.fullName}
          className="h-16 w-16 rounded-full object-cover shadow-sm ring-2 ring-white"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{tutor.fullName}</h1>
            {tutor.isIdVerified && <Badge label="Verified" tone="verified" />}
          </div>
          <RatingStars rating={tutor.ratingAvg ?? 0} count={tutor.ratingCount} />
          <p className="mt-3 text-slate-600">{tutor.bio}</p>
        </div>
      </div>

      {sessions.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Book a live session</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </section>
      )}

      {courses.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Courses</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Reviews</h2>
        {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900">{r.reviewerName}</p>
                <RatingStars rating={r.rating} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
