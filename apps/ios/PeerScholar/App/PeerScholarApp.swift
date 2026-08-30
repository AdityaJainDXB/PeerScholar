import SwiftUI
import FirebaseCore
import GoogleSignIn

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        // No-op if GoogleService-Info.plist hasn't been added yet — the
        // app still runs on mock data. See apps/ios/README.md.
        if Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") != nil {
            FirebaseApp.configure()
        }
        return true
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        GIDSignIn.sharedInstance.handle(url)
    }
}

@main
struct PeerScholarApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var authManager = AuthManager()
    @StateObject private var store = AppStore()

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environmentObject(authManager)
                .environmentObject(store)
                .onOpenURL { url in
                    GIDSignIn.sharedInstance.handle(url)
                }
                // Pull cloud progress on sign-in; drop back to device-only
                // storage on sign-out.
                .task(id: authManager.isSignedIn) {
                    if authManager.isSignedIn, let uid = LearnerSync.currentUid {
                        await store.syncOnSignIn(uid: uid)
                    } else {
                        store.signedOut()
                    }
                }
        }
    }
}
