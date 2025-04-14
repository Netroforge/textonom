package com.github.netroforge.textonom.model

import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient

/**
 * Manages text history for undo/redo operations.
 * Keeps track of text changes and allows navigating through the history.
 */
@Serializable
data class TextHistory(private val initialText: String = "") {
    /**
     * Creates a copy of this TextHistory with the same state.
     * This is a custom copy method that preserves the internal state.
     */
    fun copyWithInitialText(initialText: String): TextHistory {
        val copy = TextHistory(initialText)
        // Copy the history and current position
        copy.history.clear()
        copy.history.addAll(this.history)
        copy.currentPosition = this.currentPosition
        copy.totalStates = this.totalStates
        println("TextHistory.copy: created copy with currentPosition=$currentPosition, historySize=${history.size}")
        return copy
    }

    /**
     * Creates a copy of this TextHistory with the same state and initial text.
     */
    fun copy(): TextHistory {
        return copyWithInitialText(initialText)
    }
    // Maximum number of history states to keep
    private val maxHistorySize = 100

    // History of text states
    @Transient
    private val history = mutableListOf(initialText)

    // Current position in history
    @Transient
    private var currentPosition = 0

    // Track total number of states ever added
    @Transient
    private var totalStates = 0

    /**
     * Adds a new text state to the history.
     * If we're not at the end of the history, truncate the future states.
     */
    fun addState(text: String) {
        // Don't add if it's the same as the current state
        if (text == currentState) return

        // Remove any states after current position
        if (currentPosition < history.size - 1) {
            history.subList(currentPosition + 1, history.size).clear()
        }

        // Add new state
        history.add(text)
        currentPosition = history.size - 1
        totalStates++

        // If we exceeded max size, remove oldest states
        while (history.size > maxHistorySize) {
            history.removeAt(0)
            currentPosition--
        }
    }

    /**
     * Returns the current text state.
     */
    val currentState: String
        get() = history[currentPosition]

    /**
     * Returns true if undo is available.
     */
    val canUndo: Boolean
        get() = currentPosition > 0

    /**
     * Returns true if redo is available.
     */
    val canRedo: Boolean
        get() = currentPosition < history.size - 1

    /**
     * Moves back one step in history and returns the previous state.
     * Returns null if there's no previous state.
     */
    fun undo(): String? {
        if (!canUndo) return null

        currentPosition--
        return history[currentPosition]
    }

    /**
     * Moves forward one step in history and returns the next state.
     * Returns null if there's no next state.
     */
    fun redo(): String? {
        if (!canRedo) return null

        currentPosition++
        return history[currentPosition]
    }

    /**
     * Clears the history and sets a new initial state.
     */
    fun reset(initialText: String = "") {
        history.clear()
        history.add(initialText)
        currentPosition = 0
        totalStates = 0
    }
}
