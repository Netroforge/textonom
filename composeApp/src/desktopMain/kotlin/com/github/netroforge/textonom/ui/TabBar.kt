package com.github.netroforge.textonom.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.github.netroforge.textonom.model.Tab

/**
 * Displays a tab bar with tabs and a button to create a new tab.
 */
@Composable
fun TabBar(
    tabs: List<Tab>,
    selectedTabIndex: Int,
    onTabSelected: (Int) -> Unit,
    onTabClosed: (Int) -> Unit,
    onNewTabClicked: () -> Unit
) {
    Surface(
        elevation = 4.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        // Use Row with two parts: scrollable tabs and fixed new tab button
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(MaterialTheme.colors.surface),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Scrollable tabs area
            Row(
                modifier = Modifier
                    .weight(1f)
                    .horizontalScroll(rememberScrollState())
                    .padding(end = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Tabs
                tabs.forEachIndexed { index, tab ->
                    TabItem(
                        tab = tab,
                        isSelected = index == selectedTabIndex,
                        onClick = { onTabSelected(index) },
                        onClose = { onTabClosed(index) }
                    )
                }
            }

            // New tab button (fixed position)
            IconButton(
                onClick = onNewTabClicked,
                modifier = Modifier.size(48.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "New Tab",
                    tint = MaterialTheme.colors.primary
                )
            }
        }
    }
}

/**
 * Displays a single tab item.
 */
@Composable
private fun TabItem(
    tab: Tab,
    isSelected: Boolean,
    onClick: () -> Unit,
    onClose: () -> Unit
) {
    val backgroundColor = if (isSelected) {
        MaterialTheme.colors.primary.copy(alpha = 0.1f)
    } else {
        Color.Transparent
    }

    Row(
        modifier = Modifier
            .height(48.dp)
            .background(backgroundColor)
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Tab title with modified indicator
        Text(
            text = if (tab.isModified) "${tab.title} *" else tab.title,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.padding(end = 8.dp)
        )

        // Close button
        IconButton(
            onClick = onClose,
            modifier = Modifier.size(24.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Close,
                contentDescription = "Close Tab",
                tint = MaterialTheme.colors.onSurface.copy(alpha = 0.6f),
                modifier = Modifier.size(16.dp)
            )
        }
    }
}
