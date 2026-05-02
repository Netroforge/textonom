import { defineStore } from 'pinia'
import { reactive } from 'vue'

export interface UIState {
  showSettings: boolean
  showAbout: boolean
  showUpdateNotification: boolean
}

export const useUIStore = defineStore('ui', () => {
  const ui = reactive<UIState>({
    showSettings: false,
    showAbout: false,
    showUpdateNotification: false
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

  return {
    ui,
    setShowSettings,
    setShowAbout,
    setShowUpdateNotification
  }
})
