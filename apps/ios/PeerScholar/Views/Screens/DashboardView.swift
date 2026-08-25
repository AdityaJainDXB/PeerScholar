import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var auth: AuthManager

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                if auth.isSignedIn {
                    Picker("View", selection: $auth.viewMode) {
                        Text("Learner").tag(ViewMode.learner)
                        Text("Teacher").tag(ViewMode.teacher)
                    }
                    .pickerStyle(.segmented)
                }

                if auth.viewMode == .teacher && auth.isSignedIn {
                    TeacherDashboardContent()
                        .transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity), removal: .move(edge: .leading).combined(with: .opacity)))
                } else {
                    LearnerDashboardContent()
                        .transition(.asymmetric(insertion: .move(edge: .leading).combined(with: .opacity), removal: .move(edge: .trailing).combined(with: .opacity)))
                }
            }
            .animation(.spring(response: 0.4, dampingFraction: 0.85), value: auth.viewMode)
            .padding()
        }
        .navigationTitle(auth.viewMode == .teacher && auth.isSignedIn ? "Analytics" : "My Learning")
    }
}

private struct LearnerDashboardContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Live classes", systemImage: "video.fill").font(.title3.bold())
            ForEach(MockData.liveSessions) { session in
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(session.title).font(.headline)
                        Text("with \(session.tutorName) · \(session.scheduledAt.formatted(date: .abbreviated, time: .shortened))")
                            .font(.caption).foregroundStyle(.secondary)
                    }
                    Spacer()
                    if let joinUrl = session.joinUrl, let url = URL(string: joinUrl) {
                        Link("Join", destination: url)
                            .font(.caption.bold())
                            .padding(.horizontal, 12).padding(.vertical, 6)
                            .background(Color.brand.opacity(0.12))
                            .foregroundStyle(Color.brand)
                            .clipShape(Capsule())
                    }
                }
                .cardBackground()
            }
        }

        VStack(alignment: .leading, spacing: 10) {
            Text("Continue learning").font(.title3.bold())
            ForEach(Array(MockData.courses.prefix(3).enumerated()), id: \.element.id) { index, course in
                let progress = [0.62, 0.18, 0.90][index % 3]
                VStack(alignment: .leading, spacing: 0) {
                    Thumbnail(seed: course.id, height: 90, badge: course.subject)
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(course.title).font(.headline)
                            Spacer()
                            Text("\(Int(progress * 100))%").font(.caption).foregroundStyle(.secondary)
                        }
                        ProgressView(value: progress).tint(Color.brand)
                    }
                    .padding(12)
                }
                .background(Color(.secondarySystemGroupedBackground))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                .appearAnimation(delay: Double(index) * 0.06)
            }
        }
    }
}

private struct TeacherDashboardContent: View {
    var myCourses: [Course] { MockData.courses.filter { $0.tutorId == MockData.currentUserId } }
    var mySessions: [LiveSession] { MockData.liveSessions.filter { $0.tutorId == MockData.currentUserId } }
    var earningsCents: Int { myCourses.reduce(0) { $0 + Int(Double($1.enrollmentCount) * Double($1.priceCents) * 0.85) } }
    var totalStudents: Int { myCourses.reduce(0) { $0 + $1.enrollmentCount } }
    var newest: Course? { myCourses.max(by: { $0.createdAt < $1.createdAt }) }
    var topSelling: [Course] { myCourses.sorted { $0.enrollmentCount > $1.enrollmentCount } }
    var maxWeekly: Int { MockData.earningsHistory.map(\.cents).max() ?? 1 }
    @State private var chartGrown = false

    var body: some View {
        if let newest {
            HStack(spacing: 10) {
                Text("New").font(.caption.bold()).foregroundStyle(.white)
                    .padding(.horizontal, 10).padding(.vertical, 5)
                    .background(Color.brand).clipShape(Capsule())
                Text("\(newest.title) — \(newest.enrollmentCount) students enrolled so far.")
                    .font(.caption)
            }
            .padding(12)
            .background(Color.brand.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }

        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            StatCard(label: "Est. earnings", value: centsToDisplay(earningsCents))
            StatCard(label: "Total students", value: "\(totalStudents)")
            StatCard(label: "Published courses", value: "\(myCourses.filter { $0.status == .published }.count)")
            StatCard(label: "Live sessions", value: "\(mySessions.count)")
        }

        VStack(alignment: .leading, spacing: 12) {
            Text("Earnings, last 6 weeks").font(.title3.bold())
            HStack(alignment: .bottom, spacing: 10) {
                ForEach(MockData.earningsHistory) { week in
                    VStack(spacing: 4) {
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color.brand.gradient)
                            .frame(height: chartGrown ? max(6, CGFloat(week.cents) / CGFloat(maxWeekly) * 100) : 0)
                        Text(week.label).font(.system(size: 10)).foregroundStyle(.secondary)
                    }
                }
            }
            .frame(height: 120, alignment: .bottom)
            .onAppear {
                withAnimation(.spring(response: 0.6, dampingFraction: 0.75)) { chartGrown = true }
            }
        }
        .cardBackground()

        VStack(alignment: .leading, spacing: 10) {
            Text("Top-selling courses").font(.title3.bold())
            ForEach(Array(topSelling.enumerated()), id: \.element.id) { index, course in
                HStack {
                    AvatarImage(seed: course.id, size: 40)
                    Text("\(index + 1)").font(.caption.bold()).foregroundStyle(.secondary)
                        .frame(width: 22, height: 22)
                        .background(Color.gray.opacity(0.15)).clipShape(Circle())
                    VStack(alignment: .leading, spacing: 2) {
                        Text(course.title).font(.subheadline.bold())
                        Text("\(course.enrollmentCount) enrolled · \(course.priceDisplay)")
                            .font(.caption).foregroundStyle(.secondary)
                    }
                    Spacer()
                }
                .cardBackground()
            }
        }

        VStack(alignment: .leading, spacing: 10) {
            Text("Your live sessions").font(.title3.bold())
            ForEach(mySessions) { session in
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(session.title).font(.headline)
                        Text("\(session.bookedCount)/\(session.maxParticipants) booked")
                            .font(.caption).foregroundStyle(.secondary)
                    }
                    Spacer()
                    if let joinUrl = session.joinUrl {
                        Button {
                            UIPasteboard.general.string = joinUrl
                        } label: {
                            Text("Copy link").font(.caption.bold())
                        }
                    }
                }
                .cardBackground()
            }
        }
    }
}

private struct StatCard: View {
    let label: String
    let value: String
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label).font(.caption).foregroundStyle(.secondary)
            Text(value).font(.title3.bold())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .cardBackground()
    }
}
