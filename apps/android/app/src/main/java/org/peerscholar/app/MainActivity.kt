package org.peerscholar.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import org.peerscholar.app.auth.AuthViewModel
import org.peerscholar.app.data.AppStore
import org.peerscholar.app.data.LearnerSync
import org.peerscholar.app.ui.screens.*
import org.peerscholar.app.ui.theme.PeerScholarTheme

class MainActivity : ComponentActivity() {
    private val authViewModel: AuthViewModel by viewModels()
    private val appStore: AppStore by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        authViewModel.refresh()
        appStore.attach(this)
        // Pull cloud progress if there's already a signed-in session.
        if (LearnerSync.currentUid() != null) appStore.syncOnSignIn()
        setContent {
            PeerScholarTheme {
                PeerScholarApp(authViewModel, appStore)
            }
        }
    }
}

private data class Tab(val route: String, val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)

private val tabs = listOf(
    Tab("home", "Home", Icons.Filled.Home),
    Tab("browse", "Browse", Icons.Filled.Search),
    Tab("dashboard", "My Learning", Icons.Filled.MenuBook),
    Tab("profile", "Profile", Icons.Filled.Person),
)

@Composable
fun PeerScholarApp(authViewModel: AuthViewModel, appStore: AppStore) {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            val backStackEntry by navController.currentBackStackEntryAsState()
            val currentDestination = backStackEntry?.destination
            NavigationBar {
                tabs.forEach { tab ->
                    NavigationBarItem(
                        selected = currentDestination?.hierarchy?.any { it.route == tab.route } == true,
                        onClick = {
                            navController.navigate(tab.route) {
                                popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(tab.icon, contentDescription = tab.label) },
                        label = { Text(tab.label) },
                    )
                }
            }
        }
    ) { padding ->
        NavHost(navController = navController, startDestination = "home", modifier = Modifier.padding(padding)) {
            composable("home") {
                HomeScreen(
                    onCourseClick = { navController.navigate("course/$it") },
                    onTutorClick = { navController.navigate("tutor/$it") },
                )
            }
            composable("browse") { BrowseScreen(appStore) }
            composable("dashboard") { DashboardScreen(authViewModel, appStore) }
            composable("profile") { ProfileScreen(authViewModel, appStore) }
            composable("course/{id}") { backStackEntry ->
                CourseDetailScreen(
                    courseId = backStackEntry.arguments?.getString("id").orEmpty(),
                    store = appStore,
                    onOpenPlayer = { navController.navigate("learn/$it") },
                )
            }
            composable("learn/{id}") { backStackEntry ->
                CoursePlayerScreen(
                    courseId = backStackEntry.arguments?.getString("id").orEmpty(),
                    store = appStore,
                )
            }
            composable("tutor/{id}") { backStackEntry ->
                TutorProfileScreen(
                    tutorId = backStackEntry.arguments?.getString("id").orEmpty(),
                    onCourseClick = { navController.navigate("course/$it") },
                    store = appStore,
                )
            }
        }
    }
}
