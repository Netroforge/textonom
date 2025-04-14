package com.github.netroforge.textonom.viewmodel

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import com.github.netroforge.textonom.model.SessionState
import com.github.netroforge.textonom.model.Settings
import com.github.netroforge.textonom.model.Tab
import kotlinx.coroutines.*
import java.io.File

/**
 * Manages tabs in the application.
 */
class TabManager(private var settings: Settings) {
    // Coroutine scope for auto-save
    private val coroutineScope = CoroutineScope(Dispatchers.IO)
    private var autoSaveJob: Job? = null
    // List of all tabs
    private val _tabs = mutableStateListOf<Tab>()
    val tabs: List<Tab> get() = _tabs

    // Currently selected tab index
    private val _selectedTabIndex = mutableStateOf(-1)
    val selectedTabIndex: Int get() = _selectedTabIndex.value

    // Currently selected tab
    val selectedTab: Tab?
        get() = if (_selectedTabIndex.value >= 0 && _selectedTabIndex.value < _tabs.size) {
            _tabs[_selectedTabIndex.value]
        } else {
            null
        }

    // Undo availability state
    private val _canUndo = mutableStateOf(false)
    val canUndo: Boolean get() = _canUndo.value

    // Redo availability state
    private val _canRedo = mutableStateOf(false)
    val canRedo: Boolean get() = _canRedo.value

    /**
     * Updates the undo/redo state based on the current selected tab.
     * This forces a recomposition of any UI elements that depend on canUndo/canRedo.
     */
    fun updateUndoRedoState() {
        val tab = selectedTab
        val canUndoValue = tab?.textHistory?.canUndo ?: false
        val canRedoValue = tab?.textHistory?.canRedo ?: false

        if (_canUndo.value != canUndoValue || _canRedo.value != canRedoValue) {
            _canUndo.value = canUndoValue
            _canRedo.value = canRedoValue
        }
    }

    // Counter for untitled tabs
    private var untitledCounter = 1

    init {
        // Restore tabs from session state if available
        restoreSessionState()
        // Initialize undo/redo state
        updateUndoRedoState()
    }

    /**
     * Creates a new empty tab and selects it.
     */
    fun createNewTab() {
        val newTab = Tab.createEmpty(untitledCounter++)
        _tabs.add(newTab)
        _selectedTabIndex.value = _tabs.size - 1
        updateUndoRedoState()
        saveSessionState()
    }

    /**
     * Opens a file in a new tab and selects it.
     * If the file is already open, selects that tab instead.
     */
    fun openFile(file: File) {
        // Check if the file is already open
        val existingTabIndex = _tabs.indexOfFirst { it.file?.absolutePath == file.absolutePath }
        if (existingTabIndex >= 0) {
            // File is already open, select that tab
            _selectedTabIndex.value = existingTabIndex
            updateUndoRedoState()
            return
        }

        // Create a new tab for the file
        val newTab = Tab.fromFile(file)
        _tabs.add(newTab)
        _selectedTabIndex.value = _tabs.size - 1
        updateUndoRedoState()
        saveSessionState()
    }

    /**
     * Saves the content of the selected tab to a file.
     * If the tab is not associated with a file, associates it with the given file.
     */
    fun saveSelectedTab(file: File? = null) {
        val currentTab = selectedTab ?: return
        val targetFile = file ?: currentTab.file ?: return

        // Write content to file
        targetFile.writeText(currentTab.content)

        // Update tab
        val updatedTab = if (currentTab.file == null) {
            // This was an untitled tab, update its title and file
            currentTab.copy(
                title = targetFile.name,
                file = targetFile,
                isModified = false
            )
        } else {
            // This was already a file-based tab, just mark as saved
            currentTab.markAsSaved()
        }

        // Replace the tab in the list
        _tabs[_selectedTabIndex.value] = updatedTab
        saveSessionState()
    }

    /**
     * Updates the content of the selected tab.
     */
    fun updateSelectedTabContent(newContent: String) {
        val currentTab = selectedTab ?: return

        // Check if this would create a meaningful state change
        if (currentTab.content == newContent) {
            return
        }

        val updatedTab = currentTab.withContent(newContent)
        _tabs[_selectedTabIndex.value] = updatedTab

        // Ensure UI state is updated after content change
        updateUndoRedoState()
        saveSessionState()
    }

    /**
     * Selects a tab by index.
     */
    fun selectTab(index: Int) {
        if (index in _tabs.indices) {
            _selectedTabIndex.value = index
            updateUndoRedoState()
            saveSessionState()
        }
    }

