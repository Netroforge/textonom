import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { applyTheme } from '../styles/themes'

// Define available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CYBERPUNK: 'cyberpunk'
} as const

// Theme type
export type ThemeType = (typeof THEMES)[keyof typeof THEMES]

// Settings interface
export interface Settings {
  theme: ThemeType
  turboMode: boolean
  fontSize: number
  fontFamily: string
  autoUpdate: boolean
  checkForUpdatesOnStartup: boolean
  bcryptRounds: number
}

// Default settings
const defaultSettings: Settings = {
  theme: THEMES.CYBERPUNK,
  turboMode: true,
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace',
  autoUpdate: true,
  checkForUpdatesOnStartup: true,
  bcryptRounds: 12
}

// Context interface
interface SettingsContextType {
  settings: Settings
  setTheme: (theme: ThemeType) => void
  setTurboMode: (enabled: boolean) => void
  setFontSize: (fontSize: number | string) => void
  setFontFamily: (fontFamily: string) => void
  setAutoUpdate: (autoUpdate: boolean) => void
  setCheckForUpdatesOnStartup: (checkForUpdatesOnStartup: boolean) => void
  setBcryptRounds: (bcryptRounds: number | string) => void
  resetSettings: () => void
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Provider props
interface SettingsProviderProps {
  children: ReactNode
}

// Load settings from localStorage
const loadSettings = (): Settings => {
  const savedSettings = localStorage.getItem('textonom-settings')
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings) as Settings
    } catch (e) {
      console.error('Failed to parse saved settings:', e)
    }
  }
  return defaultSettings
}

// Provider component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  // Save settings to localStorage
  const saveSettings = (newSettings: Settings): void => {
    localStorage.setItem('textonom-settings', JSON.stringify(newSettings))
    setSettings(newSettings)
  }

  // Update theme
  const setTheme = (theme: ThemeType): void => {
    const newSettings = { ...settings, theme }
    saveSettings(newSettings)
    applyTheme(theme)
  }

  // Update turbo mode
  const setTurboMode = (enabled: boolean): void => {
    const newSettings = { ...settings, turboMode: enabled }
    saveSettings(newSettings)
    applyTheme(settings.theme)
  }

  // Update font size
  const setFontSize = (fontSize: number | string): void => {
    const newSettings = { ...settings, fontSize: Number(fontSize) }
    saveSettings(newSettings)
    document.documentElement.style.setProperty('--fontSize', `${newSettings.fontSize}px`)
  }

  // Update font family
  const setFontFamily = (fontFamily: string): void => {
    const newSettings = { ...settings, fontFamily }
    saveSettings(newSettings)
    document.documentElement.style.setProperty('--fontFamily', fontFamily)
  }

  // Update auto update setting
  const setAutoUpdate = (autoUpdate: boolean): void => {
    const newSettings = { ...settings, autoUpdate }
    saveSettings(newSettings)
  }

  // Update check for updates on startup setting
  const setCheckForUpdatesOnStartup = (checkForUpdatesOnStartup: boolean): void => {
    const newSettings = { ...settings, checkForUpdatesOnStartup }
    saveSettings(newSettings)
  }

  // Update bcrypt rounds setting
  const setBcryptRounds = (bcryptRounds: number | string): void => {
    // Ensure the value is within the allowed range (1-20)
    const rounds = Math.max(1, Math.min(20, Number(bcryptRounds)))
    const newSettings = { ...settings, bcryptRounds: rounds }
    saveSettings(newSettings)
  }

  // Reset settings to defaults
  const resetSettings = (): void => {
    saveSettings(defaultSettings)
    applyTheme(defaultSettings.theme)
  }

  // Apply settings on initial load
  useEffect(() => {
    applyTheme(settings.theme)
    document.documentElement.style.setProperty('--fontSize', `${settings.fontSize}px`)
    document.documentElement.style.setProperty('--fontFamily', settings.fontFamily)
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTheme,
        setTurboMode,
        setFontSize,
        setFontFamily,
        setAutoUpdate,
        setCheckForUpdatesOnStartup,
        setBcryptRounds,
        resetSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

// Hook for using the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
