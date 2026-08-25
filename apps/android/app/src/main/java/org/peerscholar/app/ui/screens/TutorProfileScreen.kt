package org.peerscholar.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.peerscholar.app.data.MockData
import org.peerscholar.app.ui.components.Avatar
import org.peerscholar.app.ui.components.CourseRow
import org.peerscholar.app.ui.components.RatingStars
import org.peerscholar.app.ui.components.SessionCard

@Composable
fun TutorProfileScreen(tutorId: String, onCourseClick: (String) -> Unit) {
    val tutor = MockData.tutors.first { it.id == tutorId }
    val sessions = MockData.liveSessions.filter { it.tutorId == tutorId }
    val courses = MockData.courses.filter { it.tutorId == tutorId }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Avatar(tutor.id, size = 64)
            Spacer(Modifier.width(14.dp))
            Column {
                Text(tutor.fullName, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                RatingStars(tutor.ratingAvg, tutor.ratingCount)
            }
        }
        Spacer(Modifier.height(10.dp))
        Text(tutor.bio, style = MaterialTheme.typography.bodyMedium)

        if (sessions.isNotEmpty()) {
            Spacer(Modifier.height(20.dp))
            Text("Book a live session", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            sessions.forEach { s -> SessionCard(s); Spacer(Modifier.height(8.dp)) }
        }

        if (courses.isNotEmpty()) {
            Spacer(Modifier.height(12.dp))
            Text("Courses", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            courses.forEach { c -> CourseRow(c, onClick = { onCourseClick(c.id) }); Spacer(Modifier.height(8.dp)) }
        }
    }
}
