package org.peerscholar.app.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.graphicsLayer
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import org.peerscholar.app.data.AppStore
import org.peerscholar.app.model.Course
import org.peerscholar.app.model.LiveSession
import org.peerscholar.app.model.Profile
import org.peerscholar.app.ui.theme.Brand600

// Deterministic stand-in photography — same source (picsum.photos /
// i.pravatar.cc) used by the website and iOS app, so every front end demos
// with the same imagery.
private fun photoUrl(seed: String, w: Int = 480, h: Int = 320) = "https://picsum.photos/seed/$seed/$w/$h"
private fun avatarUrl(seed: String, size: Int = 128) = "https://i.pravatar.cc/$size?u=$seed"

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
fun Thumbnail(seed: String, modifier: Modifier = Modifier, height: Int = 110, badge: String? = null) {
    Box(modifier.fillMaxWidth().height(height.dp).clip(RoundedCornerShape(14.dp))) {
        AsyncImage(
            model = photoUrl(seed),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize(),
        )
        Box(
            Modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(listOf(Color.Transparent, Color.Black.copy(alpha = 0.6f))))
        )
        if (badge != null) {
            Text(
                badge.uppercase(),
                color = Color.White,
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.labelSmall,
                modifier = Modifier.align(Alignment.BottomStart).padding(10.dp),
            )
        }
    }
}

@Composable
fun Avatar(seed: String, size: Int = 48, modifier: Modifier = Modifier) {
    AsyncImage(
        model = avatarUrl(seed, size * 2),
        contentDescription = null,
        contentScale = ContentScale.Crop,
        modifier = modifier.size(size.dp).clip(CircleShape),
    )
}

/** Fades and slides a row in on first composition, staggered by [index]. */
@Composable
fun Modifier.appearAnimation(index: Int = 0): Modifier {
    var shown by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(index * 60L)
        shown = true
    }
    val alpha by animateFloatAsState(if (shown) 1f else 0f, animationSpec = tween(400), label = "appearAlpha")
    val offsetY by animateFloatAsState(if (shown) 0f else 24f, animationSpec = tween(400), label = "appearOffset")
    return this
        .graphicsLayer(alpha = alpha, translationY = offsetY)
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
    ElevatedCard(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column {
            Thumbnail(course.id, badge = course.subject)
            Column(Modifier.padding(14.dp)) {
                Text(course.title, style = MaterialTheme.typography.titleMedium)
                Text("by ${course.tutorName}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                Spacer(Modifier.height(6.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    RatingStars(course.ratingAvg, course.ratingCount)
                    Text(course.priceDisplay, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun TutorRow(tutor: Profile, onClick: () -> Unit) {
    Card(Modifier.clickable(onClick = onClick)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Avatar(tutor.id, size = 48)
            Spacer(Modifier.width(12.dp))
            Column {
                Text(tutor.fullName, style = MaterialTheme.typography.titleMedium)
                RatingStars(tutor.ratingAvg, tutor.ratingCount)
                Text(tutor.bio, style = MaterialTheme.typography.bodySmall, maxLines = 2, color = Color.Gray)
            }
        }
    }
}

@Composable
fun SessionCard(session: LiveSession, store: AppStore) {
    // Note: collected unconditionally — calling collectAsState() through a
    // null-safe chain would make a composable invocation conditional, which
    // breaks Compose's positional memoization.
    val state by store.state.collectAsState()
    val booked = state.bookings.contains(session.id)
    val spotsLeft = (session.spotsLeft - if (booked) 1 else 0).coerceAtLeast(0)
    val isFull = spotsLeft <= 0 && !booked
    val isFree = session.priceCents == 0
    val context = LocalContext.current
    var showConfirm by remember { mutableStateOf(false) }

    ElevatedCard(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.elevatedCardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column {
            Box {
                Thumbnail(session.id, height = 90, badge = "● Live")
                if (booked) {
                    Text(
                        "BOOKED",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .padding(8.dp)
                            .background(Color(0xFF16A34A), RoundedCornerShape(20.dp))
                            .padding(horizontal = 8.dp, vertical = 3.dp),
                    )
                }
            }
            Column(Modifier.padding(14.dp)) {
                SubjectTag(session.subject)
                Text(session.title, style = MaterialTheme.typography.titleMedium)
                Text("with ${session.tutorName}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                Text(
                    "${session.durationMinutes} min",
                    style = MaterialTheme.typography.bodySmall, color = Color.Gray
                )
                Spacer(Modifier.height(6.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(
                        if (isFull) "Fully booked" else "$spotsLeft of ${session.maxParticipants} spots left",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (isFull) Color(0xFFE11D48) else Color.Gray,
                    )
                    Text(if (isFree) "Free" else session.priceDisplay, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(8.dp))

                if (booked) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        session.joinUrl?.let { url ->
                            Button(
                                onClick = {
                                    context.startActivity(
                                        Intent(Intent.ACTION_VIEW, Uri.parse(url))
                                    )
                                },
                                modifier = Modifier.weight(1f),
                                colors = ButtonDefaults.buttonColors(containerColor = Brand600),
                            ) { Text("Join") }
                        }
                        OutlinedButton(onClick = { store.cancelBooking(session.id) }) { Text("Cancel") }
                    }
                } else {
                    Button(
                        onClick = { showConfirm = true },
                        enabled = !isFull,
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Brand600),
                    ) {
                        Text(if (isFull) "Fully booked" else "Book session")
                    }
                }
            }
        }
    }

    if (showConfirm) {
        AlertDialog(
            onDismissRequest = { showConfirm = false },
            title = { Text("Confirm your booking") },
            text = {
                Column {
                    Text(session.title, fontWeight = FontWeight.SemiBold)
                    Text(
                        "with ${session.tutorName} · ${session.durationMinutes} minutes",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray,
                    )
                    Spacer(Modifier.height(12.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Total", fontWeight = FontWeight.Bold)
                        Text(if (isFree) "$0.00" else session.priceDisplay, fontWeight = FontWeight.Bold)
                    }
                    if (!isFree) {
                        Spacer(Modifier.height(10.dp))
                        Text(
                            "This prototype doesn't process real payments.",
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.Gray,
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        store.book(session.id)
                        showConfirm = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Brand600),
                ) { Text("Confirm booking") }
            },
            dismissButton = { TextButton(onClick = { showConfirm = false }) { Text("Cancel") } },
        )
    }
}
