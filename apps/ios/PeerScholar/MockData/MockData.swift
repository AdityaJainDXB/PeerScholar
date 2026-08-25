import Foundation

// Same sample data as apps/web/lib/mockData.ts and docs, so every
// front end demos identically until real Firestore data replaces it.
enum MockData {
    static let tutors: [Profile] = [
        Profile(id: "t1", fullName: "Maya Chen", role: .tutor, ageBracket: .adult, isIdVerified: true,
                bio: "Senior at Lincoln High. Tutoring AP Calculus BC and Algebra II for 2 years.",
                ratingAvg: 4.9, ratingCount: 62),
        Profile(id: "t2", fullName: "Jordan Patel", role: .tutor, ageBracket: .adult, isIdVerified: true,
                bio: "CS sophomore at State University. Loves teaching Python to beginners.",
                ratingAvg: 4.8, ratingCount: 41),
        Profile(id: "t4", fullName: "Diego Morales", role: .tutor, ageBracket: .adult, isIdVerified: true,
                bio: "Native Spanish speaker, freshman at State University, tutors Spanish I & II.",
                ratingAvg: 5.0, ratingCount: 18),
    ]

    static let courses: [Course] = [
        Course(id: "c1", tutorId: "t1", tutorName: "Maya Chen", subject: "AP Calculus BC",
               title: "AP Calculus BC: From Limits to Series",
               description: "A full walkthrough of the AP Calc BC curriculum, lots of worked examples.",
               priceCents: 4500, status: .published, lessonCount: 24, totalDurationMinutes: 380,
               ratingAvg: 4.9, ratingCount: 51, enrollmentCount: 312),
        Course(id: "c2", tutorId: "t2", tutorName: "Jordan Patel", subject: "Intro to Python",
               title: "Python From Zero: Build 5 Small Projects",
               description: "No experience needed. We build a calculator, a to-do list, and more.",
               priceCents: 3000, status: .published, lessonCount: 18, totalDurationMinutes: 260,
               ratingAvg: 4.8, ratingCount: 34, enrollmentCount: 201),
        Course(id: "c4", tutorId: "t4", tutorName: "Diego Morales", subject: "Spanish I",
               title: "Conversational Spanish I: Speak From Day One",
               description: "Focused on speaking and listening, not just grammar drills.",
               priceCents: 2000, status: .published, lessonCount: 15, totalDurationMinutes: 190,
               ratingAvg: 5.0, ratingCount: 12, enrollmentCount: 88),
    ]

    static let liveSessions: [LiveSession] = [
        LiveSession(id: "s1", tutorId: "t1", tutorName: "Maya Chen", subject: "AP Calculus BC",
                    title: "1:1 Help — Related Rates & Optimization",
                    description: "Bring your homework or a specific topic you're stuck on.",
                    priceCents: 3500, scheduledAt: Date().addingTimeInterval(3600 * 26),
                    durationMinutes: 45, maxParticipants: 1, bookedCount: 0, status: .scheduled),
        LiveSession(id: "s2", tutorId: "t2", tutorName: "Jordan Patel", subject: "Intro to Python",
                    title: "Group Session — Debugging Your Project",
                    description: "Small group (up to 4). Bring your code, we'll debug together.",
                    priceCents: 1500, scheduledAt: Date().addingTimeInterval(3600 * 50),
                    durationMinutes: 60, maxParticipants: 4, bookedCount: 2, status: .scheduled),
        LiveSession(id: "s3", tutorId: "t4", tutorName: "Diego Morales", subject: "Spanish I",
                    title: "Conversation Practice Hour",
                    description: "Casual conversation practice, all levels welcome.",
                    priceCents: 1200, scheduledAt: Date().addingTimeInterval(3600 * 8),
                    durationMinutes: 60, maxParticipants: 6, bookedCount: 5, status: .scheduled),
    ]
}
