package org.peerscholar.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.peerscholar.app.data.MockData
import org.peerscholar.app.ui.components.Card
import org.peerscholar.app.ui.components.CourseRow
import org.peerscholar.app.ui.components.RatingStars

@Composable
fun HomeScreen(onCourseClick: (String) -> Unit, onTutorClick: (String) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item {
            Text("Learn from students who just got the A.", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
            Spacer(Modifier.height(6.dp))
            Text(
                "Live tutoring and on-demand courses, taught by peers, checked for quality by peers.",
                style = MaterialTheme.typography.bodyMedium,
            )
            Spacer(Modifier.height(16.dp))
            Text("Popular courses", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
        }
        items(MockData.courses) { course ->
            CourseRow(course, onClick = { onCourseClick(course.id) })
        }
        item {
            Spacer(Modifier.height(16.dp))
            Text("Top-rated tutors", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
        }
        items(MockData.tutors) { tutor ->
            Card(Modifier) {
                Text(tutor.fullName, style = MaterialTheme.typography.titleMedium)
                RatingStars(tutor.ratingAvg, tutor.ratingCount)
                Text(tutor.bio, style = MaterialTheme.typography.bodySmall, maxLines = 2)
            }
        }
    }
}
