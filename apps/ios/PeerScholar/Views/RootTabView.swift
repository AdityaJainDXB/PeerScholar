import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            NavigationStack { HomeView() }
                .tabItem { Label("Home", systemImage: "house.fill") }

            NavigationStack { BrowseView() }
                .tabItem { Label("Browse", systemImage: "magnifyingglass") }

            NavigationStack { DashboardView() }
                .tabItem { Label("My Learning", systemImage: "graduationcap.fill") }

            NavigationStack { ProfileView() }
                .tabItem { Label("Profile", systemImage: "person.crop.circle") }
        }
        .tint(Color.brand)
    }
}

extension Color {
    static let brand = Color(red: 0.20, green: 0.39, blue: 0.94) // matches web's brand-600
    static let brandNavy = Color(red: 0.06, green: 0.15, blue: 0.30) // logo's shield background
    static let gold = Color(red: 0.96, green: 0.73, blue: 0.26) // logo's star accent
}
