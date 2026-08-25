package org.peerscholar.app.data

import org.peerscholar.app.model.*
import java.util.Date

// Same sample data as the website and iOS app, so every front end demos
// identically until real Firestore data replaces it.
object MockData {
    val tutors = listOf(
        Profile("t1", "Maya Chen", UserRole.TUTOR,
            "Senior at Lincoln High. Tutoring AP Calculus BC and Algebra II for 2 years.",
            true, 4.9, 62),
        Profile("t2", "Jordan Patel", UserRole.TUTOR,
            "CS sophomore at State University. Loves teaching Python to beginners.",
            true, 4.8, 41),
        Profile("t4", "Diego Morales", UserRole.TUTOR,
            "Native Spanish speaker, freshman at State University, tutors Spanish I & II.",
            true, 5.0, 18),
    )

    val courses = listOf(
        Course("c1", "t1", "Maya Chen", "AP Calculus BC",
            "AP Calculus BC: From Limits to Series",
            "A full walkthrough of the AP Calc BC curriculum, lots of worked examples.",
            4500, CourseStatus.PUBLISHED, 24, 380, 4.9, 51, 312),
        Course("c2", "t2", "Jordan Patel", "Intro to Python",
            "Python From Zero: Build 5 Small Projects",
            "No experience needed. We build a calculator, a to-do list, and more.",
            3000, CourseStatus.PUBLISHED, 18, 260, 4.8, 34, 201),
        Course("c4", "t4", "Diego Morales", "Spanish I",
            "Conversational Spanish I: Speak From Day One",
            "Focused on speaking and listening, not just grammar drills.",
            2000, CourseStatus.PUBLISHED, 15, 190, 5.0, 12, 88),
    )

    val liveSessions = listOf(
        LiveSession("s1", "t1", "Maya Chen", "AP Calculus BC",
            "1:1 Help — Related Rates & Optimization",
            "Bring your homework or a specific topic you're stuck on.",
            3500, Date(System.currentTimeMillis() + 3600_000L * 26), 45, 1, 0, SessionStatus.SCHEDULED),
        LiveSession("s2", "t2", "Jordan Patel", "Intro to Python",
            "Group Session — Debugging Your Project",
            "Small group (up to 4). Bring your code, we'll debug together.",
            1500, Date(System.currentTimeMillis() + 3600_000L * 50), 60, 4, 2, SessionStatus.SCHEDULED),
        LiveSession("s3", "t4", "Diego Morales", "Spanish I",
            "Conversation Practice Hour",
            "Casual conversation practice, all levels welcome.",
            1200, Date(System.currentTimeMillis() + 3600_000L * 8), 60, 6, 5, SessionStatus.SCHEDULED),
    )
}
