package com.github.netroforge.textonom.model

import java.io.File

/**
 * Represents a tab in the application.
 * A tab can be either associated with a file on disk or be a temporary tab.
 */
data class Tab(
    val id: String = java.util.UUID.randomUUID().toString(),
    val title: String,
    val content: String,
    val file: File? = null,
    val isModified: Boolean = false,
    val textHistory: TextHistory = TextHistory(content)
) {
    /**
     * Returns true if this tab is associated with a file on disk.
     */
    val isFileBased: Boolean
        get() = file != null

    /**
     * Creates a copy of this tab with the given content and sets isModified flag.
     * Also adds the new content to the text history.
     */
    fun withContent(newContent: String): Tab {
        println("Tab.withContent: creating new tab with updated content")

        // Create a new text history with the updated content
        val updatedHistory = textHistory.copy() // Use our custom copy method
        println("Tab.withContent: copied textHistory, canUndo=${updatedHistory.canUndo}, canRedo=${updatedHistory.canRedo}")

        // Add the new content to the history
        updatedHistory.addState(newContent)
        println("Tab.withContent: added new state to history, canUndo=${updatedHistory.canUndo}, canRedo=${updatedHistory.canRedo}")

        val result = copy(
            content = newContent,
            isModified = if (file != null) {
                // For file-based tabs, check if content has changed from the file
                newContent != file.readText()
            } else {
                // For non-file tabs, check if content is not empty
                newContent.isNotEmpty()
            },
            textHistory = updatedHistory
        )

        println("Tab.withContent: created new tab, canUndo=${result.textHistory.canUndo}, canRedo=${result.textHistory.canRedo}")
        return result
    }

    /**
     * Creates a copy of this tab with the isModified flag set to false.
     */
    fun markAsSaved(): Tab {
        return copy(isModified = false)
    }

    /**
     * Creates a copy of this tab with the content set to the previous state in history.
     * Returns null if there's no previous state.
     */
    fun undo(): Tab? {
        println("Tab.undo: attempting to undo, canUndo=${textHistory.canUndo}")
        if (!textHistory.canUndo) return null

        // First make a copy of the history
        val historyClone = textHistory.copy()
        // Then perform the undo on the copy
        val previousContent = historyClone.undo() ?: return null
        println("Tab.undo: got previous content, creating new tab")

        val result = copy(
            content = previousContent,
            isModified = if (file != null) {
                previousContent != file.readText()
            } else {
                previousContent.isNotEmpty()
            },
            textHistory = historyClone // Use the modified copy
        )

        println("Tab.undo: created new tab, canUndo=${result.textHistory.canUndo}, canRedo=${result.textHistory.canRedo}")
        return result
    }

    /**
     * Creates a copy of this tab with the content set to the next state in history.
     * Returns null if there's no next state.
     */
    fun redo(): Tab? {
        println("Tab.redo: attempting to redo, canRedo=${textHistory.canRedo}")

        // First make a copy of the history
        val historyClone = textHistory.copy()
        // Then perform the redo on the copy
        val nextContent = historyClone.redo()
        if (nextContent == null) {
            println("Tab.redo: no next content available")
            return null
        }

        println("Tab.redo: got next content: $nextContent, creating new tab")

        val result = copy(
            content = nextContent,
            isModified = if (file != null) {
                nextContent != file.readText()
            } else {
                nextContent.isNotEmpty()
            },
            textHistory = historyClone // Use the modified copy
        )

        println("Tab.redo: created new tab, canUndo=${result.textHistory.canUndo}, canRedo=${result.textHistory.canRedo}")
        return result
    }

    companion object {
        /**
         * Creates a new empty tab that is not associated with a file.
         */
        fun createEmpty(index: Int): Tab {
            val emptyContent = ""
            return Tab(
                title = "Untitled-$index",
                content = emptyContent,
                file = null,
                textHistory = TextHistory(emptyContent)
            )
        }

        /**
         * Creates a tab from a file.
         */
        fun fromFile(file: File): Tab {
            val content = file.readText()
            return Tab(
                title = file.name,
                content = content,
                file = file,
                textHistory = TextHistory(content)
            )
        }
    }
}
