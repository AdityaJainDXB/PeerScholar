package org.peerscholar.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import org.peerscholar.app.data.MockData
import org.peerscholar.app.data.AppStore
import org.peerscholar.app.ui.components.SessionCard

@Composable
fun BrowseScreen(store: AppStore) {
    LazyColumn(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        items(MockData.liveSessions) { session -> SessionCard(session, store) }
    }
}
