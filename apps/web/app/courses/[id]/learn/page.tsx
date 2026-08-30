import { notFound } from "next/navigation";
import { Suspense } from "react";
import CoursePlayer from "@/components/CoursePlayer";
import { mockCourses } from "@/lib/mockData";

export function generateStaticParams() {
  return mockCourses.map((c) => ({ id: c.id }));
}

export default function CourseLearnPage({ params }: { params: { id: string } }) {
  const course = mockCourses.find((c) => c.id === params.id);
  if (!course) return notFound();

  // CoursePlayer reads ?lesson= via useSearchParams, which needs a Suspense
  // boundary to prerender under `output: "export"`.
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-12 text-slate-500">Loading course…</div>}>
      <CoursePlayer course={course} />
    </Suspense>
  );
}
