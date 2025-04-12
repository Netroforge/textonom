package com.github.netroforge.textonom.viewmodel

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import com.github.netroforge.textonom.model.Settings
import com.github.netroforge.textonom.model.Tab
import kotlinx.coroutines.*
import java.io.File

/**
 * Manages tabs in the application.
 */
class TabManager(private val settings: Settings) {
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

    // Counter for untitled tabs
    private var untitledCounter = 1

    /**
     * Creates a new empty tab and selects it.
     */
    fun createNewTab() {
        val newTab = Tab.createEmpty(untitledCounter++)
        _tabs.add(newTab)
        _selectedTabIndex.value = _tabs.size - 1
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
            return
        }

        // Create a new tab for the file
        val newTab = Tab.fromFile(file)
        _tabs.add(newTab)
        _selectedTabIndex.value = _tabs.size - 1
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
    }

    /**
     * Updates the content of the selected tab.
     */
    fun updateSelectedTabContent(newContent: String) {
        val currentTab = selectedTab ?: return
        val updatedTab = currentTab.withContent(newContent)
        _tabs[_selectedTabIndex.value] = updatedTab
    }

    /**
     * Selects a tab by index.
     */
    fun selectTab(index: Int) {
        if (index in _tabs.indices) {
            _selectedTabIndex.value = index
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
        // If auto-save settings changed, restart auto-save
        if (newSettings.autoSave != settings.autoSave ||
            newSettings.autoSaveIntervalSeconds != settings.autoSaveIntervalSeconds) {
            startAutoSave()
        }
    }

    /**
     * Cancels all coroutines when the manager is no longer needed.
     */
    fun dispose() {
        coroutineScope.cancel()
    }
}
