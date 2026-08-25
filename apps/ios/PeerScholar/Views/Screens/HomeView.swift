import SwiftUI

struct HomeView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Learn from students who\njust got the A.")
                        .font(.system(size: 28, weight: .heavy))
                    Text("Live tutoring and on-demand courses, taught by peers, checked for quality by peers.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .padding(.top, 8)

                VStack(alignment: .leading, spacing: 10) {
                    Text("Popular courses").font(.title3.bold())
                    ForEach(MockData.courses) { course in
                        NavigationLink(value: course.id) { CourseRow(course: course) }
                            .buttonStyle(.plain)
                    }
                }

                VStack(alignment: .leading, spacing: 10) {
                    Text("Top-rated tutors").font(.title3.bold())
                    ForEach(MockData.tutors) { tutor in
                        NavigationLink(value: tutor.id) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(tutor.fullName).font(.headline)
                                RatingStars(rating: tutor.ratingAvg, count: tutor.ratingCount)
                                Text(tutor.bio).font(.caption).foregroundStyle(.secondary).lineLimit(2)
                            }
                            .cardBackground()
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding()
        }
        .navigationTitle("PeerScholar")
        .navigationDestination(for: String.self) { id in
            if let course = MockData.courses.first(where: { $0.id == id }) {
                CourseDetailView(course: course)
            } else if let tutor = MockData.tutors.first(where: { $0.id == id }) {
                TutorProfileView(tutor: tutor)
            }
        }
    }
}
