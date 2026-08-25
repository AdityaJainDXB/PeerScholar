// Shared domain types used by both the website (apps/web) and the mobile
// app (apps/mobile), so the two front ends can't drift apart on shape.
// Mirrors the tables defined in supabase/schema.sql.

export type UserRole = "student" | "tutor" | "qa_reviewer" | "admin";
export type AgeBracket = "under_13" | "13_to_17" | "18_plus";
export type CourseStatus = "draft" | "pending_review" | "published" | "flagged" | "rejected";
export type SessionStatus = "scheduled" | "completed" | "cancelled" | "flagged";
export type BookingStatus = "confirmed" | "cancelled" | "completed" | "no_show";
export type PaymentType = "course" | "session";
export type PaymentStatus = "pending" | "held" | "released" | "refunded";

export interface Profile {
  id: string;
  fullName: string;
  role: UserRole;
  schoolEmail?: string;
  ageBracket: AgeBracket;
  parentalConsentGiven: boolean;
  avatarUrl?: string;
  bio?: string;
  isIdVerified: boolean;
  ratingAvg?: number;
  ratingCount?: number;
}

export interface Subject {
  id: string;
  name: string;
  category: string;
}

export interface Course {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  priceCents: number;
  status: CourseStatus;
  lessonCount: number;
  totalDurationMinutes: number;
  ratingAvg: number;
  ratingCount: number;
  enrollmentCount: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl?: string;
  durationSeconds: number;
  position: number;
  isPreview: boolean;
}

export interface LiveSession {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  title: string;
  description: string;
  priceCents: number;
  scheduledAt: string; // ISO string
  durationMinutes: number;
  maxParticipants: number;
  bookedCount: number;
  status: SessionStatus;
}

export interface Booking {
  id: string;
  sessionId: string;
  studentId: string;
  status: BookingStatus;
  bookedAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  targetType: "tutor" | "course";
  targetId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface QaReview {
  id: string;
  qaReviewerId: string;
  targetType: "course" | "live_session";
  targetId: string;
  targetTitle: string;
  rubricScore: Record<string, number>;
  passed: boolean;
  notes: string;
  reviewedAt: string;
}

export const PLATFORM_COMMISSION = {
  session: 0.18,
  course: 0.15,
} as const;

export function centsToDisplay(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
