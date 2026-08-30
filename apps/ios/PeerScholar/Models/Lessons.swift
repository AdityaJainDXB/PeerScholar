import Foundation

struct Lesson: Identifiable, Hashable {
    let id: String
    let title: String
    let durationMinutes: Int
    let isPreview: Bool
    let position: Int
}

/// Derives a deterministic lesson list from a course, matching the web app's
/// apps/web/lib/lessons.ts, so lesson counts, titles, and IDs line up across
/// platforms until real lesson records land in Firestore.
func lessonsForCourse(_ course: Course) -> [Lesson] {
    let perLesson = max(1, Int((Double(course.totalDurationMinutes) / Double(course.lessonCount)).rounded()))
    return (0..<course.lessonCount).map { i in
        Lesson(
            id: "\(course.id)-lesson-\(i + 1)",
            title: "Lesson \(i + 1): \(course.subject) fundamentals, part \(i + 1)",
            durationMinutes: perLesson,
            isPreview: i == 0,
            position: i
        )
    }
}

func formatDuration(_ totalMinutes: Int) -> String {
    let h = totalMinutes / 60
    let m = totalMinutes % 60
    return h > 0 ? "\(h)h \(m)m" : "\(m)m"
}
