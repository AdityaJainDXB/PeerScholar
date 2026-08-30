package org.peerscholar.app.data

import android.content.Context
import android.content.SharedPreferences
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject

enum class SyncStatus(val label: String) {
    LOCAL("Saved on this device"),
    SYNCING("Syncing…"),
    SYNCED("Synced to your account"),
    ERROR("Saved locally — sync unavailable"),
}

data class LearnerUiState(
    val enrollments: Set<String> = emptySet(),
    val completedLessons: Map<String, Set<String>> = emptyMap(),
    val bookings: Set<String> = emptySet(),
    val syncStatus: SyncStatus = SyncStatus.LOCAL,
)

/**
 * Learner state for the Android app: enrollments, per-lesson completion, and
 * session bookings.
 *
 * Mirrors the web app's AppStore (apps/web/lib/AppStore.tsx) and the iOS
 * AppStore so all three front ends behave the same. Persists to
 * SharedPreferences so the flow works signed-out and offline; LearnerSync
 * layers Firestore on top when someone is signed in.
 */
class AppStore : ViewModel() {
    private val _state = MutableStateFlow(LearnerUiState())
    val state: StateFlow<LearnerUiState> = _state

    private var prefs: SharedPreferences? = null

    fun attach(context: Context) {
        if (prefs != null) return
        prefs = context.applicationContext.getSharedPreferences("peerscholar", Context.MODE_PRIVATE)
        load()
    }

    // ---- Enrollment ----

    fun isEnrolled(courseId: String) = _state.value.enrollments.contains(courseId)

    fun enroll(courseId: String) {
        if (isEnrolled(courseId)) return
        _state.value = _state.value.copy(enrollments = _state.value.enrollments + courseId)
        persist()
    }

    fun unenroll(courseId: String) {
        _state.value = _state.value.copy(enrollments = _state.value.enrollments - courseId)
        persist()
    }

    // ---- Lesson progress ----

    fun isLessonComplete(courseId: String, lessonId: String) =
        _state.value.completedLessons[courseId]?.contains(lessonId) == true

    fun toggleLesson(courseId: String, lessonId: String) {
        val done = _state.value.completedLessons[courseId] ?: emptySet()
        val next = if (done.contains(lessonId)) done - lessonId else done + lessonId
        _state.value = _state.value.copy(
            completedLessons = _state.value.completedLessons + (courseId to next)
        )
        persist()
    }

    fun completedCount(courseId: String) = _state.value.completedLessons[courseId]?.size ?: 0

    /** Progress as 0f..1f so it can drive LinearProgressIndicator directly. */
    fun progress(courseId: String, totalLessons: Int): Float =
        if (totalLessons <= 0) 0f else completedCount(courseId).toFloat() / totalLessons

    // ---- Bookings ----

    fun isBooked(sessionId: String) = _state.value.bookings.contains(sessionId)

    fun book(sessionId: String) {
        if (isBooked(sessionId)) return
        _state.value = _state.value.copy(bookings = _state.value.bookings + sessionId)
        persist()
    }

    fun cancelBooking(sessionId: String) {
        _state.value = _state.value.copy(bookings = _state.value.bookings - sessionId)
        persist()
    }

    // ---- Persistence ----

    private fun load() {
        val p = prefs ?: return
        val enrollments = p.getStringSet(KEY_ENROLLMENTS, emptySet())?.toSet() ?: emptySet()
        val bookings = p.getStringSet(KEY_BOOKINGS, emptySet())?.toSet() ?: emptySet()
        val lessons = decodeLessons(p.getString(KEY_LESSONS, null))
        _state.value = _state.value.copy(
            enrollments = enrollments,
            bookings = bookings,
            completedLessons = lessons,
        )
    }

    private fun persist() {
        val p = prefs ?: return
        p.edit()
            .putStringSet(KEY_ENROLLMENTS, _state.value.enrollments)
            .putStringSet(KEY_BOOKINGS, _state.value.bookings)
            .putString(KEY_LESSONS, encodeLessons(_state.value.completedLessons))
            .apply()
        pushToCloud()
    }

    // SharedPreferences has no nested-map type, so the per-course lesson sets
    // are stored as a small JSON blob.
    private fun encodeLessons(map: Map<String, Set<String>>): String {
        val root = JSONObject()
        map.forEach { (courseId, lessons) -> root.put(courseId, lessons.joinToString(",")) }
        return root.toString()
    }

    private fun decodeLessons(raw: String?): Map<String, Set<String>> {
        if (raw.isNullOrBlank()) return emptyMap()
        return runCatching {
            val root = JSONObject(raw)
            buildMap {
                root.keys().forEach { key ->
                    val joined = root.optString(key, "")
                    put(key, if (joined.isBlank()) emptySet() else joined.split(",").toSet())
                }
            }
        }.getOrDefault(emptyMap())
    }

    // ---- Firestore sync ----

    /**
     * Pulls cloud state and unions it with what's on device, then writes the
     * result back — so signing in on a second device adds to your history
     * rather than clobbering either side.
     */
    fun syncOnSignIn() {
        val uid = LearnerSync.currentUid() ?: return
        _state.value = _state.value.copy(syncStatus = SyncStatus.SYNCING)
        viewModelScope.launch {
            runCatching {
                val remote = LearnerSync.fetch(uid)
                val mergedLessons = _state.value.completedLessons.toMutableMap()
                remote.completedLessons.forEach { (courseId, lessons) ->
                    mergedLessons[courseId] = (mergedLessons[courseId] ?: emptySet()) + lessons
                }
                _state.value = _state.value.copy(
                    enrollments = _state.value.enrollments + remote.enrollments,
                    bookings = _state.value.bookings + remote.bookings,
                    completedLessons = mergedLessons,
                )
                prefs?.edit()
                    ?.putStringSet(KEY_ENROLLMENTS, _state.value.enrollments)
                    ?.putStringSet(KEY_BOOKINGS, _state.value.bookings)
                    ?.putString(KEY_LESSONS, encodeLessons(_state.value.completedLessons))
                    ?.apply()
                LearnerSync.save(uid, snapshot())
            }.onSuccess {
                _state.value = _state.value.copy(syncStatus = SyncStatus.SYNCED)
            }.onFailure {
                // Rules not deployed, offline, or Firebase absent — the local
                // layer already holds everything, so degrade rather than fail.
                _state.value = _state.value.copy(syncStatus = SyncStatus.ERROR)
            }
        }
    }

    fun signedOut() {
        _state.value = _state.value.copy(syncStatus = SyncStatus.LOCAL)
    }

    private fun pushToCloud() {
        val uid = LearnerSync.currentUid() ?: return
        if (_state.value.syncStatus == SyncStatus.SYNCING) return
        viewModelScope.launch {
            runCatching { LearnerSync.save(uid, snapshot()) }
                .onSuccess { _state.value = _state.value.copy(syncStatus = SyncStatus.SYNCED) }
                .onFailure { _state.value = _state.value.copy(syncStatus = SyncStatus.ERROR) }
        }
    }

    private fun snapshot() = LearnerSync.State(
        enrollments = _state.value.enrollments.toList(),
        completedLessons = _state.value.completedLessons.mapValues { it.value.toList() },
        bookings = _state.value.bookings.toList(),
    )

    private companion object {
        const val KEY_ENROLLMENTS = "enrollments"
        const val KEY_BOOKINGS = "bookings"
        const val KEY_LESSONS = "completedLessons"
    }
}
