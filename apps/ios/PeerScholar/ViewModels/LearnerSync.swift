import Foundation
import FirebaseCore
import FirebaseAuth
import FirebaseFirestore

/// Firestore access for a learner's own progress document, `learnerState/{uid}`
/// (owner-only per firebase/firestore.rules).
///
/// Matches the web app's apps/web/lib/learnerState.ts so both clients read and
/// write the same shape. Every call no-ops safely when Firebase isn't
/// configured, so the app still runs on mock data with no project attached.
enum LearnerSync {
    struct State {
        var enrollments: [String]
        var completedLessons: [String: [String]]
        var bookings: [String]

        static let empty = State(enrollments: [], completedLessons: [:], bookings: [])
    }

    enum SyncError: Error {
        case notConfigured
    }

    static var isConfigured: Bool { FirebaseApp.app() != nil }

    static var currentUid: String? {
        guard isConfigured else { return nil }
        return Auth.auth().currentUser?.uid
    }

    static func fetch(uid: String) async throws -> State {
        guard isConfigured else { throw SyncError.notConfigured }
        let snapshot = try await Firestore.firestore().collection("learnerState").document(uid).getDocument()
        guard let data = snapshot.data() else { return .empty }
        return State(
            enrollments: data["enrollments"] as? [String] ?? [],
            completedLessons: data["completedLessons"] as? [String: [String]] ?? [:],
            bookings: data["bookings"] as? [String] ?? []
        )
    }

    static func save(uid: String, state: State) async throws {
        guard isConfigured else { throw SyncError.notConfigured }
        try await Firestore.firestore().collection("learnerState").document(uid).setData(
            [
                "enrollments": state.enrollments,
                "completedLessons": state.completedLessons,
                "bookings": state.bookings,
                "updatedAt": ISO8601DateFormatter().string(from: Date()),
            ],
            merge: true
        )
    }
}
