import SwiftUI

struct HomeView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                ZStack(alignment: .bottomLeading) {
                    LinearGradient(colors: [Color.brand, .purple], startPoint: .topLeading, endPoint: .bottomTrailing)
                        .frame(height: 170)
                        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Learn from students who\njust got the A.")
                            .font(.system(size: 24, weight: .heavy))
                            .foregroundStyle(.white)
                        Text("Live tutoring & on-demand courses, taught by peers.")
                            .font(.subheadline)
                            .foregroundStyle(.white.opacity(0.85))
                    }
                    .padding(18)
                }
                .appearAnimation()

                VStack(alignment: .leading, spacing: 10) {
                    Text("Popular courses").font(.title3.bold())
                    ForEach(Array(MockData.courses.enumerated()), id: \.element.id) { index, course in
                        NavigationLink(value: course.id) { CourseRow(course: course) }
                            .buttonStyle(ScaleButtonStyle())
                            .appearAnimation(delay: Double(index) * 0.06)
                    }
                }

                VStack(alignment: .leading, spacing: 10) {
                    Text("Top-rated tutors").font(.title3.bold())
                    ForEach(Array(MockData.tutors.enumerated()), id: \.element.id) { index, tutor in
                        NavigationLink(value: tutor.id) { TutorRow(tutor: tutor) }
                            .buttonStyle(ScaleButtonStyle())
                            .appearAnimation(delay: Double(index) * 0.06)
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
