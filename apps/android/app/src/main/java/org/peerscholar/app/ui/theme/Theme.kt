package org.peerscholar.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Brand600 = Color(0xFF1E63EF)
val Brand700 = Color(0xFF1A4FDC)
val Slate900 = Color(0xFF0F172A)

private val LightColors = lightColorScheme(
    primary = Brand600,
    onPrimary = Color.White,
    secondary = Brand700,
    background = Color(0xFFF8FAFC),
    surface = Color.White,
    onBackground = Slate900,
    onSurface = Slate900,
)

@Composable
fun PeerScholarTheme(content: @Composable () -> Unit) {
    val colors = if (isSystemInDarkTheme()) darkColorScheme(primary = Brand600) else LightColors
    MaterialTheme(colorScheme = colors, content = content)
}
