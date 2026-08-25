package org.peerscholar.app.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.peerscholar.app.model.Course
import org.peerscholar.app.model.LiveSession
import org.peerscholar.app.ui.theme.Brand600

@Composable
fun Card(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    ElevatedCard(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(Modifier.padding(14.dp), content = content)
    }
}

@Composable
fun RatingStars(rating: Double, count: Int? = null) {
    if (rating == 0.0) {
        Text("No ratings yet", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        return
    }
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(Icons.Filled.Star, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(14.dp))
        Spacer(Modifier.width(4.dp))
        Text("%.1f".format(rating), fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.bodySmall)
        count?.let {
            Spacer(Modifier.width(4.dp))
            Text("($it)", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        }
    }
}

@Composable
fun SubjectTag(subject: String) {
    Text(subject.uppercase(), color = Brand600, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelSmall)
}

@Composable
fun CourseRow(course: Course, onClick: () -> Unit) {
    Card(Modifier.clickable(onClick = onClick)) {
        SubjectTag(course.subject)
        Text(course.title, style = MaterialTheme.typography.titleMedium)
        Text("by ${course.tutorName}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        Spacer(Modifier.height(6.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            RatingStars(course.ratingAvg, course.ratingCount)
            Text(course.priceDisplay, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun SessionCard(session: LiveSession, onBook: () -> Unit = {}) {
    Card {
        SubjectTag(session.subject)
        Text(session.title, style = MaterialTheme.typography.titleMedium)
        Text("with ${session.tutorName}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        Text(
            "${session.durationMinutes} min",
            style = MaterialTheme.typography.bodySmall, color = Color.Gray
        )
        Spacer(Modifier.height(6.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("${session.spotsLeft} of ${session.maxParticipants} spots left", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            Text(session.priceDisplay, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(8.dp))
        Button(onClick = onBook, modifier = Modifier.fillMaxWidth(), colors = ButtonDefaults.buttonColors(containerColor = Brand600)) {
            Text("Book session")
        }
    }
}
