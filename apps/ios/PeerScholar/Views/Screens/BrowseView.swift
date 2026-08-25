import SwiftUI

struct BrowseView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 10) {
                Text("Upcoming live sessions").font(.title3.bold()).padding(.horizontal)
                ForEach(MockData.liveSessions) { session in
                    SessionCard(session: session).padding(.horizontal)
                }
            }
            .padding(.top)
        }
        .navigationTitle("Browse")
    }
}
