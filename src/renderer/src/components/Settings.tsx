import React, { useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import './Settings.css'

// Define theme types
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CYBERPUNK: 'cyberpunk'
} as const

export type ThemeType = (typeof THEMES)[keyof typeof THEMES]

// Define sections for navigation
interface Section {
  id: string
  title: string
}

interface SettingsProps {
  onClose: () => void
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const {
    settings,
    setTheme,
    setFontSize,
    setFontFamily,
    setAutoUpdate,
    setCheckForUpdatesOnStartup,
    setCrtEffect,
    setBcryptRounds,
    setWordWrap
  } = useSettingsStore()

  // Define sections for navigation
  const sections: Section[] = [
    { id: 'theme', title: 'Theme' },
    { id: 'font', title: 'Font' },
    { id: 'updates', title: 'Updates' },
    { id: 'transformations', title: 'Transformations' }
  ]

  // Track active section
  const [activeSection, setActiveSection] = useState('theme')

  // Available font options
  const fontOptions = [
    "Consolas, 'Courier New', monospace",
    "'Courier New', monospace",
    "'Fira Code', monospace",
    "'Source Code Pro', monospace",
    'monospace'
  ]

  // Local state for form values
  const [localSettings, setLocalSettings] = useState({
    theme: settings.theme,
    fontSize: settings.fontSize,
    fontFamily: settings.fontFamily,
    autoUpdate: settings.autoUpdate,
    checkForUpdatesOnStartup: settings.checkForUpdatesOnStartup,
    turboMode: settings.crtEffect, // Renamed to match Vue version
    bcryptRounds: settings.bcryptRounds || 12,
    wordWrap: settings.wordWrap
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target
    let newValue: string | boolean | number = value

    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked
    } else if (type === 'number') {
      newValue = parseInt(value, 10)
    }

    // Update local state
    setLocalSettings((prev) => ({ ...prev, [name]: newValue }))

    // Apply settings immediately (like Vue watchers)
    applySettingChange(name, newValue)
  }

  // Apply a single setting change
  const applySettingChange = (name: string, value: string | boolean | number): void => {
    switch (name) {
      case 'theme':
        setTheme(value as ThemeType)
        break
      case 'fontSize':
        setFontSize(value as number)
        break
      case 'fontFamily':
        setFontFamily(value as string)
        break
      case 'autoUpdate':
        setAutoUpdate(value as boolean)
        break
      case 'checkForUpdatesOnStartup':
        setCheckForUpdatesOnStartup(value as boolean)
        break

      case 'turboMode':
        setCrtEffect(value as boolean)
        break
      case 'bcryptRounds':
        setBcryptRounds(value as number)
        break
      case 'wordWrap':
        setWordWrap(value as boolean)
        break
    }
  }

  // Close settings
  const closeSettings = (): void => {
    onClose()
  }

  // Reset settings to defaults
  const handleReset = (): void => {
    if (window.confirm('Are you sure you want to reset all settings to their default values?')) {
      const defaultSettings = {
        theme: 'cyberpunk', // Match Vue default
        fontSize: 14,
        fontFamily: "Consolas, 'Courier New', monospace", // Match Vue default
        autoUpdate: true,
        checkForUpdatesOnStartup: true,

        turboMode: true, // Match Vue default
        bcryptRounds: 12,
        wordWrap: true
      }

      // Update local state
      setLocalSettings(defaultSettings)

      // Apply all settings
      setTheme(defaultSettings.theme as ThemeType)
      setFontSize(defaultSettings.fontSize)
      setFontFamily(defaultSettings.fontFamily)
      setAutoUpdate(defaultSettings.autoUpdate)
      setCheckForUpdatesOnStartup(defaultSettings.checkForUpdatesOnStartup)

      setCrtEffect(defaultSettings.turboMode)
      setBcryptRounds(defaultSettings.bcryptRounds)
      setWordWrap(defaultSettings.wordWrap)
    }
  }

