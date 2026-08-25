import Foundation
import FirebaseCore
import FirebaseAuth
import GoogleSignIn

enum ViewMode: String {
    case learner, teacher
}

@MainActor
final class AuthManager: ObservableObject {
    @Published var displayName: String?
    @Published var photoURL: URL?
    @Published var isSignedIn = false
    @Published var errorMessage: String?
    @Published var viewMode: ViewMode = ViewMode(rawValue: UserDefaults.standard.string(forKey: "viewMode") ?? "") ?? .learner {
        didSet { UserDefaults.standard.set(viewMode.rawValue, forKey: "viewMode") }
    }

    var isFirebaseConfigured: Bool {
        FirebaseApp.app() != nil
    }

    init() {
        guard isFirebaseConfigured else { return }
        if let user = Auth.auth().currentUser {
            apply(user: user)
        }
        Auth.auth().addStateDidChangeListener { [weak self] _, user in
            Task { @MainActor in
                if let user { self?.apply(user: user) } else { self?.clear() }
            }
        }
    }

    func signInWithGoogle() {
        guard isFirebaseConfigured else {
            errorMessage = "Firebase isn't connected yet — add GoogleService-Info.plist. See apps/ios/README.md."
            return
        }
        guard let clientID = FirebaseApp.app()?.options.clientID else { return }
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config

        guard let rootVC = UIApplication.shared.connectedScenes
            .compactMap({ ($0 as? UIWindowScene)?.keyWindow })
            .first?.rootViewController
        else { return }

        GIDSignIn.sharedInstance.signIn(withPresenting: rootVC) { [weak self] result, error in
            if let error {
                Task { @MainActor in self?.errorMessage = error.localizedDescription }
                return
            }
            guard let idToken = result?.user.idToken?.tokenString else { return }
            let accessToken = result?.user.accessToken.tokenString ?? ""
            let credential = GoogleAuthProvider.credential(withIDToken: idToken, accessToken: accessToken)
            Auth.auth().signIn(with: credential) { authResult, error in
                Task { @MainActor in
                    if let error {
                        self?.errorMessage = error.localizedDescription
                    } else if let user = authResult?.user {
                        self?.apply(user: user)
                    }
                }
            }
        }
    }

    func signOut() {
        guard isFirebaseConfigured else { return }
        try? Auth.auth().signOut()
        GIDSignIn.sharedInstance.signOut()
        clear()
    }

    private func apply(user: FirebaseAuth.User) {
        displayName = user.displayName
        photoURL = user.photoURL
        isSignedIn = true
    }

    private func clear() {
        displayName = nil
        photoURL = nil
        isSignedIn = false
    }
}
