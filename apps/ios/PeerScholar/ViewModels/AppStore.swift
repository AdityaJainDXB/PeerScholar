import Foundation
import Combine

/// Learner state for the iOS app: enrollments, per-lesson completion, and
/// session bookings.
///
/// Mirrors the web app's AppStore (apps/web/lib/AppStore.tsx) so both front
/// ends behave the same. Persists to UserDefaults, which keeps the whole flow
/// working signed-out and offline; `LearnerSync` layers Firestore on top when
/// someone is signed in.
@MainActor
final class AppStore: ObservableObject {
    @Published private(set) var enrollments: Set<String> = []
    @Published private(set) var completedLessons: [String: Set<String>] = [:]
    @Published private(set) var bookings: Set<String> = []
    @Published private(set) var syncStatus: SyncStatus = .local

    enum SyncStatus {
        case local, syncing, synced, error

        var label: String {
            switch self {
            case .local: return "Saved on this device"
            case .syncing: return "Syncing…"
            case .synced: return "Synced to your account"
            case .error: return "Saved locally — sync unavailable"
            }
        }
    }

    private let defaults = UserDefaults.standard
    private let enrollmentsKey = "peerscholar.enrollments"
    private let lessonsKey = "peerscholar.completedLessons"
    private let bookingsKey = "peerscholar.bookings"

    init() {
        load()
    }

    // MARK: - Enrollment

    func isEnrolled(_ courseId: String) -> Bool { enrollments.contains(courseId) }

    func enroll(_ courseId: String) {
        guard !enrollments.contains(courseId) else { return }
        enrollments.insert(courseId)
        persist()
    }

    func unenroll(_ courseId: String) {
        enrollments.remove(courseId)
        persist()
    }

    // MARK: - Lesson progress

    func isLessonComplete(courseId: String, lessonId: String) -> Bool {
        completedLessons[courseId]?.contains(lessonId) ?? false
    }

    func toggleLesson(courseId: String, lessonId: String) {
        var done = completedLessons[courseId] ?? []
        if done.contains(lessonId) {
            done.remove(lessonId)
        } else {
            done.insert(lessonId)
        }
        completedLessons[courseId] = done
        persist()
    }

    func completedCount(courseId: String) -> Int {
        completedLessons[courseId]?.count ?? 0
    }

    /// Progress as 0...1 so it can drive ProgressView directly.
    func progress(courseId: String, totalLessons: Int) -> Double {
        guard totalLessons > 0 else { return 0 }
        return Double(completedCount(courseId: courseId)) / Double(totalLessons)
    }

    // MARK: - Bookings

    func isBooked(_ sessionId: String) -> Bool { bookings.contains(sessionId) }

    func book(_ sessionId: String) {
        guard !bookings.contains(sessionId) else { return }
        bookings.insert(sessionId)
        persist()
    }

    func cancelBooking(_ sessionId: String) {
        bookings.remove(sessionId)
        persist()
    }

    // MARK: - Persistence

    private func load() {
        enrollments = Set(defaults.stringArray(forKey: enrollmentsKey) ?? [])
        bookings = Set(defaults.stringArray(forKey: bookingsKey) ?? [])
        if let raw = defaults.dictionary(forKey: lessonsKey) as? [String: [String]] {
            completedLessons = raw.mapValues(Set.init)
        }
    }

    private func persist() {
        defaults.set(Array(enrollments), forKey: enrollmentsKey)
        defaults.set(Array(bookings), forKey: bookingsKey)
        defaults.set(completedLessons.mapValues(Array.init), forKey: lessonsKey)
        Task { await pushToCloud() }
    }

    // MARK: - Firestore sync

    /// Pulls cloud state and unions it with what's on device, then writes the
    /// result back. Union semantics mean signing in on a second device adds to
    /// your history rather than clobbering either side.
    func syncOnSignIn(uid: String) async {
        syncStatus = .syncing
        do {
            let remote = try await LearnerSync.fetch(uid: uid)
            enrollments.formUnion(remote.enrollments)
            bookings.formUnion(remote.bookings)
            for (courseId, lessons) in remote.completedLessons {
                completedLessons[courseId, default: []].formUnion(lessons)
            }
            defaults.set(Array(enrollments), forKey: enrollmentsKey)
            defaults.set(Array(bookings), forKey: bookingsKey)
            defaults.set(completedLessons.mapValues(Array.init), forKey: lessonsKey)

            try await LearnerSync.save(uid: uid, state: snapshot())
            syncStatus = .synced
        } catch {
            // Rules not deployed, offline, or Firebase absent — the local layer
            // already holds everything, so degrade rather than fail.
            syncStatus = .error
        }
    }

    func signedOut() {
        syncStatus = .local
    }

    private func pushToCloud() async {
        guard let uid = LearnerSync.currentUid, syncStatus != .syncing else { return }
        do {
            try await LearnerSync.save(uid: uid, state: snapshot())
            syncStatus = .synced
        } catch {
            syncStatus = .error
        }
    }

    private func snapshot() -> LearnerSync.State {
        LearnerSync.State(
            enrollments: Array(enrollments),
            completedLessons: completedLessons.mapValues(Array.init),
            bookings: Array(bookings)
        )
    }
}
