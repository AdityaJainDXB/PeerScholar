package org.peerscholar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.peerscholar.app.data.MockData
import org.peerscholar.app.ui.components.CourseRow
import org.peerscholar.app.ui.components.TutorRow
import org.peerscholar.app.ui.components.appearAnimation
import org.peerscholar.app.ui.theme.Brand600
import org.peerscholar.app.ui.theme.BrandNavy

@Composable
fun HomeScreen(onCourseClick: (String) -> Unit, onTutorClick: (String) -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(150.dp)
                    .background(Brush.linearGradient(listOf(BrandNavy, Brand600)), RoundedCornerShape(20.dp))
                    .padding(18.dp),
            ) {
                Column {
                    Text(
                        "Learn from students who\njust got the A.",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                    )
                    Spacer(Modifier.height(6.dp))
                    Text(
                        "Live tutoring & on-demand courses, taught by peers.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.White.copy(alpha = 0.85f),
                    )
                }
            }
            Spacer(Modifier.height(16.dp))
            Text("Popular courses", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
        }
        itemsIndexed(MockData.courses) { index, course ->
            Box(Modifier.appearAnimation(index)) {
                CourseRow(course, onClick = { onCourseClick(course.id) })
            }
            Spacer(Modifier.height(10.dp))
        }
        item {
            Spacer(Modifier.height(8.dp))
            Text("Top-rated tutors", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
        }
        itemsIndexed(MockData.tutors) { index, tutor ->
            Box(Modifier.appearAnimation(index)) {
                TutorRow(tutor, onClick = { onTutorClick(tutor.id) })
            }
            Spacer(Modifier.height(10.dp))
        }
    }
}
