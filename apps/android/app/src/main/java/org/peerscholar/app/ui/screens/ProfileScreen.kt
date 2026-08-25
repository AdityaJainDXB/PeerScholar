package org.peerscholar.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import org.peerscholar.app.auth.AuthViewModel
import org.peerscholar.app.ui.theme.Brand600

@Composable
fun ProfileScreen(authViewModel: AuthViewModel) {
    val context = LocalContext.current
    val state by authViewModel.state.collectAsState()

    Column(
        Modifier.fillMaxSize().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Box(
            Modifier.size(72.dp).background(Color.LightGray, CircleShape),
            contentAlignment = Alignment.Center,
        ) { Text(if (state.isSignedIn) "" else "You") }

        Spacer(Modifier.height(12.dp))

        if (state.isSignedIn) {
            Text(state.displayName ?: "PeerScholar user", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Text("Signed in with Google", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            Spacer(Modifier.height(12.dp))
            OutlinedButton(onClick = { authViewModel.signOut() }) { Text("Sign out") }
        } else {
            Text("Your account", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

            if (!authViewModel.isFirebaseConfigured(context)) {
                Spacer(Modifier.height(8.dp))
                Text(
                    "Firebase isn't connected yet — add google-services.json to enable real sign-in. See apps/android/README.md.",
                    style = MaterialTheme.typography.bodySmall, color = Color.Gray, textAlign = TextAlign.Center,
                )
            }

            state.errorMessage?.let {
                Spacer(Modifier.height(8.dp))
                Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall, textAlign = TextAlign.Center)
            }

            Spacer(Modifier.height(16.dp))
            Button(
                onClick = { authViewModel.signInWithGoogle(context) },
                colors = ButtonDefaults.buttonColors(containerColor = Brand600),
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Sign in with Google") }
        }
    }
}
