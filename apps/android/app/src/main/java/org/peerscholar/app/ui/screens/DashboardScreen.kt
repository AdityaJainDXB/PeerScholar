package org.peerscholar.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.peerscholar.app.data.MockData
import org.peerscholar.app.ui.components.Card
import org.peerscholar.app.ui.theme.Brand600
import java.text.DateFormat

@Composable
fun DashboardScreen() {
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Upcoming sessions", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        MockData.liveSessions.take(2).forEach { s ->
            Card(Modifier) {
                Text(s.title, style = MaterialTheme.typography.titleMedium)
                Text(
                    "with ${s.tutorName} · ${DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(s.scheduledAt)}",
                    style = MaterialTheme.typography.bodySmall,
                )
            }
            Spacer(Modifier.height(8.dp))
        }

        Spacer(Modifier.height(16.dp))
        Text("Enrolled courses", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        MockData.courses.take(2).forEachIndexed { index, course ->
            val progress = if (index == 0) 0.62f else 0.18f
            Card(Modifier) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(course.title, style = MaterialTheme.typography.titleMedium)
                    Text("${(progress * 100).toInt()}%", style = MaterialTheme.typography.bodySmall)
                }
                Spacer(Modifier.height(6.dp))
                LinearProgressIndicator(progress = { progress }, color = Brand600, modifier = Modifier.fillMaxWidth())
            }
            Spacer(Modifier.height(8.dp))
        }
    }
}
