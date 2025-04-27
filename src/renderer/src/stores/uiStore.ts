import { create } from 'zustand'

// UI state interface
export interface UIState {
  showSettings: boolean
  showAbout: boolean
  showUpdateNotification: boolean
}

// Default UI state
const defaultUIState: UIState = {
  showSettings: false,
  showAbout: false,
  showUpdateNotification: false
}

// UI store interface
interface UIStoreState {
  // UI state
  ui: UIState

  // UI actions
  setShowSettings: (show: boolean) => void
  setShowAbout: (show: boolean) => void
  setShowUpdateNotification: (show: boolean) => void
}

// Create the UI store
export const useUIStore = create<UIStoreState>()((set) => ({
  // UI state
  ui: defaultUIState,

  // UI actions
  setShowSettings: (showSettings) =>
    set((state) => ({
      ui: { ...state.ui, showSettings }
    })),

  setShowAbout: (showAbout) =>
    set((state) => ({
      ui: { ...state.ui, showAbout }
    })),

  setShowUpdateNotification: (showUpdateNotification) =>
    set((state) => ({
      ui: { ...state.ui, showUpdateNotification }
    }))
}))
