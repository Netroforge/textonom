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
    val isModified: Boolean = false
) {
    /**
     * Returns true if this tab is associated with a file on disk.
     */
    val isFileBased: Boolean
        get() = file != null

    /**
     * Creates a copy of this tab with the given content and sets isModified flag.
     */
    fun withContent(newContent: String): Tab {
        return copy(
            content = newContent,
            isModified = if (file != null) {
                // For file-based tabs, check if content has changed from the file
                newContent != file.readText()
            } else {
                // For non-file tabs, check if content is not empty
                newContent.isNotEmpty()
            }
        )
    }

    /**
     * Creates a copy of this tab with the isModified flag set to false.
     */
    fun markAsSaved(): Tab {
        return copy(isModified = false)
    }

    companion object {
        /**
         * Creates a new empty tab that is not associated with a file.
         */
        fun createEmpty(index: Int): Tab {
            return Tab(
                title = "Untitled-$index",
                content = "",
                file = null
            )
        }

        /**
         * Creates a tab from a file.
         */
        fun fromFile(file: File): Tab {
            return Tab(
                title = file.name,
                content = file.readText(),
                file = file
            )
        }
    }
}
