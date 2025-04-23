import { createContext } from 'react'
import { ThemeType, Settings } from './SettingsContext'

// Context interface
export interface SettingsContextType {
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
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)
