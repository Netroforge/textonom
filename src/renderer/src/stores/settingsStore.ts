import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Settings {
  theme: string
  fontSize: number
  fontFamily: string
  autoUpdate: boolean
  checkForUpdatesOnStartup: boolean
  textGlowEffect: boolean
  crtEffect: boolean
  bcryptRounds: number
}

interface SettingsState {
  settings: Settings
  setTheme: (theme: string) => void
  setFontSize: (size: number) => void
  setFontFamily: (family: string) => void
  setAutoUpdate: (enabled: boolean) => void
  setCheckForUpdatesOnStartup: (enabled: boolean) => void
  setTextGlowEffect: (enabled: boolean) => void
  setCrtEffect: (enabled: boolean) => void
  setBcryptRounds: (rounds: number) => void
}

// Default settings - matching Vue version
const defaultSettings: Settings = {
  theme: 'cyberpunk',
  fontSize: 14,
  fontFamily: "Consolas, 'Courier New', monospace",
  autoUpdate: true,
  checkForUpdatesOnStartup: true,
  textGlowEffect: true,
  crtEffect: true, // This is 'turboMode' in the Vue version
  bcryptRounds: 12
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setTheme: (theme) => set((state) => ({ settings: { ...state.settings, theme } })),
      setFontSize: (fontSize) => set((state) => ({ settings: { ...state.settings, fontSize } })),
      setFontFamily: (fontFamily) =>
        set((state) => ({ settings: { ...state.settings, fontFamily } })),
      setAutoUpdate: (autoUpdate) =>
        set((state) => ({ settings: { ...state.settings, autoUpdate } })),
      setCheckForUpdatesOnStartup: (checkForUpdatesOnStartup) =>
        set((state) => ({ settings: { ...state.settings, checkForUpdatesOnStartup } })),
      setTextGlowEffect: (textGlowEffect) =>
        set((state) => ({ settings: { ...state.settings, textGlowEffect } })),
      setCrtEffect: (crtEffect) => set((state) => ({ settings: { ...state.settings, crtEffect } })),
      setBcryptRounds: (bcryptRounds) =>
        set((state) => ({ settings: { ...state.settings, bcryptRounds } }))
    }),
    {
      name: 'textonom-settings'
    }
  )
)
