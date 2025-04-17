import { defineStore } from 'pinia'

// Define available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CYBERPUNK: 'cyberpunk',
  CYBERPUNK_TURBO: 'cyberpunk-turbo'
}

// Define default settings
const defaultSettings = {
  theme: THEMES.DARK,
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace',
  tabSize: 2,
  insertSpaces: true,
  wordWrap: 'on',
  lineNumbers: 'on',
  autoSave: false,
  autoSaveInterval: 30000 // 30 seconds
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
