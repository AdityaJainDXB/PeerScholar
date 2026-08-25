# PeerScholar — iOS (native SwiftUI)

A native SwiftUI app (not React Native/Expo) sharing the same Firebase
backend as the website and Android app. Requires Xcode 15+.

## Open the project

```bash
open PeerScholar.xcodeproj
```

The project already builds and runs on mock data with sign-in disabled.
To enable real accounts:

## Connect Firebase + Google Sign-In

1. In the [Firebase Console](https://console.firebase.google.com), open
   your project (or create one) → **Add app → iOS**.
   - Bundle ID: `org.peerscholar.app` (matches `project.yml`).
2. Download the generated **`GoogleService-Info.plist`** and drag it into
   `PeerScholar/Resources/` in Xcode (check "Copy items if needed").
   It's git-ignored, so it won't be committed.
3. In Firebase Console → **Authentication → Sign-in method**, enable
   **Google**.
4. Open the downloaded `GoogleService-Info.plist` and copy the
   `REVERSED_CLIENT_ID` value.
5. Open `project.yml` and replace `com.googleusercontent.apps.REPLACE_ME`
   under `CFBundleURLTypes` with that value, then regenerate the project:
   ```bash
   xcodegen generate   # or re-run project.yml through XcodeGen
   ```
   (If you don't have `xcodegen` installed: `brew install xcodegen`.)
6. Build and run. The Profile tab's "Sign in with Google" button will now
   work for real.

## Regenerating the project

This project is defined by [`project.yml`](project.yml) (XcodeGen), not
hand-edited `.xcodeproj` files — that's the source of truth. If you add
new Swift files or change settings, edit `project.yml` and re-run
`xcodegen generate` rather than editing Xcode's project settings UI where
possible, so the config stays reproducible.

## Structure

```
PeerScholar/
├── App/            App entry point, AppDelegate (Firebase/Google Sign-In setup)
├── Models/         Data types (mirrors packages/shared)
├── MockData/        Sample tutors/courses/sessions
├── ViewModels/       AuthManager (Firebase Auth + Google Sign-In)
├── Views/
│   ├── Screens/      One file per screen
│   └── Components/   Reusable SwiftUI views
└── Resources/        Assets.xcassets, Info.plist, GoogleService-Info.plist (you add this)
```
