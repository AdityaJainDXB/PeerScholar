import SwiftUI

struct CardBackground: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(14)
            .background(Color(.secondarySystemGroupedBackground))
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

extension View {
    func cardBackground() -> some View { modifier(CardBackground()) }
}

struct RatingStars: View {
    let rating: Double
    var count: Int? = nil

    var body: some View {
        if rating == 0 {
            Text("No ratings yet").font(.caption).foregroundStyle(.secondary)
        } else {
            HStack(spacing: 4) {
                Image(systemName: "star.fill").foregroundStyle(.yellow).font(.caption)
                Text(String(format: "%.1f", rating)).font(.subheadline.weight(.semibold))
                if let count {
                    Text("(\(count))").font(.caption).foregroundStyle(.secondary)
                }
            }
        }
    }
}

struct SubjectTag: View {
    let subject: String
    var body: some View {
        Text(subject.uppercased())
            .font(.caption2.weight(.bold))
            .foregroundStyle(Color.brand)
    }
}

struct CourseRow: View {
    let course: Course
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            SubjectTag(subject: course.subject)
            Text(course.title).font(.headline)
            Text("by \(course.tutorName)").font(.subheadline).foregroundStyle(.secondary)
            HStack {
                RatingStars(rating: course.ratingAvg, count: course.ratingCount)
                Spacer()
                Text(course.priceDisplay).font(.subheadline.weight(.bold))
            }
        }
        .cardBackground()
    }
}

struct SessionCard: View {
    let session: LiveSession
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            SubjectTag(subject: session.subject)
            Text(session.title).font(.headline)
            Text("with \(session.tutorName)").font(.subheadline).foregroundStyle(.secondary)
            Text(session.scheduledAt.formatted(date: .abbreviated, time: .shortened) + " · \(session.durationMinutes) min")
                .font(.caption).foregroundStyle(.secondary)
            HStack {
                Text("\(session.spotsLeft) of \(session.maxParticipants) spots left")
                    .font(.caption).foregroundStyle(.secondary)
                Spacer()
                Text(session.priceDisplay).font(.subheadline.weight(.bold))
            }
            Button("Book session") {}
                .buttonStyle(.borderedProminent)
                .tint(Color.brand)
                .frame(maxWidth: .infinity)
        }
        .cardBackground()
    }
}
