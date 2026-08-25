package org.peerscholar.app.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.peerscholar.app.auth.AuthViewModel
import org.peerscholar.app.auth.ViewMode
import org.peerscholar.app.data.MockData
import org.peerscholar.app.ui.components.Avatar
import org.peerscholar.app.ui.components.Card
import org.peerscholar.app.ui.components.Thumbnail
import org.peerscholar.app.ui.theme.Brand600
import java.text.DateFormat

@Composable
fun DashboardScreen(authViewModel: AuthViewModel) {
    val state by authViewModel.state.collectAsState()

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        if (state.isSignedIn) {
            SegmentedToggle(
                selected = state.viewMode,
                onSelect = authViewModel::setViewMode,
            )
            Spacer(Modifier.height(16.dp))
        }

        AnimatedContent(
            targetState = state.isSignedIn && state.viewMode == ViewMode.TEACHER,
            transitionSpec = { fadeIn(tween(250)) togetherWith fadeOut(tween(150)) },
            label = "dashboardMode",
        ) { showTeacher ->
            Column {
                if (showTeacher) TeacherDashboard() else LearnerDashboard()
            }
        }
    }
}

@Composable
private fun SegmentedToggle(selected: ViewMode, onSelect: (ViewMode) -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surfaceVariant, shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp))
            .padding(4.dp)
    ) {
        listOf(ViewMode.LEARNER to "Learner", ViewMode.TEACHER to "Teacher").forEach { (mode, label) ->
            val isSelected = selected == mode
            Text(
                label,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                color = if (isSelected) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier
                    .weight(1f)
                    .background(
                        if (isSelected) MaterialTheme.colorScheme.surface else androidx.compose.ui.graphics.Color.Transparent,
                        shape = androidx.compose.foundation.shape.RoundedCornerShape(20.dp)
                    )
                    .clickable { onSelect(mode) }
                    .padding(vertical = 8.dp),
            )
        }
    }
}

@Composable
private fun LearnerDashboard() {
    Text("Live classes", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(8.dp))
    MockData.liveSessions.forEach { s ->
        Card(Modifier) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Row(Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                    Avatar(s.tutorId, size = 40)
                    Spacer(Modifier.width(10.dp))
                    Column {
                        Text(s.title, style = MaterialTheme.typography.titleMedium)
                        Text(
                            "with ${s.tutorName} · ${DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(s.scheduledAt)}",
                            style = MaterialTheme.typography.bodySmall,
                        )
                    }
                }
                if (s.joinUrl != null) {
                    Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = Brand600)) {
                        Text("Join")
                    }
                }
            }
        }
        Spacer(Modifier.height(8.dp))
    }

    Spacer(Modifier.height(16.dp))
    Text("Continue learning", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(8.dp))
    MockData.courses.take(3).forEachIndexed { index, course ->
        val progress = listOf(0.62f, 0.18f, 0.90f)[index % 3]
        Card(Modifier) {
            Column {
                Thumbnail(course.id, height = 90, badge = course.subject)
                Spacer(Modifier.height(10.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(course.title, style = MaterialTheme.typography.titleMedium)
                    Text("${(progress * 100).toInt()}%", style = MaterialTheme.typography.bodySmall)
                }
                Spacer(Modifier.height(6.dp))
                LinearProgressIndicator(progress = { progress }, color = Brand600, modifier = Modifier.fillMaxWidth())
            }
        }
        Spacer(Modifier.height(8.dp))
    }
}

@Composable
private fun TeacherDashboard() {
    val context = LocalContext.current
    val myCourses = MockData.courses.filter { it.tutorId == MockData.currentUserId }
    val mySessions = MockData.liveSessions.filter { it.tutorId == MockData.currentUserId }
    val earningsCents = myCourses.sumOf { (it.enrollmentCount * it.priceCents * 0.85).toInt() }
    val totalStudents = myCourses.sumOf { it.enrollmentCount }
    val newest = myCourses.maxByOrNull { it.createdAt }
    val topSelling = myCourses.sortedByDescending { it.enrollmentCount }
    val maxWeekly = MockData.earningsHistory.maxOf { it.cents }

    Text("Analytics", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(12.dp))

    if (newest != null) {
        Card(Modifier) {
            Text(
                "New: ${newest.title} — ${newest.enrollmentCount} students enrolled so far.",
                style = MaterialTheme.typography.bodyMedium,
            )
        }
        Spacer(Modifier.height(12.dp))
    }

    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        StatCard("Est. earnings", "$%.2f".format(earningsCents / 100.0), Modifier.weight(1f))
        StatCard("Total students", "$totalStudents", Modifier.weight(1f))
    }
    Spacer(Modifier.height(8.dp))
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        StatCard("Published courses", "${myCourses.count { it.status.name == "PUBLISHED" }}", Modifier.weight(1f))
        StatCard("Live sessions", "${mySessions.size}", Modifier.weight(1f))
    }

    Spacer(Modifier.height(16.dp))
    Text("Earnings, last 6 weeks", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(8.dp))
    var chartGrown by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { chartGrown = true }
    Card(Modifier) {
        Row(Modifier.fillMaxWidth().height(110.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.Bottom) {
            MockData.earningsHistory.forEach { week ->
                Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                    val heightRatio = week.cents.toFloat() / maxWeekly
                    val animatedHeight by animateFloatAsState(
                        targetValue = if (chartGrown) 80 * heightRatio else 0f,
                        animationSpec = tween(600),
                        label = "barHeight",
                    )
                    Box(
                        Modifier
                            .fillMaxWidth()
                            .height(animatedHeight.dp)
                            .background(Brand600, shape = androidx.compose.foundation.shape.RoundedCornerShape(4.dp))
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(week.label, style = MaterialTheme.typography.labelSmall)
                }
            }
        }
    }

    Spacer(Modifier.height(16.dp))
    Text("Top-selling courses", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(8.dp))
    topSelling.forEachIndexed { index, course ->
        Card(Modifier) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Avatar(course.id, size = 40)
                Spacer(Modifier.width(10.dp))
                Column {
                    Text("${index + 1}. ${course.title}", style = MaterialTheme.typography.titleMedium)
                    Text("${course.enrollmentCount} enrolled · ${course.priceDisplay}", style = MaterialTheme.typography.bodySmall)
                }
            }
        }
        Spacer(Modifier.height(8.dp))
    }

    Spacer(Modifier.height(16.dp))
    Text("Your live sessions", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
    Spacer(Modifier.height(8.dp))
    mySessions.forEach { s ->
        Card(Modifier) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Avatar(s.id, size = 36)
                    Spacer(Modifier.width(10.dp))
                    Column {
                        Text(s.title, style = MaterialTheme.typography.titleMedium)
                        Text("${s.bookedCount}/${s.maxParticipants} booked", style = MaterialTheme.typography.bodySmall)
                    }
                }
                if (s.joinUrl != null) {
                    TextButton(onClick = {
                        val clipboard = context.getSystemService(ClipboardManager::class.java)
                        clipboard.setPrimaryClip(ClipData.newPlainText("Join link", s.joinUrl))
                    }) {
                        Text("Copy link")
                    }
                }
            }
        }
        Spacer(Modifier.height(8.dp))
    }
}

@Composable
private fun StatCard(label: String, value: String, modifier: Modifier = Modifier) {
    Card(modifier) {
        Text(label, style = MaterialTheme.typography.labelMedium)
        Text(value, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
    }
}
