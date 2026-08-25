import SwiftUI

struct TutorProfileView: View {
    let tutor: Profile

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                HStack(spacing: 14) {
                    AvatarImage(seed: tutor.id, size: 72)
                    VStack(alignment: .leading, spacing: 6) {
                        Text(tutor.fullName).font(.title2.bold())
                        RatingStars(rating: tutor.ratingAvg, count: tutor.ratingCount)
                    }
                }
                .appearAnimation()
                Text(tutor.bio).font(.subheadline).foregroundStyle(.secondary)

                let sessions = MockData.liveSessions.filter { $0.tutorId == tutor.id }
                if !sessions.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Book a live session").font(.headline)
                        ForEach(sessions) { SessionCard(session: $0) }
                    }
                }

                let courses = MockData.courses.filter { $0.tutorId == tutor.id }
                if !courses.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Courses").font(.headline)
                        ForEach(courses) { course in
                            NavigationLink(value: course.id) { CourseRow(course: course) }
                                .buttonStyle(ScaleButtonStyle())
                        }
                    }
                }
            }
            .padding()
        }
        .navigationTitle(tutor.fullName)
        .navigationBarTitleDisplayMode(.inline)
    }
}
