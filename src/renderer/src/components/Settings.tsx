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
    setTextGlowEffect,
    setCrtEffect,
    setBcryptRounds
  } = useSettingsStore()

  // Define sections for navigation
  const sections: Section[] = [
    { id: 'theme', title: 'Theme' },
    { id: 'font', title: 'Font' },
    { id: 'updates', title: 'Updates' },
    { id: 'effects', title: 'Effects' },
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
    textGlowEffect: settings.textGlowEffect,
    turboMode: settings.crtEffect, // Renamed to match Vue version
    bcryptRounds: settings.bcryptRounds || 12
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
      case 'textGlowEffect':
        setTextGlowEffect(value as boolean)
        break
      case 'turboMode':
        setCrtEffect(value as boolean)
        break
      case 'bcryptRounds':
        setBcryptRounds(value as number)
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
        textGlowEffect: true, // Match Vue default
        turboMode: true, // Match Vue default
        bcryptRounds: 12
      }

      // Update local state
      setLocalSettings(defaultSettings)

      // Apply all settings
      setTheme(defaultSettings.theme as ThemeType)
      setFontSize(defaultSettings.fontSize)
      setFontFamily(defaultSettings.fontFamily)
      setAutoUpdate(defaultSettings.autoUpdate)
      setCheckForUpdatesOnStartup(defaultSettings.checkForUpdatesOnStartup)
      setTextGlowEffect(defaultSettings.textGlowEffect)
      setCrtEffect(defaultSettings.turboMode)
      setBcryptRounds(defaultSettings.bcryptRounds)
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

              {/* Effects Settings */}
              {activeSection === 'effects' && (
                <div className="settings-section">
                  <h3 className="settings-section-title">Visual Effects</h3>
                  <div className="settings-section-content">
                    <div className="settings-row">
                      <label className="settings-label">Text Glow Effect</label>
                      <div className="settings-control">
                        <input
                          type="checkbox"
                          name="textGlowEffect"
                          checked={localSettings.textGlowEffect}
                          onChange={handleChange}
                        />
                        <span className="settings-description">Enable text glow effects</span>
                      </div>
                    </div>
                    <div className="settings-info">
                      <p>These effects may impact performance on older devices.</p>
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
                        The cost factor controls how many iterations the hashing algorithm performs.
                        Higher values are more secure but slower.
                      </p>
                      <ul>
                        <li>
                          <strong>1-4:</strong> Very fast, but not secure
                        </li>
                        <li>
                          <strong>5-7:</strong> Fast, minimal security
                        </li>
                        <li>
                          <strong>8-10:</strong> Moderate, acceptable for non-critical applications
                        </li>
                        <li>
                          <strong>11-12:</strong> Standard, good balance of security and performance
                        </li>
                        <li>
                          <strong>13-15:</strong> Secure, slower performance
                        </li>
                        <li>
                          <strong>16-20:</strong> Very secure, significantly slower
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-button reset-button" onClick={handleReset}>
            Reset to Defaults
          </button>
          <button className="settings-button close-button" onClick={closeSettings}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
