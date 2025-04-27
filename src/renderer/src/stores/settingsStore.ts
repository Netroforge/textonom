import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createElectronStorage } from './electronStorage'

// Settings slice
export interface Settings {
  theme: string
  fontSize: number
  fontFamily: string
  autoUpdate: boolean
  checkForUpdatesOnStartup: boolean
  crtEffect: boolean
  bcryptRounds: number
  wordWrap: boolean
}

// Default settings
const defaultSettings: Settings = {
  theme: 'cyberpunk',
  fontSize: 14,
  fontFamily: "Consolas, 'Courier New', monospace",
  autoUpdate: true,
  checkForUpdatesOnStartup: true,
  crtEffect: true,
  bcryptRounds: 12,
  wordWrap: true
}

// Settings store interface
interface SettingsState {
  // Settings state
  settings: Settings

  // Settings actions
  setTheme: (theme: string) => void
  setFontSize: (size: number) => void
  setFontFamily: (family: string) => void
  setAutoUpdate: (enabled: boolean) => void
  setCheckForUpdatesOnStartup: (enabled: boolean) => void
  setCrtEffect: (enabled: boolean) => void
  setBcryptRounds: (rounds: number) => void
  setWordWrap: (enabled: boolean) => void
  resetSettings: () => void
}

// Create the settings store
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Settings state
      settings: defaultSettings,

      // Settings actions
      setTheme: (theme) => set((state) => ({ settings: { ...state.settings, theme } })),
      setFontSize: (fontSize) => set((state) => ({ settings: { ...state.settings, fontSize } })),
      setFontFamily: (fontFamily) =>
        set((state) => ({ settings: { ...state.settings, fontFamily } })),
      setAutoUpdate: (autoUpdate) =>
        set((state) => ({ settings: { ...state.settings, autoUpdate } })),
      setCheckForUpdatesOnStartup: (checkForUpdatesOnStartup) =>
        set((state) => ({ settings: { ...state.settings, checkForUpdatesOnStartup } })),
      setCrtEffect: (crtEffect) => set((state) => ({ settings: { ...state.settings, crtEffect } })),
      setBcryptRounds: (bcryptRounds) =>
        set((state) => ({ settings: { ...state.settings, bcryptRounds } })),
      setWordWrap: (wordWrap) => set((state) => ({ settings: { ...state.settings, wordWrap } })),
      resetSettings: () => set({ settings: defaultSettings })
    }),
    {
      name: 'textonom-settings',
      storage: createJSONStorage(() => createElectronStorage('settings')),
      version: 1
    }
  )
)
