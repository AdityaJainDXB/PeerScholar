import type { Course } from "@shared/types";

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  isPreview: boolean;
  position: number;
}

// Until real lesson records live in Firestore, every surface (course detail,
// player, progress bars) derives the same deterministic lesson list from the
// course so they can't disagree about lesson count, order, or titles.
export function lessonsForCourse(course: Course): Lesson[] {
  const perLesson = Math.max(1, Math.round(course.totalDurationMinutes / course.lessonCount));
  return Array.from({ length: course.lessonCount }).map((_, i) => ({
    id: `${course.id}-lesson-${i + 1}`,
    title: `Lesson ${i + 1}: ${course.subject} fundamentals, part ${i + 1}`,
    durationMinutes: perLesson,
    isPreview: i === 0,
    position: i,
  }));
}

export function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
