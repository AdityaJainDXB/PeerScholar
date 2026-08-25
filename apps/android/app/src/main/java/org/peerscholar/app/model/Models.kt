package org.peerscholar.app.model

import java.util.Date

// Mirrors packages/shared/src/types.ts / apps/ios Models.swift so all
// three front ends share one data shape.

enum class UserRole { STUDENT, TUTOR, QA_REVIEWER, ADMIN }
enum class AgeBracket { UNDER_13, TEEN_13_17, ADULT_18_PLUS }
enum class CourseStatus { DRAFT, PENDING_REVIEW, PUBLISHED, FLAGGED, REJECTED }
enum class SessionStatus { SCHEDULED, COMPLETED, CANCELLED, FLAGGED }

data class Profile(
    val id: String,
    val fullName: String,
    val role: UserRole,
    val bio: String,
    val isIdVerified: Boolean,
    val ratingAvg: Double,
    val ratingCount: Int,
)

data class Course(
    val id: String,
    val tutorId: String,
    val tutorName: String,
    val subject: String,
    val title: String,
    val description: String,
    val priceCents: Int,
    val status: CourseStatus,
    val lessonCount: Int,
    val totalDurationMinutes: Int,
    val ratingAvg: Double,
    val ratingCount: Int,
    val enrollmentCount: Int,
) {
    val priceDisplay: String get() = centsToDisplay(priceCents)
}

data class LiveSession(
    val id: String,
    val tutorId: String,
    val tutorName: String,
    val subject: String,
    val title: String,
    val description: String,
    val priceCents: Int,
    val scheduledAt: Date,
    val durationMinutes: Int,
    val maxParticipants: Int,
    val bookedCount: Int,
    val status: SessionStatus,
) {
    val priceDisplay: String get() = centsToDisplay(priceCents)
    val spotsLeft: Int get() = maxParticipants - bookedCount
}

fun centsToDisplay(cents: Int): String = "$%.2f".format(cents / 100.0)
