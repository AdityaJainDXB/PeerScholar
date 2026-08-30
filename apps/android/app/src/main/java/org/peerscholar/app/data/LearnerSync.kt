package org.peerscholar.app.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

/**
 * Firestore access for a learner's own progress document, `learnerState/{uid}`
 * (owner-only per firebase/firestore.rules).
 *
 * Matches apps/web/lib/learnerState.ts and the iOS LearnerSync so all three
 * clients read and write the same shape. Every call throws rather than
 * silently succeeding when Firebase isn't wired up, and callers treat failure
 * as "stay local".
 */
object LearnerSync {
    data class State(
        val enrollments: List<String> = emptyList(),
        val completedLessons: Map<String, List<String>> = emptyMap(),
        val bookings: List<String> = emptyList(),
    )

    fun currentUid(): String? = runCatching { FirebaseAuth.getInstance().currentUser?.uid }.getOrNull()

    suspend fun fetch(uid: String): State {
        val snapshot = FirebaseFirestore.getInstance()
            .collection("learnerState")
            .document(uid)
            .get()
            .await()

        if (!snapshot.exists()) return State()

        @Suppress("UNCHECKED_CAST")
        val lessons = (snapshot.get("completedLessons") as? Map<String, List<String>>) ?: emptyMap()

        return State(
            enrollments = (snapshot.get("enrollments") as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
            completedLessons = lessons,
            bookings = (snapshot.get("bookings") as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
        )
    }

    suspend fun save(uid: String, state: State) {
        FirebaseFirestore.getInstance()
            .collection("learnerState")
            .document(uid)
            .set(
                mapOf(
                    "enrollments" to state.enrollments,
                    "completedLessons" to state.completedLessons,
                    "bookings" to state.bookings,
                    "updatedAt" to System.currentTimeMillis(),
                ),
                com.google.firebase.firestore.SetOptions.merge(),
            )
            .await()
    }
}
