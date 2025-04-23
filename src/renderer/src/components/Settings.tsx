import React, { useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { twMerge } from 'tailwind-merge'
import Button from './ui/Button'

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

const SettingsTailwind: React.FC<SettingsProps> = ({ onClose }) => {
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        // Close settings when clicking outside the container
        if ((e.target as HTMLElement).classList.contains('bg-opacity-50')) {
          onClose()
        }
      }}
    >
      <div className="bg-surface rounded-lg w-4/5 max-w-[900px] h-auto min-h-[500px] max-h-[80%] flex flex-col overflow-hidden shadow-lg border border-border">
        <div className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-surface z-10 shadow-sm">
          <h2 className="text-lg font-medium text-text">Settings</h2>
          <button
            className="bg-transparent border-none text-text p-1 rounded hover:bg-surface-hover cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-h-[400px]">
          <div className="flex flex-1 overflow-hidden md:flex-row flex-col">
            {/* Settings Navigation Sidebar */}
            <div className="w-full md:w-[200px] border-r border-border overflow-y-auto bg-surface md:max-h-full max-h-[200px]">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={twMerge(
                    'p-3 cursor-pointer border-b border-border transition-colors whitespace-nowrap overflow-hidden text-ellipsis h-11 flex items-center',
                    activeSection === section.id
                      ? 'bg-primary text-button-text font-bold'
                      : 'hover:bg-surface-hover'
                  )}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </div>
              ))}
            </div>

            {/* Settings Content Area */}
            <div className="flex-1 overflow-y-hidden relative">
              {/* Theme Settings */}
              {activeSection === 'theme' && (
                <div className="absolute inset-0 flex flex-col overflow-hidden">
                  <h3 className="sticky top-0 bg-surface p-3 m-0 border-b border-border z-10 font-bold h-11 flex items-center">
                    Theme
                  </h3>
                  <div className="p-4 overflow-y-auto flex-1">
                    <div className="flex mb-2 items-center md:flex-row flex-col md:items-center items-start">
                      <label className="flex-1 mr-4 md:mb-0 mb-1">Theme</label>
                      <div className="flex-2 flex items-center md:w-auto w-full">
                        <select
                          name="theme"
                          value={localSettings.theme}
                          onChange={handleChange}
                          className="w-full max-w-[300px] p-2 border border-border rounded bg-input-background text-text"
                        >
                          <option value={THEMES.LIGHT}>Light</option>
                          <option value={THEMES.DARK}>Dark</option>
                          <option value={THEMES.CYBERPUNK}>Cyberpunk</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex mb-2 items-center md:flex-row flex-col md:items-center items-start">
                      <label className="flex-1 mr-4 md:mb-0 mb-1">Turbo Mode</label>
                      <div className="flex-2 flex items-center md:w-auto w-full">
                        <input
                          type="checkbox"
                          name="turboMode"
                          checked={localSettings.turboMode}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="ml-2 text-sm text-text opacity-80">Enable</span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-text opacity-80 max-w-[500px]">
                      <p>
                        Turbo Mode adds visual effects that may impact performance on older devices.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Font Settings */}
              {activeSection === 'font' && (
                <div className="absolute inset-0 flex flex-col overflow-hidden">
                  <h3 className="sticky top-0 bg-surface p-3 m-0 border-b border-border z-10 font-bold h-11 flex items-center">
                    Font
                  </h3>
                  <div className="p-4 overflow-y-auto flex-1">
                    <div className="flex mb-2 items-center md:flex-row flex-col md:items-center items-start">
                      <label className="flex-1 mr-4 md:mb-0 mb-1">Font Family</label>
                      <div className="flex-2 flex items-center md:w-auto w-full">
                        <select
                          name="fontFamily"
                          value={localSettings.fontFamily}
                          onChange={handleChange}
                          className="w-full max-w-[300px] p-2 border border-border rounded bg-input-background text-text"
                        >
                          {fontOptions.map((font, index) => (
                            <option key={index} value={font}>
                              {font.split(',')[0].replace(/["']/g, '')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex mb-2 items-center md:flex-row flex-col md:items-center items-start">
                      <label className="flex-1 mr-4 md:mb-0 mb-1">Font Size</label>
                      <div className="flex-2 flex items-center md:w-auto w-full">
                        <input
                          type="number"
                          name="fontSize"
                          min="8"
                          max="32"
                          value={localSettings.fontSize}
                          onChange={handleChange}
                          className="w-full max-w-[300px] p-2 border border-border rounded bg-input-background text-text"
                        />
                      </div>
                    </div>
                    <div className="flex mb-2 items-center md:flex-row flex-col md:items-center items-start">
                      <label className="flex-1 mr-4 md:mb-0 mb-1">Word Wrap</label>
                      <div className="flex-2 flex items-center md:w-auto w-full">
                        <input
                          type="checkbox"
                          name="wordWrap"
                          checked={localSettings.wordWrap}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                        <span className="ml-2 text-sm text-text opacity-80">
                          Enable word wrap in text areas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto Update Settings */}
              {activeSection === 'updates' && (
                <div className="absolute inset-0 flex flex-col overflow-hidden">
                  <h3 className="sticky top-0 bg-surface p-3 m-0 border-b border-border z-10 font-bold h-11 flex items-center">
                    Updates
                  </h3>
                  <div className="p-4 overflow-y-auto flex-1">
                    <div className="flex mb-2 items-center md:flex-row flex-col md:items-center items-start">
                      <label className="flex-1 mr-4 md:mb-0 mb-1">Enable Auto Update</label>
                      <div className="flex-2 flex items-center md:w-auto w-full">
                        <input
                          type="checkbox"
                          name="autoUpdate"
                          checked={localSettings.autoUpdate}
                          onChange={handleChange}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                    <div className="flex mb-2 items-center md:flex-row flex-col md:items-center items-start">
                      <label className="flex-1 mr-4 md:mb-0 mb-1">
                        Check for Updates on Startup
                      </label>
                      <div className="flex-2 flex items-center md:w-auto w-full">
                        <input
                          type="checkbox"
                          name="checkForUpdatesOnStartup"
                          checked={localSettings.checkForUpdatesOnStartup}
                          onChange={handleChange}
                          disabled={!localSettings.autoUpdate}
                          className="w-4 h-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transformations Settings */}
              {activeSection === 'transformations' && (
                <div className="absolute inset-0 flex flex-col overflow-hidden">
                  <h3 className="sticky top-0 bg-surface p-3 m-0 border-b border-border z-10 font-bold h-11 flex items-center">
                    Transformations
                  </h3>
                  <div className="p-4 overflow-y-auto flex-1">
                    <div className="flex mb-2 items-center md:flex-row flex-col md:items-center items-start">
                      <label className="flex-1 mr-4 md:mb-0 mb-1">
                        Bcrypt Rounds (Cost Factor)
                      </label>
                      <div className="flex-2 flex items-center md:w-auto w-full">
                        <input
                          type="number"
                          name="bcryptRounds"
                          min="1"
                          max="20"
                          value={localSettings.bcryptRounds}
                          onChange={handleChange}
                          className="w-full max-w-[300px] p-2 border border-border rounded bg-input-background text-text"
                        />
                        <span className="ml-2 text-sm text-text opacity-80">
                          Default: 12 (recommended)
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-text opacity-80 max-w-[500px]">
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

        <div className="flex justify-end gap-2 p-4 border-t border-border bg-surface mt-auto">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsTailwind
