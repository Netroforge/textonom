package com.github.netroforge.textonom.model

import kotlinx.serialization.Serializable
import java.io.File

/**
 * Represents the state of a tab for serialization purposes.
 * This is a simplified version of Tab that can be serialized.
 */
@Serializable
data class TabState(
    val title: String,
    val filePath: String? = null,
    val content: String? = null, // Only stored for unsaved tabs
    val isModified: Boolean = false
)

/**
 * Represents the state of the editor session.
 * This includes information about open tabs and the selected tab.
 */
@Serializable
data class SessionState(
    val tabs: List<TabState> = emptyList(),
    val selectedTabIndex: Int = -1
) {
    /**
     * Converts this session state to a list of tabs.
     */
    fun toTabs(): List<Tab> {
        return tabs.mapIndexed { index, tabState ->
            if (tabState.filePath != null) {
                // This is a file-based tab
                val file = File(tabState.filePath)
                if (file.exists()) {
                    // File exists, create a tab from it
                    Tab(
                        title = tabState.title,
                        content = file.readText(),
                        file = file,
                        isModified = tabState.isModified
                    )
                } else {
                    // File doesn't exist anymore, create an unsaved tab with the content
                    Tab(
                        title = tabState.title,
                        content = tabState.content ?: "",
                        isModified = true
                    )
                }
            } else {
                // This is an unsaved tab
                Tab(
                    title = tabState.title,
                    content = tabState.content ?: "",
                    isModified = tabState.isModified
                )
            }
        }
    }

    companion object {
        /**
         * Creates a session state from a list of tabs and a selected tab index.
         */
        fun fromTabs(tabs: List<Tab>, selectedTabIndex: Int): SessionState {
            val tabStates = tabs.map { tab ->
                TabState(
                    title = tab.title,
                    filePath = tab.file?.absolutePath,
                    // Only store content for unsaved tabs
                    content = if (tab.file == null) tab.content else null,
                    isModified = tab.isModified
                )
            }
            return SessionState(tabStates, selectedTabIndex)
        }
    }
}