    /**
     * Closes a tab by index.
     * If the closed tab was selected, selects another tab if available.
     */
    fun closeTab(index: Int) {
        if (index !in _tabs.indices) return

        // Remove the tab
        _tabs.removeAt(index)

        // Update selected tab index
        when {
            _tabs.isEmpty() -> _selectedTabIndex.value = -1
            _selectedTabIndex.value >= _tabs.size -> _selectedTabIndex.value = _tabs.size - 1
            _selectedTabIndex.value > index -> _selectedTabIndex.value--
            // If index == selectedTabIndex, we keep the same index which now points to the next tab
        }

        saveSessionState()
    }

    /**
     * Closes the currently selected tab.
     */
    fun closeSelectedTab() {
        if (_selectedTabIndex.value >= 0) {
            closeTab(_selectedTabIndex.value)
        }
    }

    /**
     * Undoes the last change in the selected tab.
     * Returns true if the operation was successful, false otherwise.
     */
    fun undoSelectedTab(): Boolean {
        val currentTab = selectedTab ?: return false
        val undoneTab = currentTab.undo() ?: return false

        // Update the tab in the list
        _tabs[_selectedTabIndex.value] = undoneTab

        // Update UI state immediately
        updateUndoRedoState()
        return true
    }

    /**
     * Redoes the last undone change in the selected tab.
     * Returns true if the operation was successful, false otherwise.
     */
    fun redoSelectedTab(): Boolean {
        val currentTab = selectedTab ?: return false
        val redoneTab = currentTab.redo() ?: return false

        // Update the tab in the list
        _tabs[_selectedTabIndex.value] = redoneTab

        // Update UI state immediately
        updateUndoRedoState()
        return true
    }

    /**
     * Applies a transformation to the content of the selected tab.
     */
    fun transformSelectedTabContent(transformation: (String) -> String) {
        val currentTab = selectedTab ?: return
        val transformedContent = transformation(currentTab.content)
        updateSelectedTabContent(transformedContent)
    }

    /**
     * Starts the auto-save job if auto-save is enabled in settings.
     */
    fun startAutoSave() {
        // Cancel existing job if running
        autoSaveJob?.cancel()

        // Start new job if auto-save is enabled
        if (settings.autoSave) {
            autoSaveJob = coroutineScope.launch {
                while (isActive) {
                    delay(settings.autoSaveIntervalSeconds * 1000L)
                    // Auto-save all file-based tabs that are modified
                    _tabs.forEachIndexed { index, tab ->
                        if (tab.isFileBased && tab.isModified) {
                            tab.file?.writeText(tab.content)
                            _tabs[index] = tab.markAsSaved()
                        }
                    }
                }
            }
        }
    }

    /**
     * Updates settings and restarts auto-save if needed.
     */
    fun updateSettings(newSettings: Settings) {
        // Save the current session state to the new settings
        val currentSessionState = SessionState.fromTabs(_tabs, _selectedTabIndex.value)
        val updatedSettings = newSettings.withSessionState(currentSessionState)

        // Update the settings reference
        settings = updatedSettings

        // If auto-save settings changed, restart auto-save
        if (updatedSettings.autoSave != settings.autoSave ||
            updatedSettings.autoSaveIntervalSeconds != settings.autoSaveIntervalSeconds) {
            startAutoSave()
        }
    }

    /**
     * Cancels all coroutines when the manager is no longer needed.
     */
    fun dispose() {
        // Save session state before disposing
        saveSessionState()
        coroutineScope.cancel()
    }

    /**
     * Saves the current session state to settings.
     */
    fun saveSessionState() {
        val sessionState = SessionState.fromTabs(_tabs, _selectedTabIndex.value)
        // Update the settings object with the new session state
        settings = settings.withSessionState(sessionState)
        // Save the settings to disk
        settings.save()
    }

    /**
     * Restores tabs from the saved session state.
     */
    private fun restoreSessionState() {
        val sessionState = settings.sessionState
        if (sessionState.tabs.isNotEmpty()) {
            // Clear existing tabs
            _tabs.clear()

            // Add tabs from session state
            _tabs.addAll(sessionState.toTabs())

            // Set selected tab index
            _selectedTabIndex.value = if (sessionState.selectedTabIndex in _tabs.indices) {
                sessionState.selectedTabIndex
            } else if (_tabs.isNotEmpty()) {
                0 // Select first tab if saved index is invalid
            } else {
                -1 // No tabs
            }

            // Update untitled counter to be higher than any existing untitled tab
            updateUntitledCounter()
        }
    }

    /**
     * Updates the untitled counter to be higher than any existing untitled tab.
     */
    private fun updateUntitledCounter() {
        _tabs.forEach { tab ->
            if (!tab.isFileBased && tab.title.startsWith("Untitled-")) {
                try {
                    val number = tab.title.removePrefix("Untitled-").toInt()
                    if (number >= untitledCounter) {
                        untitledCounter = number + 1
                    }
                } catch (e: NumberFormatException) {
                    // Ignore if the title doesn't end with a number
                }
            }
        }
    }
}