  return (
    <div
      className="settings-overlay"
      onClick={(e) => {
        // Close settings when clicking outside the container
        if ((e.target as HTMLElement).className === 'settings-overlay') {
          onClose()
        }
      }}
    >
      <div className="settings-container">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-layout">
            {/* Settings Navigation Sidebar */}
            <div className="settings-sidebar">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </div>
              ))}
            </div>

            {/* Settings Content Area */}
            <div className="settings-sections-container">
              {/* Theme Settings */}
              {activeSection === 'theme' && (
                <div className="settings-section">
                  <h3 className="settings-section-title">Theme</h3>
                  <div className="settings-section-content">
                    <div className="settings-row">
                      <label className="settings-label">Theme</label>
                      <div className="settings-control">
                        <select name="theme" value={localSettings.theme} onChange={handleChange}>
                          <option value={THEMES.LIGHT}>Light</option>
                          <option value={THEMES.DARK}>Dark</option>
                          <option value={THEMES.CYBERPUNK}>Cyberpunk</option>
                        </select>
                      </div>
                    </div>

                    <div className="settings-row">
                      <label className="settings-label">Turbo Mode</label>
                      <div className="settings-control">
                        <input
                          type="checkbox"
                          name="turboMode"
                          checked={localSettings.turboMode}
                          onChange={handleChange}
                        />
                        <span className="settings-description">Enable</span>
                      </div>
                    </div>

                    <div className="settings-info">
                      <p>
                        Turbo Mode adds visual effects that may impact performance on older devices.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Font Settings */}
              {activeSection === 'font' && (
                <div className="settings-section">
                  <h3 className="settings-section-title">Font</h3>
                  <div className="settings-section-content">
                    <div className="settings-row">
                      <label className="settings-label">Font Family</label>
                      <div className="settings-control">
                        <select
                          name="fontFamily"
                          value={localSettings.fontFamily}
                          onChange={handleChange}
                        >
                          {fontOptions.map((font, index) => (
                            <option key={index} value={font}>
                              {font.split(',')[0].replace(/["']/g, '')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="settings-row">
                      <label className="settings-label">Font Size</label>
                      <div className="settings-control">
                        <input
                          type="number"
                          name="fontSize"
                          min="8"
                          max="32"
                          value={localSettings.fontSize}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="settings-row">
                      <label className="settings-label">Word Wrap</label>
                      <div className="settings-control">
                        <input
                          type="checkbox"
                          name="wordWrap"
                          checked={localSettings.wordWrap}
                          onChange={handleChange}
                        />
                        <span className="settings-description">Enable word wrap in text areas</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto Update Settings */}
              {activeSection === 'updates' && (
                <div className="settings-section">
                  <h3 className="settings-section-title">Updates</h3>
                  <div className="settings-section-content">
                    <div className="settings-row">
                      <label className="settings-label">Enable Auto Update</label>
                      <div className="settings-control">
                        <input
                          type="checkbox"
                          name="autoUpdate"
                          checked={localSettings.autoUpdate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="settings-row">
                      <label className="settings-label">Check for Updates on Startup</label>
                      <div className="settings-control">
                        <input
                          type="checkbox"
                          name="checkForUpdatesOnStartup"
                          checked={localSettings.checkForUpdatesOnStartup}
                          onChange={handleChange}
                          disabled={!localSettings.autoUpdate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transformations Settings */}
              {activeSection === 'transformations' && (
                <div className="settings-section">
                  <h3 className="settings-section-title">Transformations</h3>
                  <div className="settings-section-content">
                    <div className="settings-row">
                      <label className="settings-label">Bcrypt Rounds (Cost Factor)</label>
                      <div className="settings-control">
                        <input
                          type="number"
                          name="bcryptRounds"
                          min="1"
                          max="20"
                          value={localSettings.bcryptRounds}
                          onChange={handleChange}
                        />
                        <span className="settings-description">Default: 12 (recommended)</span>
                      </div>
                    </div>
                    <div className="settings-info">
                      <p>
                        Higher rounds provide stronger security but take longer to compute. The
                        default value of 12 is a good balance between security and performance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={handleReset}>Reset to Defaults</button>
          <button onClick={closeSettings}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default Settings
