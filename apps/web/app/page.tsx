import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import TutorCard from "@/components/TutorCard";
import { mockCourses, mockTutors } from "@/lib/mockData";
import { VideoIcon, PlayCircleIcon, ShieldIcon, CoinsIcon, SearchIcon, CalendarIcon, SparkleIcon } from "@/components/icons";

const features = [
  { title: "Live 1:1 or group tutoring", desc: "Book a session with a peer tutor, video call built in.", icon: VideoIcon },
  { title: "On-demand courses", desc: "Record once, teach thousands — Udemy-style recorded courses.", icon: PlayCircleIcon },
  { title: "Peer-run quality checks", desc: "Student QA reviewers vet every course and spot-check live sessions.", icon: ShieldIcon },
  { title: "Fair payouts", desc: "Tutors keep the large majority of what they earn.", icon: CoinsIcon },
];

const steps = [
  { icon: SearchIcon, title: "Find your subject", desc: "Search by subject, grade level, price, or rating to find the right peer tutor." },
  { icon: CalendarIcon, title: "Book or enroll", desc: "Book a live session on their schedule, or enroll in a recorded course instantly." },
  { icon: SparkleIcon, title: "Learn with confidence", desc: "Every course and tutor is checked by PeerScholar's student QA program." },
];

const stats = [
  { value: "1,200+", label: "peer tutors" },
  { value: "40+", label: "subjects covered" },
  { value: "15%", label: "platform fee, not 50%" },
  { value: "4.8★", label: "average rating" },
];

export default function HomePage() {
  const publishedCourses = mockCourses.filter((c) => c.status === "published").slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950">
        <img
          src="https://picsum.photos/seed/peerscholar-hero/1600/1000"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(52,128,250,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(245,185,66,0.18), transparent 40%), radial-gradient(circle at 50% 100%, rgba(52,128,250,0.2), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:py-32">
          <span className="animate-fade-in-up inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-200">
            <SparkleIcon className="h-3.5 w-3.5 animate-float-slow" />
            Built by students, for students
          </span>
          <h1 className="stagger-1 animate-fade-in-up mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Learn from students who
            <span className="bg-gradient-to-r from-brand-300 to-amber-300 bg-clip-text text-transparent"> just got the A.</span>
          </h1>
          <p className="stagger-2 animate-fade-in-up mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            PeerScholar connects high school and university students for live tutoring and
            on-demand courses — taught by peers, checked for quality by peers.
          </p>
          <div className="stagger-3 animate-fade-in-up mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/browse" className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl">
              Find a tutor
            </Link>
            <Link href="/dashboard/tutor" className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10">
              Start teaching
            </Link>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-black/20">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`stagger-${Math.min(i + 1, 4)} animate-fade-in-up text-center`}>
                <p className="text-2xl font-extrabold text-white sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`stagger-${Math.min(i + 1, 4)} animate-fade-in-up group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white">
                <f.icon />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How PeerScholar works</h2>
            <p className="mt-2 text-slate-600">Three steps from stuck to confident.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-3 text-6xl font-black text-slate-100 sm:-translate-y-6">
                  {i + 1}
                </span>
                <h3 className="relative mt-5 font-semibold text-slate-900">{s.title}</h3>
                <p className="relative mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
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

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Top-rated tutors</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mockTutors.map((t) => (
            <TutorCard key={t.id} tutor={t} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-gradient-to-br from-brand-600 to-brand-800 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Know a subject cold? Get paid to teach it.</h2>
          <p className="mt-3 text-brand-100">
            Set your own price, teach live or record a course once, and keep the majority of every
            dollar — PeerScholar takes a smaller cut than most tutoring marketplaces.
          </p>
          <Link href="/auth/signup" className="mt-7 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50">
            Become a tutor
          </Link>
        </div>
      </section>
    </div>
  );
}
