package org.peerscholar.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayCircle
import org.peerscholar.app.data.MockData
import org.peerscholar.app.ui.components.RatingStars
import org.peerscholar.app.ui.components.SubjectTag
import org.peerscholar.app.ui.components.Thumbnail
import org.peerscholar.app.ui.theme.Brand600

@Composable
fun CourseDetailScreen(courseId: String) {
    val course = MockData.courses.first { it.id == courseId }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        SubjectTag(course.subject)
        Text(course.title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        RatingStars(course.ratingAvg, course.ratingCount)
        Text("by ${course.tutorName}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        Spacer(Modifier.height(8.dp))
        Text(course.description, style = MaterialTheme.typography.bodyMedium)

        Spacer(Modifier.height(16.dp))
        Box(Modifier.fillMaxWidth().height(180.dp), contentAlignment = Alignment.Center) {
            Thumbnail(course.id, height = 180)
            Icon(
                Icons.Filled.PlayCircle,
                contentDescription = "Play preview",
                tint = Color.White,
                modifier = Modifier.size(56.dp),
            )
        }

        Spacer(Modifier.height(20.dp))
        Text("Curriculum — ${course.lessonCount} lessons", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        (1..minOf(course.lessonCount, 6)).forEach { i ->
            Row(Modifier.fillMaxWidth().padding(vertical = 6.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Lesson $i: ${course.subject} fundamentals, part $i", style = MaterialTheme.typography.bodyMedium)
                if (i == 1) Text("PREVIEW", color = Brand600, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelSmall)
            }
            Divider()
        }

        Spacer(Modifier.height(20.dp))
        ElevatedCard(shape = RoundedCornerShape(14.dp)) {
            Column(Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text(course.priceDisplay, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
                Spacer(Modifier.height(10.dp))
                Button(onClick = {}, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = Brand600)) {
                    Text("Enroll now")
                }
                Spacer(Modifier.height(8.dp))
                Text("${course.enrollmentCount} students enrolled · Lifetime access", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            }
        }
    }
}
