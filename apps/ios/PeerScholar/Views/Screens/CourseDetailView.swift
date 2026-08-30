import SwiftUI

struct CourseDetailView: View {
    let course: Course
    @EnvironmentObject var store: AppStore
    @State private var showCheckout = false
    @State private var enrolling = false
    @State private var goToPlayer = false

    private var lessons: [Lesson] { lessonsForCourse(course) }
    private var enrolled: Bool { store.isEnrolled(course.id) }
    private var progress: Double { store.progress(courseId: course.id, totalLessons: lessons.count) }
    private var isFree: Bool { course.priceCents == 0 }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                SubjectTag(subject: course.subject)
                Text(course.title).font(.title2.bold())
                HStack(spacing: 8) {
                    RatingStars(rating: course.ratingAvg, count: course.ratingCount)
                    if enrolled {
                        Text("ENROLLED")
                            .font(.caption2.weight(.bold))
                            .foregroundStyle(Color.brand)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color.brand.opacity(0.12))
                            .clipShape(Capsule())
                    }
                }
                Text("by \(course.tutorName)").font(.footnote).foregroundStyle(.secondary)
                Text(course.description).font(.subheadline)

                ZStack {
                    Thumbnail(seed: course.id, height: 180)
                    Image(systemName: "play.circle.fill")
                        .font(.system(size: 48))
                        .foregroundStyle(.white)
                        .shadow(radius: 6)
                }
                .appearAnimation()

                curriculum

                enrollCard
            }
            .padding()
        }
        .navigationTitle("Course")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(isPresented: $goToPlayer) {
            CoursePlayerView(course: course)
        }
        .sheet(isPresented: $showCheckout) {
            checkoutSheet
        }
    }

    private var curriculum: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Curriculum — \(course.lessonCount) lessons · \(formatDuration(course.totalDurationMinutes))")
                .font(.headline)
            ForEach(Array(lessons.prefix(6).enumerated()), id: \.element.id) { index, l in
                let lUnlocked = enrolled || l.isPreview
                let lDone = store.isLessonComplete(courseId: course.id, lessonId: l.id)
                HStack(spacing: 10) {
                    Image(systemName: lDone ? "checkmark.circle.fill" : lUnlocked ? "play.circle" : "lock.fill")
                        .font(.caption)
                        .foregroundStyle(lDone ? .green : lUnlocked ? Color.brand : .secondary)
                    Text(l.title)
                        .font(.subheadline)
                        .foregroundStyle(lUnlocked ? .primary : .secondary)
                        .lineLimit(1)
                    Spacer()
                    if l.isPreview && !enrolled {
                        Text("FREE").font(.caption2.bold()).foregroundStyle(Color.brand)
                    }
                    Text("\(l.durationMinutes)m").font(.caption2).foregroundStyle(.secondary)
                }
                .contentShape(Rectangle())
                .onTapGesture {
                    if lUnlocked { goToPlayer = true }
                }
                Divider()
            }
            if lessons.count > 6 {
                Text("+ \(lessons.count - 6) more lessons")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }

    @ViewBuilder
    private var enrollCard: some View {
        VStack(spacing: 10) {
            if enrolled {
                HStack(spacing: 6) {
                    Image(systemName: "checkmark.circle.fill").foregroundStyle(.green)
                    Text("You're enrolled").font(.subheadline.weight(.semibold))
                }
                ProgressView(value: progress).tint(Color.brand)
                Text("\(Int(progress * 100))% complete")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Button {
                    goToPlayer = true
                } label: {
                    Text(progress > 0 ? "Continue learning" : "Start course")
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.brand)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
                .buttonStyle(ScaleButtonStyle())
            } else {
                Text(isFree ? "Free" : course.priceDisplay).font(.system(size: 28, weight: .heavy))
                Button {
                    showCheckout = true
                } label: {
                    Text(isFree ? "Enroll for free" : "Enroll now")
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color.brand)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                }
                .buttonStyle(ScaleButtonStyle())
                Text("Lesson 1 is free to preview")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }

            Text("\(course.enrollmentCount) students enrolled · Lifetime access")
                .font(.caption).foregroundStyle(.secondary)
        }
        .cardBackground()
    }

    private var checkoutSheet: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                HStack(spacing: 12) {
                    Thumbnail(seed: course.id, height: 56)
                        .frame(width: 56)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(course.title).font(.subheadline.bold()).lineLimit(2)
                        Text("by \(course.tutorName)").font(.caption).foregroundStyle(.secondary)
                    }
                    Spacer()
                }

                Divider()

                HStack {
                    Text("Course price").font(.subheadline).foregroundStyle(.secondary)
                    Spacer()
                    Text(isFree ? "Free" : course.priceDisplay).font(.subheadline.weight(.medium))
                }
                HStack {
                    Text("Total").font(.headline)
                    Spacer()
                    Text(isFree ? "$0.00" : course.priceDisplay).font(.headline)
                }

                if !isFree {
                    Text("This prototype doesn't process real payments — enrolling is free while Stripe Connect is still being wired up.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .padding(10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.yellow.opacity(0.15))
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                }

                Spacer()

                Button {
                    enrolling = true
                    // Brief settle so confirming reads as a real action; replaced
                    // by the Stripe round-trip once payments land.
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                        store.enroll(course.id)
                        enrolling = false
                        showCheckout = false
                    }
                } label: {
                    Text(enrolling ? "Enrolling…" : "Confirm & enroll")
                        .font(.subheadline.weight(.semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color.brand)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                }
                .buttonStyle(ScaleButtonStyle())
                .disabled(enrolling)
            }
            .padding()
            .navigationTitle(isFree ? "Enroll" : "Confirm enrollment")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { showCheckout = false }
                }
            }
        }
        .presentationDetents([.medium])
    }
}
