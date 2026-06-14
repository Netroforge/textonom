// Configuration Export/Import System

import { getCustomTransformations } from './custom'
import { useSettingsStore } from '../stores/settingsStore'
import { useTabsStore } from '../stores/tabsStore'
import { useHomePageStore } from '../stores/homePageStore'
import { useWindowStore } from '../stores/windowStore'
import { useUIStore } from '../stores/uiStore'

export interface ExportedConfig {
  version: string
  exportedAt: string
  settings: Record<string, unknown>
  tabs: Record<string, unknown>
  homePage: Record<string, unknown>
  window: Record<string, unknown>
  ui: Record<string, unknown>
  customTransformations: ReturnType<typeof getCustomTransformations>
}

export const exportConfiguration = (): ExportedConfig => {
  const settingsStore = useSettingsStore()
  const tabsStore = useTabsStore()
  const homePageStore = useHomePageStore()
  const windowStore = useWindowStore()
  const uiStore = useUIStore()

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings: { ...settingsStore.$state },
    tabs: { ...tabsStore.$state },
    homePage: { ...homePageStore.$state },
    window: { ...windowStore.$state },
    ui: { ...uiStore.$state },
    customTransformations: getCustomTransformations()
  }
}

export const downloadConfiguration = (config: ExportedConfig, filename?: string): void => {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `textonom-config-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importConfiguration = async (
  file: File
): Promise<{ success: boolean; error?: string }> => {
  try {
    const text = await file.text()
    const config = JSON.parse(text) as ExportedConfig

    // Validate config structure
    if (!config.version || !config.exportedAt) {
      return { success: false, error: 'Invalid configuration file format' }
    }

    // Import settings
    const settingsStore = useSettingsStore()
    const tabsStore = useTabsStore()
    const homePageStore = useHomePageStore()
    const windowStore = useWindowStore()
    const uiStore = useUIStore()

    // Apply settings (excluding internal/derived state)
    if (config.settings) {
      Object.assign(settingsStore.$state, config.settings)
    }
    if (config.tabs) {
      Object.assign(tabsStore.$state, config.tabs)
    }
    if (config.homePage) {
      Object.assign(homePageStore.$state, config.homePage)
    }
    if (config.window) {
      Object.assign(windowStore.$state, config.window)
    }
    if (config.ui) {
      Object.assign(uiStore.$state, config.ui)
    }

    // Import custom transformations
    if (config.customTransformations && Array.isArray(config.customTransformations)) {
      const { saveCustomTransformations } = await import('./custom')
      saveCustomTransformations(config.customTransformations)
      const { refreshCustomTransformations } = await import('.')
      refreshCustomTransformations()
    }

    // Persist imported state to disk (uiStore is intentionally ephemeral)
    settingsStore.persist()
    tabsStore.persist()
    homePageStore.persist()
    windowStore.persist()

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Import failed' }
  }
}

export const readConfigFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
