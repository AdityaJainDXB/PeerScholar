import { notFound } from "next/navigation";
import CourseDetail from "@/components/CourseDetail";
import { mockCourses } from "@/lib/mockData";

export function generateStaticParams() {
  return mockCourses.map((c) => ({ id: c.id }));
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = mockCourses.find((c) => c.id === params.id);
  if (!course) return notFound();

  return <CourseDetail course={course} />;
}
