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

// Deterministic stand-in photography — same source picsum.photos/pravatar.cc
// used by the website, so every front end demos with the same imagery.
enum RemoteImage {
    static func photo(seed: String, width: Int = 480, height: Int = 320) -> URL? {
        URL(string: "https://picsum.photos/seed/\(seed)/\(width)/\(height)")
    }
    static func avatar(seed: String, size: Int = 128) -> URL? {
        URL(string: "https://i.pravatar.cc/\(size)?u=\(seed)")
    }
}

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .animation(.spring(response: 0.25, dampingFraction: 0.6), value: configuration.isPressed)
    }
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

struct Thumbnail: View {
    let seed: String
    var height: CGFloat = 110
    var badge: String? = nil

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            AsyncImage(url: RemoteImage.photo(seed: seed)) { phase in
                switch phase {
                case .success(let image):
                    image.resizable().scaledToFill()
                default:
                    LinearGradient(colors: [Color.brandNavy, Color.brand], startPoint: .topLeading, endPoint: .bottomTrailing)
                }
            }
            .frame(height: height)
            .frame(maxWidth: .infinity)
            .clipped()

            LinearGradient(colors: [.black.opacity(0.65), .clear], startPoint: .bottom, endPoint: .center)
                .frame(height: height)

            if let badge {
                Text(badge.uppercased())
                    .font(.caption2.weight(.bold))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 10)
                    .padding(.bottom, 8)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

struct AvatarImage: View {
    let seed: String
    var size: CGFloat = 48

    var body: some View {
        AsyncImage(url: RemoteImage.avatar(seed: seed, size: Int(size * 2))) { phase in
            switch phase {
            case .success(let image):
                image.resizable().scaledToFill()
            default:
                Circle().fill(LinearGradient(colors: [Color.brandNavy, Color.brand], startPoint: .top, endPoint: .bottom))
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay(Circle().stroke(.white, lineWidth: 2))
        .shadow(color: .black.opacity(0.1), radius: 3, y: 1)
    }
}

struct CourseRow: View {
    let course: Course
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Thumbnail(seed: course.id, badge: course.subject)
            VStack(alignment: .leading, spacing: 4) {
                Text(course.title).font(.headline)
                Text("by \(course.tutorName)").font(.subheadline).foregroundStyle(.secondary)
                HStack {
                    RatingStars(rating: course.ratingAvg, count: course.ratingCount)
                    Spacer()
                    Text(course.priceDisplay).font(.subheadline.weight(.bold))
                }
            }
            .padding(12)
        }
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

struct TutorRow: View {
    let tutor: Profile
    var body: some View {
        HStack(spacing: 12) {
            AvatarImage(seed: tutor.id, size: 48)
            VStack(alignment: .leading, spacing: 4) {
                Text(tutor.fullName).font(.headline)
                RatingStars(rating: tutor.ratingAvg, count: tutor.ratingCount)
                Text(tutor.bio).font(.caption).foregroundStyle(.secondary).lineLimit(2)
            }
        }
        .cardBackground()
    }
}

struct SessionCard: View {
    let session: LiveSession
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Thumbnail(seed: session.id, height: 90, badge: "● Live")
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
                    .buttonStyle(ScaleButtonStyle())
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(Color.brand)
                    .foregroundStyle(.white)
                    .fontWeight(.semibold)
                    .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            }
            .padding(12)
        }
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

/// Fades and slides content up on first appearance — used to give scroll
/// views a gentler, staggered entrance instead of popping in instantly.
/// Skips the motion entirely when the person has Reduce Motion turned on
/// (Design Guideline — Accessibility > Cognitive).
struct AppearAnimation: ViewModifier {
    var delay: Double = 0
    @State private var shown = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func body(content: Content) -> some View {
        content
            .opacity(reduceMotion ? 1 : (shown ? 1 : 0))
            .offset(y: reduceMotion ? 0 : (shown ? 0 : 12))
            .onAppear {
                guard !reduceMotion else { return }
                withAnimation(.easeOut(duration: 0.5).delay(delay)) {
                    shown = true
                }
            }
    }
}

extension View {
    func appearAnimation(delay: Double = 0) -> some View { modifier(AppearAnimation(delay: delay)) }
}
