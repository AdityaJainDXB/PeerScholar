import Foundation

// Mirrors packages/shared/src/types.ts so the iOS app's data shapes stay
// in step with the website and Android app.

enum UserRole: String, Codable {
    case student, tutor, qaReviewer = "qa_reviewer", admin
}

enum AgeBracket: String, Codable {
    case under13 = "under_13", teen = "13_to_17", adult = "18_plus"
}

enum CourseStatus: String, Codable {
    case draft, pendingReview = "pending_review", published, flagged, rejected
}

enum SessionStatus: String, Codable {
    case scheduled, completed, cancelled, flagged
}

struct Profile: Identifiable, Codable {
    let id: String
    let fullName: String
    let role: UserRole
    let ageBracket: AgeBracket
    let isIdVerified: Bool
    let bio: String
    let ratingAvg: Double
    let ratingCount: Int
}

struct Course: Identifiable, Codable {
    let id: String
    let tutorId: String
    let tutorName: String
    let subject: String
    let title: String
    let description: String
    let priceCents: Int
    let status: CourseStatus
    let lessonCount: Int
    let totalDurationMinutes: Int
    let ratingAvg: Double
    let ratingCount: Int
    let enrollmentCount: Int

    var priceDisplay: String { centsToDisplay(priceCents) }
}

struct LiveSession: Identifiable, Codable {
    let id: String
    let tutorId: String
    let tutorName: String
    let subject: String
    let title: String
    let description: String
    let priceCents: Int
    let scheduledAt: Date
    let durationMinutes: Int
    let maxParticipants: Int
    let bookedCount: Int
    let status: SessionStatus

    var priceDisplay: String { centsToDisplay(priceCents) }
    var spotsLeft: Int { maxParticipants - bookedCount }
}

func centsToDisplay(_ cents: Int) -> String {
    String(format: "$%.2f", Double(cents) / 100)
}
