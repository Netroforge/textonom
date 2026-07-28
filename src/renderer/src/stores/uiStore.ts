import { defineStore } from 'pinia'
import { reactive } from 'vue'

export interface UIState {
  showSettings: boolean
  showAbout: boolean
  showUpdateNotification: boolean
  showShortcuts: boolean
  showHistory: boolean
}

export const useUIStore = defineStore('ui', () => {
  const ui = reactive<UIState>({
    showSettings: false,
    showAbout: false,
    showUpdateNotification: false,
    showShortcuts: false,
    showHistory: false
  })

  const setShowSettings = (show: boolean): void => {
    ui.showSettings = show
  }
  const setShowAbout = (show: boolean): void => {
    ui.showAbout = show
  }
  const setShowUpdateNotification = (show: boolean): void => {
    ui.showUpdateNotification = show
  }
  const setShowShortcuts = (show: boolean): void => {
    ui.showShortcuts = show
  }
  const setShowHistory = (show: boolean): void => {
    ui.showHistory = show
  }

  return {
    ui,
    setShowSettings,
    setShowAbout,
    setShowUpdateNotification,
    setShowShortcuts,
    setShowHistory
  }
})
