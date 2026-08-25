# PeerScholar — Android (native Kotlin + Jetpack Compose)

A native Android app (not React Native/Expo) sharing the same Firebase
backend as the website and iOS app.

## Open the project

Open **Android Studio → Open → select `apps/android`**. Android Studio
will download the Gradle wrapper and dependencies on first sync — this
repo doesn't check in `gradle-wrapper.jar` or built binaries.

The app builds and runs on mock data with sign-in disabled out of the
box. To enable real accounts:

## Connect Firebase + Google Sign-In

1. In the [Firebase Console](https://console.firebase.google.com), open
   your project (or create one) → **Add app → Android**.
   - Package name: `org.peerscholar.app` (matches `app/build.gradle.kts`).
2. Download the generated **`google-services.json`** and place it at
   `apps/android/app/google-services.json`. It's git-ignored, so it won't
   be committed.
3. In Firebase Console → **Authentication → Sign-in method**, enable
   **Google**. Note the **Web client ID** shown under Google's
   configuration (also visible in `google-services.json` as the entry
   with `"client_type": 3`).
4. Open `app/src/main/res/values/strings.xml` and replace
   `default_web_client_id`'s placeholder with that Web client ID.
5. Rebuild and run. The Profile tab's "Sign in with Google" button will
   now work for real, using Android's Credential Manager API.

## Structure

```
app/src/main/java/org/peerscholar/app/
├── MainActivity.kt     Nav host + bottom navigation
├── model/               Data types (mirrors packages/shared)
├── data/                 Sample tutors/courses/sessions
├── auth/                  AuthViewModel (Credential Manager + Firebase Auth)
└── ui/
    ├── screens/           One file per screen
    ├── components/        Reusable Composables
    └── theme/              Colors, typography
```

## Note on this environment

This project was written without a local Android SDK/Gradle/Android
Studio installation available to verify the build — the code follows
current, documented APIs (Jetpack Compose, Credential Manager for Sign in
with Google, Firebase BoM) but hasn't been compiled here. The first thing
to do is open it in Android Studio and let Gradle sync; fix anything Studio
flags before relying on it.
