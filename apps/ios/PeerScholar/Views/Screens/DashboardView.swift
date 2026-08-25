import SwiftUI

struct DashboardView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Upcoming sessions").font(.title3.bold())
                    ForEach(MockData.liveSessions.prefix(2)) { session in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(session.title).font(.headline)
                            Text("with \(session.tutorName) · \(session.scheduledAt.formatted(date: .abbreviated, time: .shortened))")
                                .font(.caption).foregroundStyle(.secondary)
                        }
                        .cardBackground()
                    }
                }

                VStack(alignment: .leading, spacing: 10) {
                    Text("Enrolled courses").font(.title3.bold())
                    ForEach(Array(MockData.courses.prefix(2).enumerated()), id: \.element.id) { index, course in
                        let progress = index == 0 ? 0.62 : 0.18
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text(course.title).font(.headline)
                                Spacer()
                                Text("\(Int(progress * 100))%").font(.caption).foregroundStyle(.secondary)
                            }
                            ProgressView(value: progress).tint(Color.brand)
                        }
                        .cardBackground()
                    }
                }
            }
            .padding()
        }
        .navigationTitle("My Learning")
    }
}
