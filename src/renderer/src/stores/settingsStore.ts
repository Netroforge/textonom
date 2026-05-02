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
}

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
  const resetSettings = (): void => {
    Object.assign(settings, defaultSettings)
  }

  setupPersistence(
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
    resetSettings
  }
})
