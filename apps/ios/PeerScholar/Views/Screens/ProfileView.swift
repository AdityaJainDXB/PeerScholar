import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var auth: AuthManager

    var body: some View {
        VStack(spacing: 16) {
            Spacer(minLength: 40)

            if auth.isSignedIn {
                AsyncImage(url: auth.photoURL) { $0.resizable() } placeholder: { Color(.systemGray4) }
                    .frame(width: 72, height: 72)
                    .clipShape(Circle())
                Text(auth.displayName ?? "PeerScholar user").font(.headline)
                Text("Signed in with Google").font(.footnote).foregroundStyle(.secondary)
                Button("Sign out", role: .destructive) { auth.signOut() }
                    .buttonStyle(.bordered)
            } else {
                Circle().fill(Color(.systemGray5)).frame(width: 72, height: 72)
                    .overlay(Text("You").font(.footnote))
                Text("Your account").font(.headline)

                if !auth.isFirebaseConfigured {
                    Text("Firebase isn't connected yet — add GoogleService-Info.plist to enable real sign-in. See apps/ios/README.md.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                }

                if let error = auth.errorMessage {
                    Text(error).font(.caption).foregroundStyle(.red).padding(.horizontal, 32)
                        .multilineTextAlignment(.center)
                }

                Button {
                    auth.signInWithGoogle()
                } label: {
                    Label("Sign in with Google", systemImage: "person.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(Color.brand)
                .padding(.horizontal, 32)
                .padding(.top, 8)
            }

            Spacer()
        }
        .navigationTitle("Profile")
    }
}
