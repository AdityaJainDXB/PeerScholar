package org.peerscholar.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayCircle
import kotlinx.coroutines.delay
import org.peerscholar.app.data.AppStore
import org.peerscholar.app.data.MockData
import org.peerscholar.app.data.formatDuration
import org.peerscholar.app.data.lessonsForCourse
import org.peerscholar.app.model.centsToDisplay
import org.peerscholar.app.ui.components.RatingStars
import org.peerscholar.app.ui.components.SubjectTag
import org.peerscholar.app.ui.components.Thumbnail
import org.peerscholar.app.ui.theme.Brand600

@Composable
fun CourseDetailScreen(courseId: String, store: AppStore, onOpenPlayer: (String) -> Unit) {
    val course = MockData.courses.firstOrNull { it.id == courseId } ?: return
    val state by store.state.collectAsState()
    val lessons = remember(course.id) { lessonsForCourse(course) }

    val enrolled = state.enrollments.contains(course.id)
    val completed = state.completedLessons[course.id]?.size ?: 0
    val progress = if (lessons.isEmpty()) 0f else completed.toFloat() / lessons.size
    val isFree = course.priceCents == 0

    var showCheckout by remember { mutableStateOf(false) }
    var enrolling by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        SubjectTag(course.subject)
        Text(course.title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Row(verticalAlignment = Alignment.CenterVertically) {
            RatingStars(course.ratingAvg, course.ratingCount)
            if (enrolled) {
                Spacer(Modifier.width(8.dp))
                Text(
                    "ENROLLED",
                    style = MaterialTheme.typography.labelSmall,
                    color = Brand600,
                    fontWeight = FontWeight.Bold,
                )
            }
        }
        Text("by ${course.tutorName}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        Spacer(Modifier.height(8.dp))
        Text(course.description, style = MaterialTheme.typography.bodyMedium)

        Spacer(Modifier.height(16.dp))
        Box(
            Modifier
                .fillMaxWidth()
                .height(180.dp)
                .clickable(enabled = enrolled) { onOpenPlayer(course.id) },
            contentAlignment = Alignment.Center,
        ) {
            Thumbnail(course.id, height = 180)
            Icon(
                Icons.Filled.PlayCircle,
                contentDescription = "Play preview",
                tint = Color.White,
                modifier = Modifier.size(56.dp),
            )
        }

        Spacer(Modifier.height(20.dp))
        Text(
            "Curriculum — ${course.lessonCount} lessons · ${formatDuration(course.totalDurationMinutes)}",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
        )
        Spacer(Modifier.height(8.dp))
        lessons.take(6).forEach { l ->
            val lUnlocked = enrolled || l.isPreview
            val lDone = state.completedLessons[course.id]?.contains(l.id) == true
            Row(
                Modifier
                    .fillMaxWidth()
                    .clickable(enabled = lUnlocked) { onOpenPlayer(course.id) }
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(
                    when {
                        lDone -> Icons.Filled.CheckCircle
                        lUnlocked -> Icons.Filled.PlayCircle
                        else -> Icons.Filled.Lock
                    },
                    contentDescription = null,
                    tint = when {
                        lDone -> Color(0xFF16A34A)
                        lUnlocked -> Brand600
                        else -> Color.Gray
                    },
                    modifier = Modifier.size(16.dp),
                )
                Spacer(Modifier.width(10.dp))
                Text(
                    l.title,
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (lUnlocked) MaterialTheme.colorScheme.onSurface else Color.Gray,
                    maxLines = 1,
                    modifier = Modifier.weight(1f),
                )
                if (l.isPreview && !enrolled) {
                    Text(
                        "FREE",
                        color = Brand600,
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.labelSmall,
                    )
                    Spacer(Modifier.width(6.dp))
                }
                Text("${l.durationMinutes}m", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
            }
            Divider()
        }
        if (lessons.size > 6) {
            Spacer(Modifier.height(6.dp))
            Text(
                "+ ${lessons.size - 6} more lessons",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray,
            )
        }

        Spacer(Modifier.height(20.dp))
        ElevatedCard(shape = RoundedCornerShape(14.dp)) {
            Column(Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                if (enrolled) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Filled.CheckCircle,
                            contentDescription = null,
                            tint = Color(0xFF16A34A),
                            modifier = Modifier.size(18.dp),
                        )
                        Spacer(Modifier.width(6.dp))
                        Text("You're enrolled", fontWeight = FontWeight.SemiBold)
                    }
                    Spacer(Modifier.height(10.dp))
                    LinearProgressIndicator(
                        progress = { progress },
                        color = Brand600,
                        modifier = Modifier.fillMaxWidth(),
                    )
                    Spacer(Modifier.height(6.dp))
                    Text(
                        "${(progress * 100).toInt()}% complete",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray,
                    )
                    Spacer(Modifier.height(10.dp))
                    Button(
                        onClick = { onOpenPlayer(course.id) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Brand600),
                    ) {
                        Text(if (progress > 0f) "Continue learning" else "Start course")
                    }
                } else {
                    Text(
                        if (isFree) "Free" else course.priceDisplay,
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Black,
                    )
                    Spacer(Modifier.height(10.dp))
                    Button(
                        onClick = { showCheckout = true },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Brand600),
                    ) {
                        Text(if (isFree) "Enroll for free" else "Enroll now")
                    }
                    Spacer(Modifier.height(6.dp))
                    Text(
                        "Lesson 1 is free to preview",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray,
                    )
                }
                Spacer(Modifier.height(8.dp))
                Text(
                    "${course.enrollmentCount} students enrolled · Lifetime access",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray,
                )
            }
        }
    }

    if (showCheckout) {
        // Brief settle so confirming reads as a real action; replaced by the
        // Stripe round-trip once payments land.
        LaunchedEffect(enrolling) {
            if (enrolling) {
                delay(600)
                store.enroll(course.id)
                enrolling = false
                showCheckout = false
            }
        }

        AlertDialog(
            onDismissRequest = { if (!enrolling) showCheckout = false },
            title = { Text(if (isFree) "Enroll in this course" else "Confirm enrollment") },
            text = {
                Column {
                    Text(course.title, fontWeight = FontWeight.SemiBold)
                    Text(
                        "by ${course.tutorName}",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray,
                    )
                    Spacer(Modifier.height(12.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Total", fontWeight = FontWeight.Bold)
                        Text(
                            if (isFree) "$0.00" else centsToDisplay(course.priceCents),
                            fontWeight = FontWeight.Bold,
                        )
                    }
                    if (!isFree) {
                        Spacer(Modifier.height(10.dp))
                        Text(
                            "This prototype doesn't process real payments — enrolling is free while Stripe Connect is still being wired up.",
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.Gray,
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = { enrolling = true },
                    enabled = !enrolling,
                    colors = ButtonDefaults.buttonColors(containerColor = Brand600),
                ) {
                    Text(if (enrolling) "Enrolling…" else "Confirm & enroll")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCheckout = false }, enabled = !enrolling) { Text("Cancel") }
            },
        )
    }
}
