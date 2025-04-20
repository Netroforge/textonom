import { defineStore } from 'pinia'

// Define available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CYBERPUNK: 'cyberpunk'
}

// Define default settings
const defaultSettings = {
  theme: THEMES.CYBERPUNK,
  turboMode: true, // Enable Turbo Mode (CRT effects) by default
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace',
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'on',
  lineNumbers: 'on',
  autoSave: false,
  autoSaveInterval: 30000, // 30 seconds
  autoUpdate: true, // Enable auto-update by default
  checkForUpdatesOnStartup: true, // Check for updates on startup by default
  lastDirectory: '', // Last directory used for file operations
  bcryptRounds: 12 // Default bcrypt rounds (cost factor)
}

// Load settings from localStorage if available
const loadSettings = () => {
  const savedSettings = localStorage.getItem('textonom-settings')
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings)
    } catch (e) {
      console.error('Failed to parse saved settings:', e)
    }
  }
  return defaultSettings
}

export const useSettingsStore = defineStore('settings', {
  state: () => loadSettings(),

  actions: {
    // Update theme
    setTheme(theme) {
      this.theme = theme
      this.saveSettings()
    },

    // Update turbo mode
    setTurboMode(enabled) {
      this.turboMode = enabled
      this.saveSettings()
    },

    // Update font size
    setFontSize(fontSize) {
      this.fontSize = Number(fontSize)
      this.saveSettings()
    },

    // Update font family
    setFontFamily(fontFamily) {
      this.fontFamily = fontFamily
      this.saveSettings()
    },

    // Update tab size
    setTabSize(tabSize) {
      this.tabSize = Number(tabSize)
      this.saveSettings()
    },

    // Update insert spaces
    setInsertSpaces(insertSpaces) {
      this.insertSpaces = insertSpaces
      this.saveSettings()
    },

    // Update word wrap
    setWordWrap(wordWrap) {
      this.wordWrap = wordWrap
      this.saveSettings()
    },

    // Update line numbers
    setLineNumbers(lineNumbers) {
      this.lineNumbers = lineNumbers
      this.saveSettings()
    },

    // Update auto save
    setAutoSave(autoSave) {
      this.autoSave = autoSave
      this.saveSettings()
    },

    // Update auto save interval
    setAutoSaveInterval(autoSaveInterval) {
      this.autoSaveInterval = Number(autoSaveInterval)
      this.saveSettings()
    },

    // Update auto update setting
    setAutoUpdate(autoUpdate) {
      this.autoUpdate = autoUpdate
      this.saveSettings()
    },

    // Update check for updates on startup setting
    setCheckForUpdatesOnStartup(checkForUpdatesOnStartup) {
      this.checkForUpdatesOnStartup = checkForUpdatesOnStartup
      this.saveSettings()
    },

    // Update last directory setting
    setLastDirectory(lastDirectory) {
      this.lastDirectory = lastDirectory
      this.saveSettings()
    },

    // Update bcrypt rounds setting
    setBcryptRounds(bcryptRounds) {
      // Ensure the value is within the allowed range (1-20)
      this.bcryptRounds = Math.max(1, Math.min(20, Number(bcryptRounds)))
      this.saveSettings()
    },

    // Reset settings to defaults
    resetSettings() {
      Object.assign(this, defaultSettings)
      this.saveSettings()
    },

    // Save settings to localStorage
    saveSettings() {
      localStorage.setItem('textonom-settings', JSON.stringify(this.$state))
    }
  }
})
