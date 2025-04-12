package com.github.netroforge.textonom.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.github.netroforge.textonom.model.Settings
import kotlinx.coroutines.*

/**
 * Manages editor settings.
 */
class SettingsManager {
    // Current settings
    var settings by mutableStateOf(Settings.load())
        private set
    
    // Auto-save job
    private var autoSaveJob: Job? = null
    private val coroutineScope = CoroutineScope(Dispatchers.IO)
    
    init {
        // Start auto-save job if enabled
        if (settings.autoSave) {
            startAutoSaveJob()
        }
    }
    
    /**
     * Updates settings and saves them to disk.
     */
    fun updateSettings(newSettings: Settings) {
        // Cancel existing auto-save job if running
        autoSaveJob?.cancel()
        
        // Update settings
        settings = newSettings
        
        // Save settings to disk
        settings.save()
        
        // Start auto-save job if enabled
        if (settings.autoSave) {
            startAutoSaveJob()
        }
    }
    
    /**
     * Starts the auto-save job.
     */
    private fun startAutoSaveJob() {
        autoSaveJob = coroutineScope.launch {
            while (isActive) {
                delay(settings.autoSaveIntervalSeconds * 1000L)
                // The actual auto-save logic will be implemented in TabManager
                // This is just a placeholder for the job
            }
        }
    }
    
    /**
     * Cancels all coroutines when the manager is no longer needed.
     */
    fun dispose() {
        coroutineScope.cancel()
    }
}
