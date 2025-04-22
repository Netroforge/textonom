// Persistence service for saving and loading application state
import { Tab } from '../contexts/TabsContext'

// Interface for the tabs state that will be saved to disk
export interface SavedTabsState {
  tabs: Tab[]
  activeTabId: string | null
  showHomePage: boolean
  version: string // For future compatibility
}

// Save tabs state to disk
export const saveTabsState = async (state: SavedTabsState): Promise<boolean> => {
  try {
    // Use the Electron API to save the state to disk
    const result = await window.api.saveAppState({
      state: JSON.stringify(state)
    })
    return result.success
  } catch (error) {
    console.error('Failed to save tabs state:', error)
    return false
  }
}

// Load tabs state from disk
export const loadTabsState = async (): Promise<SavedTabsState | null> => {
  try {
    // Use the Electron API to load the state from disk
    const result = await window.api.loadAppState()

    if (result.success && result.state) {
      return JSON.parse(result.state) as SavedTabsState
    }

    return null
  } catch (error) {
    console.error('Failed to load tabs state:', error)
    return null
  }
}
