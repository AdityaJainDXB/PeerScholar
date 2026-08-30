package org.peerscholar.app.data

import org.peerscholar.app.model.Course
import kotlin.math.max
import kotlin.math.roundToInt

data class Lesson(
    val id: String,
    val title: String,
    val durationMinutes: Int,
    val isPreview: Boolean,
    val position: Int,
)

/**
 * Derives a deterministic lesson list from a course, matching the web app's
 * apps/web/lib/lessons.ts and the iOS Lessons.swift, so lesson counts, titles,
 * and IDs line up across platforms until real lesson records land in Firestore.
 */
fun lessonsForCourse(course: Course): List<Lesson> {
    val perLesson = max(1, (course.totalDurationMinutes.toDouble() / course.lessonCount).roundToInt())
    return (0 until course.lessonCount).map { i ->
        Lesson(
            id = "${course.id}-lesson-${i + 1}",
            title = "Lesson ${i + 1}: ${course.subject} fundamentals, part ${i + 1}",
            durationMinutes = perLesson,
            isPreview = i == 0,
            position = i,
        )
    }
}

fun formatDuration(totalMinutes: Int): String {
    val h = totalMinutes / 60
    val m = totalMinutes % 60
    return if (h > 0) "${h}h ${m}m" else "${m}m"
}
