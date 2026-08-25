import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import TutorCard from "@/components/TutorCard";
import { mockCourses, mockTutors } from "@/lib/mockData";

const features = [
  { title: "Live 1:1 or group tutoring", desc: "Book a session with a peer tutor, video call built in." },
  { title: "On-demand courses", desc: "Record once, teach thousands — Udemy-style recorded courses." },
  { title: "Peer-run quality checks", desc: "Student QA reviewers vet every course and spot-check live sessions." },
  { title: "Fair payouts", desc: "Tutors keep the large majority of what they earn." },
];

export default function HomePage() {
  const publishedCourses = mockCourses.filter((c) => c.status === "published").slice(0, 4);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Learn from students who just got the A.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            PeerScholar connects high school and university students for live tutoring and
            on-demand courses — taught by peers, checked for quality by peers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/browse" className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
              Find a tutor
            </Link>
            <Link href="/dashboard/tutor" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              Start teaching
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Popular courses</h2>
          <Link href="/browse" className="text-sm font-medium text-brand-700 hover:underline">
            Browse all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {publishedCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Top-rated tutors</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockTutors.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
