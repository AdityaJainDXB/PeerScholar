package org.peerscholar.app.auth

import android.content.Context
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialException
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import org.peerscholar.app.R

enum class ViewMode { LEARNER, TEACHER }

data class AuthUiState(
    val isSignedIn: Boolean = false,
    val displayName: String? = null,
    val photoUrl: String? = null,
    val errorMessage: String? = null,
    val viewMode: ViewMode = ViewMode.LEARNER,
)

class AuthViewModel : ViewModel() {
    private val _state = MutableStateFlow(AuthUiState())
    val state: StateFlow<AuthUiState> = _state

    fun setViewMode(mode: ViewMode) {
        _state.value = _state.value.copy(viewMode = mode)
    }

    fun isFirebaseConfigured(context: Context) = FirebaseApp.getApps(context).isNotEmpty()

    fun refresh() {
        val user = runCatching { FirebaseAuth.getInstance().currentUser }.getOrNull()
        _state.value = _state.value.copy(
            isSignedIn = user != null,
            displayName = user?.displayName,
            photoUrl = user?.photoUrl?.toString(),
        )
    }

    fun signInWithGoogle(context: Context) {
        if (!isFirebaseConfigured(context)) {
            _state.value = _state.value.copy(
                errorMessage = "Firebase isn't connected yet — add google-services.json. See apps/android/README.md."
            )
            return
        }
        viewModelScope.launch {
            try {
                val credentialManager = CredentialManager.create(context)
                val option = GetSignInWithGoogleOption.Builder(
                    serverClientId = context.getString(R.string.default_web_client_id)
                ).build()
                val request = GetCredentialRequest.Builder().addCredentialOption(option).build()
                val result = credentialManager.getCredential(context, request)

                val credential = result.credential
                if (credential is CustomCredential &&
                    credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
                ) {
                    val googleIdTokenCredential = GoogleIdTokenCredential.createFrom(credential.data)
                    val firebaseCredential = GoogleAuthProvider.getCredential(googleIdTokenCredential.idToken, null)
                    FirebaseAuth.getInstance().signInWithCredential(firebaseCredential).addOnCompleteListener {
                        refresh()
                    }
                }
            } catch (e: GetCredentialException) {
                _state.value = _state.value.copy(errorMessage = e.message ?: "Sign-in failed.")
            }
        }
    }

    fun signOut() {
        runCatching { FirebaseAuth.getInstance().signOut() }
        refresh()
    }
}
