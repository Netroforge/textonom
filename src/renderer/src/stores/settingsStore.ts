import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { setupPersistence } from './electronStorage'

export interface Settings {
  theme: string
  fontSize: number
  fontFamily: string
  autoUpdate: boolean
  checkForUpdatesOnStartup: boolean
  crtEffect: boolean
  bcryptRounds: number
  wordWrap: boolean
  showTrayIcon: boolean
  minimizeToTray: boolean
}

export const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 14,
  fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', monospace",
  autoUpdate: true,
  checkForUpdatesOnStartup: true,
  crtEffect: false,
  bcryptRounds: 12,
  wordWrap: true,
  showTrayIcon: true,
  minimizeToTray: true
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive<Settings>({ ...defaultSettings })

  const setTheme = (theme: string): void => {
    settings.theme = theme
  }
  const setFontSize = (fontSize: number): void => {
    settings.fontSize = fontSize
  }
  const setFontFamily = (fontFamily: string): void => {
    settings.fontFamily = fontFamily
  }
  const setAutoUpdate = (autoUpdate: boolean): void => {
    settings.autoUpdate = autoUpdate
  }
  const setCheckForUpdatesOnStartup = (checkForUpdatesOnStartup: boolean): void => {
    settings.checkForUpdatesOnStartup = checkForUpdatesOnStartup
  }
  const setCrtEffect = (crtEffect: boolean): void => {
    settings.crtEffect = crtEffect
  }
  const setBcryptRounds = (bcryptRounds: number): void => {
    settings.bcryptRounds = bcryptRounds
  }
  const setWordWrap = (wordWrap: boolean): void => {
    settings.wordWrap = wordWrap
  }
  const setShowTrayIcon = (showTrayIcon: boolean): void => {
    settings.showTrayIcon = showTrayIcon
  }
  const setMinimizeToTray = (minimizeToTray: boolean): void => {
    settings.minimizeToTray = minimizeToTray
  }
  const resetSettings = (): void => {
    Object.assign(settings, defaultSettings)
  }

  const { persist } = setupPersistence(
    {
      key: 'settings',
      serialize: () => ({ settings: { ...settings } }),
      hydrate: (data: { settings?: Partial<Settings> } | Partial<Settings>) => {
        const incoming = (data as { settings?: Partial<Settings> }).settings ?? data
        if (incoming && typeof incoming === 'object') {
          Object.assign(settings, defaultSettings, incoming)
        }
      }
    },
    (notify) => {
      watch(settings, () => notify(), { deep: true })
    }
  )

  return {
    settings,
    setTheme,
    setFontSize,
    setFontFamily,
    setAutoUpdate,
    setCheckForUpdatesOnStartup,
    setCrtEffect,
    setBcryptRounds,
    setWordWrap,
    setShowTrayIcon,
    setMinimizeToTray,
    resetSettings,
    persist
  }
})
