import SwiftUI

/// The lesson player — the screen behind "Start course" / "Continue learning".
/// Mirrors the web player (apps/web/components/CoursePlayer.tsx).
struct CoursePlayerView: View {
    let course: Course
    @EnvironmentObject var store: AppStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    @State private var currentIndex: Int
    @State private var showConfetti = false

    init(course: Course, startAt: Int = 0) {
        self.course = course
        _currentIndex = State(initialValue: startAt)
    }

    private var lessons: [Lesson] { lessonsForCourse(course) }
    private var lesson: Lesson { lessons[min(currentIndex, lessons.count - 1)] }
    private var enrolled: Bool { store.isEnrolled(course.id) }
    private var unlocked: Bool { enrolled || lesson.isPreview }
    private var done: Bool { store.isLessonComplete(courseId: course.id, lessonId: lesson.id) }
    private var completed: Int { store.completedCount(courseId: course.id) }
    private var allDone: Bool { completed == lessons.count && !lessons.isEmpty }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                progressHeader

                if allDone {
                    completionBanner
                }

                playerSurface

                VStack(alignment: .leading, spacing: 6) {
                    Text("LESSON \(currentIndex + 1) OF \(lessons.count)")
                        .font(.caption2.weight(.bold))
                        .foregroundStyle(Color.brand)
                    Text(lesson.title).font(.title3.bold())
                    Text("\(lesson.durationMinutes) minutes · taught by \(course.tutorName)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                controls

                lessonList
            }
            .padding()
        }
        .navigationTitle("Course")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var progressHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(course.title).font(.headline)
            HStack(spacing: 10) {
                ProgressView(value: store.progress(courseId: course.id, totalLessons: lessons.count))
                    .tint(Color.brand)
                Text("\(Int(store.progress(courseId: course.id, totalLessons: lessons.count) * 100))%")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                    .monospacedDigit()
            }
        }
    }

    private var completionBanner: some View {
        HStack(spacing: 12) {
            Text("🎓").font(.largeTitle)
            VStack(alignment: .leading, spacing: 2) {
                Text("You finished the course!").font(.subheadline.bold())
                Text("Your certificate is ready in My Learning.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
        }
        .padding(12)
        .background(Color.green.opacity(0.12))
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private var playerSurface: some View {
        ZStack {
            Thumbnail(seed: lesson.id, height: 200)
            if unlocked {
                VStack(spacing: 8) {
                    Image(systemName: "play.circle.fill")
                        .font(.system(size: 48))
                        .foregroundStyle(.white)
                        .shadow(radius: 6)
                    Text("Video playback arrives with Firebase Storage.")
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.9))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
            } else {
                VStack(spacing: 10) {
                    Image(systemName: "lock.fill")
                        .font(.system(size: 32))
                        .foregroundStyle(.white)
                    Text("This lesson is for enrolled students")
                        .font(.subheadline.bold())
                        .foregroundStyle(.white)
                    Button {
                        store.enroll(course.id)
                    } label: {
                        Text("Enroll for \(course.priceCents == 0 ? "free" : course.priceDisplay)")
                            .font(.subheadline.weight(.semibold))
                            .padding(.horizontal, 18)
                            .padding(.vertical, 10)
                            .background(.white)
                            .foregroundStyle(.black)
                            .clipShape(Capsule())
                    }
                    .buttonStyle(ScaleButtonStyle())
                }
                .padding()
            }
        }
    }

    private var controls: some View {
        HStack(spacing: 10) {
            Button {
                withAnimation(reduceMotion ? nil : .easeOut(duration: 0.2)) {
                    currentIndex = max(0, currentIndex - 1)
                }
            } label: {
                Text("Previous").font(.subheadline.weight(.medium))
            }
            .buttonStyle(.bordered)
            .disabled(currentIndex == 0)

            if unlocked {
                Button {
                    store.toggleLesson(courseId: course.id, lessonId: lesson.id)
                    if !done && currentIndex < lessons.count - 1 {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                            withAnimation(reduceMotion ? nil : .easeOut(duration: 0.2)) {
                                currentIndex = min(lessons.count - 1, currentIndex + 1)
                            }
                        }
                    }
                } label: {
                    Text(done ? "✓ Completed" : "Mark complete")
                        .font(.subheadline.weight(.semibold))
                }
                .buttonStyle(.borderedProminent)
                .tint(done ? .green : Color.brand)
            }

            Button {
                withAnimation(reduceMotion ? nil : .easeOut(duration: 0.2)) {
                    currentIndex = min(lessons.count - 1, currentIndex + 1)
                }
            } label: {
                Text("Next").font(.subheadline.weight(.medium))
            }
            .buttonStyle(.bordered)
            .disabled(currentIndex == lessons.count - 1)
        }
    }

    private var lessonList: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Course content").font(.headline)
                Spacer()
                Text("\(completed) of \(lessons.count) · \(formatDuration(course.totalDurationMinutes))")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            VStack(spacing: 0) {
                ForEach(Array(lessons.enumerated()), id: \.element.id) { index, l in
                    let lDone = store.isLessonComplete(courseId: course.id, lessonId: l.id)
                    let lUnlocked = enrolled || l.isPreview
                    Button {
                        withAnimation(reduceMotion ? nil : .easeOut(duration: 0.2)) {
                            currentIndex = index
                        }
                    } label: {
                        HStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(lDone ? Color.green.opacity(0.15)
                                          : lUnlocked ? Color.brand.opacity(0.15)
                                          : Color.gray.opacity(0.15))
                                if lDone {
                                    Image(systemName: "checkmark")
                                        .font(.caption2.weight(.bold))
                                        .foregroundStyle(.green)
                                } else if lUnlocked {
                                    Text("\(index + 1)")
                                        .font(.caption2.weight(.bold))
                                        .foregroundStyle(Color.brand)
                                } else {
                                    Image(systemName: "lock.fill")
                                        .font(.caption2)
                                        .foregroundStyle(.secondary)
                                }
                            }
                            .frame(width: 26, height: 26)

                            VStack(alignment: .leading, spacing: 2) {
                                Text(l.title)
                                    .font(.subheadline)
                                    .fontWeight(index == currentIndex ? .semibold : .regular)
                                    .foregroundStyle(index == currentIndex ? Color.brand : .primary)
                                    .lineLimit(1)
                                Text("\(l.durationMinutes)m")
                                    .font(.caption2)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                        }
                        .padding(.vertical, 10)
                        .padding(.horizontal, 12)
                        .background(index == currentIndex ? Color.brand.opacity(0.07) : .clear)
                    }
                    .buttonStyle(.plain)

                    if index < lessons.count - 1 { Divider().padding(.leading, 50) }
                }
            }
            .background(Color(.secondarySystemGroupedBackground))
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
    }
}
