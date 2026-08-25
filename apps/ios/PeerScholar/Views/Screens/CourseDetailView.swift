import SwiftUI

struct CourseDetailView: View {
    let course: Course

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                SubjectTag(subject: course.subject)
                Text(course.title).font(.title2.bold())
                HStack {
                    RatingStars(rating: course.ratingAvg, count: course.ratingCount)
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

                VStack(alignment: .leading, spacing: 8) {
                    Text("Curriculum — \(course.lessonCount) lessons").font(.headline)
                    ForEach(1...min(course.lessonCount, 6), id: \.self) { i in
                        HStack {
                            Text("Lesson \(i): \(course.subject) fundamentals, part \(i)")
                                .font(.subheadline)
                            Spacer()
                            if i == 1 {
                                Text("PREVIEW").font(.caption2.bold()).foregroundStyle(Color.brand)
                            }
                        }
                        Divider()
                    }
                }

                VStack(spacing: 10) {
                    Text(course.priceDisplay).font(.system(size: 28, weight: .heavy))
                    Button("Enroll now") {}
                        .buttonStyle(.borderedProminent)
                        .tint(Color.brand)
                        .frame(maxWidth: .infinity)
                    Text("\(course.enrollmentCount) students enrolled · Lifetime access")
                        .font(.caption).foregroundStyle(.secondary)
                }
                .cardBackground()
            }
            .padding()
        }
        .navigationTitle("Course")
        .navigationBarTitleDisplayMode(.inline)
    }
}
