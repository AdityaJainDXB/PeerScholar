package org.peerscholar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.peerscholar.app.data.AppStore
import org.peerscholar.app.data.MockData
import org.peerscholar.app.data.formatDuration
import org.peerscholar.app.data.lessonsForCourse
import org.peerscholar.app.model.centsToDisplay
import org.peerscholar.app.ui.components.Thumbnail
import org.peerscholar.app.ui.theme.Brand600

/**
 * The lesson player — the screen behind "Start course" / "Continue learning".
 * Mirrors the web player (apps/web/components/CoursePlayer.tsx) and
 * CoursePlayerView.swift.
 */
@Composable
fun CoursePlayerScreen(courseId: String, store: AppStore) {
    val course = MockData.courses.firstOrNull { it.id == courseId } ?: return
    val state by store.state.collectAsState()
    val lessons = remember(course.id) { lessonsForCourse(course) }
    var currentIndex by remember(course.id) { mutableStateOf(0) }

    val lesson = lessons[currentIndex.coerceIn(0, lessons.size - 1)]
    val enrolled = state.enrollments.contains(course.id)
    val unlocked = enrolled || lesson.isPreview
    val done = state.completedLessons[course.id]?.contains(lesson.id) == true
    val completed = state.completedLessons[course.id]?.size ?: 0
    val progress = if (lessons.isEmpty()) 0f else completed.toFloat() / lessons.size
    val allDone = completed == lessons.size && lessons.isNotEmpty()

    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            Text(course.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                LinearProgressIndicator(
                    progress = { progress },
                    color = Brand600,
                    modifier = Modifier.weight(1f),
                )
                Spacer(Modifier.width(10.dp))
                Text("${(progress * 100).toInt()}%", style = MaterialTheme.typography.labelMedium)
            }
        }

        if (allDone) {
            item {
                Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFDCFCE7))) {
                    Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text("🎓", style = MaterialTheme.typography.headlineMedium)
                        Spacer(Modifier.width(12.dp))
                        Column {
                            Text("You finished the course!", fontWeight = FontWeight.Bold)
                            Text(
                                "Your certificate is ready in My Learning.",
                                style = MaterialTheme.typography.bodySmall,
                            )
                        }
                    }
                }
            }
        }

        item {
            Box(Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                Thumbnail(lesson.id, height = 200)
                if (unlocked) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Filled.PlayCircle,
                            contentDescription = "Play lesson",
                            tint = Color.White,
                            modifier = Modifier.size(56.dp),
                        )
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "Video playback arrives with Firebase Storage.",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White,
                        )
                    }
                } else {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(16.dp),
                    ) {
                        Icon(Icons.Filled.Lock, contentDescription = null, tint = Color.White)
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "This lesson is for enrolled students",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                        )
                        Spacer(Modifier.height(10.dp))
                        Button(
                            onClick = { store.enroll(course.id) },
                            colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color.Black),
                        ) {
                            Text(
                                if (course.priceCents == 0) "Enroll for free"
                                else "Enroll for ${centsToDisplay(course.priceCents)}"
                            )
                        }
                    }
                }
            }
        }

        item {
            Text(
                "LESSON ${currentIndex + 1} OF ${lessons.size}",
                style = MaterialTheme.typography.labelSmall,
                color = Brand600,
                fontWeight = FontWeight.Bold,
            )
            Text(lesson.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Text(
                "${lesson.durationMinutes} minutes · taught by ${course.tutorName}",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray,
            )
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(
                    onClick = { if (currentIndex > 0) currentIndex-- },
                    enabled = currentIndex > 0,
                ) { Text("Previous") }

                if (unlocked) {
                    Button(
                        onClick = {
                            val wasDone = done
                            store.toggleLesson(course.id, lesson.id)
                            if (!wasDone && currentIndex < lessons.size - 1) currentIndex++
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (done) Color(0xFF16A34A) else Brand600
                        ),
                    ) { Text(if (done) "✓ Completed" else "Mark complete") }
                }

                OutlinedButton(
                    onClick = { if (currentIndex < lessons.size - 1) currentIndex++ },
                    enabled = currentIndex < lessons.size - 1,
                ) { Text("Next") }
            }
        }

        item {
            Spacer(Modifier.height(4.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Course content", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(
                    "$completed of ${lessons.size} · ${formatDuration(course.totalDurationMinutes)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray,
                )
            }
        }

        itemsIndexed(lessons) { index, l ->
            val lDone = state.completedLessons[course.id]?.contains(l.id) == true
            val lUnlocked = enrolled || l.isPreview
            Row(
                Modifier
                    .fillMaxWidth()
                    .clickable { currentIndex = index }
                    .background(
                        if (index == currentIndex) Brand600.copy(alpha = 0.07f) else Color.Transparent,
                        RoundedCornerShape(10.dp),
                    )
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    Modifier
                        .size(26.dp)
                        .background(
                            when {
                                lDone -> Color(0xFF16A34A).copy(alpha = 0.15f)
                                lUnlocked -> Brand600.copy(alpha = 0.15f)
                                else -> Color.Gray.copy(alpha = 0.15f)
                            },
                            CircleShape,
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    when {
                        lDone -> Icon(
                            Icons.Filled.Check,
                            contentDescription = null,
                            tint = Color(0xFF16A34A),
                            modifier = Modifier.size(14.dp),
                        )
                        lUnlocked -> Text(
                            "${index + 1}",
                            style = MaterialTheme.typography.labelSmall,
                            color = Brand600,
                            fontWeight = FontWeight.Bold,
                        )
                        else -> Icon(
                            Icons.Filled.Lock,
                            contentDescription = null,
                            tint = Color.Gray,
                            modifier = Modifier.size(12.dp),
                        )
                    }
                }
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text(
                        l.title,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = if (index == currentIndex) FontWeight.SemiBold else FontWeight.Normal,
                        color = if (index == currentIndex) Brand600 else MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                    )
                    Text("${l.durationMinutes}m", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
                }
            }
            Divider(Modifier.padding(start = 50.dp))
        }
    }
}
