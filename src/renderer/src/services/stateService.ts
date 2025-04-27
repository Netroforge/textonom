// State service for saving and loading application state
import { Settings } from '../stores/settingsStore'
import { Tab } from '../stores/tabsStore'
import { WindowState } from '../stores/windowStore'
import { HomePageState } from '../stores/homePageStore'

// Interface for the settings state that will be saved to disk
export interface SavedSettingsState {
  settings: Settings
  version: string
}

// Interface for the tabs state that will be saved to disk
export interface SavedTabsState {
  tabs: Tab[]
  activeTabId: string | null
  showHomePage: boolean
  version: string
}

// Interface for the window state that will be saved to disk
export interface SavedWindowState {
  windowState: WindowState
  version: string
}

// Interface for the home page state that will be saved to disk
export interface SavedHomePageState {
  homePage: HomePageState
  version: string
}

// Save settings state to disk
export const saveSettingsState = async (state: SavedSettingsState): Promise<boolean> => {
  try {
    // Use the Electron API to save the state to disk
    const result = await window.api.saveAppState({
      state: JSON.stringify(state)
    })
    return result.success
  } catch (error) {
    console.error('Failed to save settings state:', error)
    return false
  }
}

// Load settings state from disk
export const loadSettingsState = async (): Promise<SavedSettingsState | null> => {
  try {
    // Use the Electron API to load the state from disk
    const result = await window.api.loadAppState()

    if (result.success && result.state) {
      return JSON.parse(result.state) as SavedSettingsState
    }

    return null
  } catch (error) {
    console.error('Failed to load settings state:', error)
    return null
  }
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

// Save window state to disk
export const saveWindowState = async (state: SavedWindowState): Promise<boolean> => {
  try {
    // Use the Electron API to save the state to disk
    const result = await window.api.saveAppState({
      state: JSON.stringify(state)
    })
    return result.success
  } catch (error) {
    console.error('Failed to save window state:', error)
    return false
  }
}

// Load window state from disk
export const loadWindowState = async (): Promise<SavedWindowState | null> => {
  try {
    // Use the Electron API to load the state from disk
    const result = await window.api.loadAppState()

    if (result.success && result.state) {
      return JSON.parse(result.state) as SavedWindowState
    }

    return null
  } catch (error) {
    console.error('Failed to load window state:', error)
    return null
  }
}

// Save home page state to disk
export const saveHomePageState = async (state: SavedHomePageState): Promise<boolean> => {
  try {
    // Use the Electron API to save the state to disk
    const result = await window.api.saveAppState({
      state: JSON.stringify(state)
    })
    return result.success
  } catch (error) {
    console.error('Failed to save home page state:', error)
    return false
  }
}

// Load home page state from disk
export const loadHomePageState = async (): Promise<SavedHomePageState | null> => {
  try {
    // Use the Electron API to load the state from disk
    const result = await window.api.loadAppState()

    if (result.success && result.state) {
      return JSON.parse(result.state) as SavedHomePageState
    }

    return null
  } catch (error) {
    console.error('Failed to load home page state:', error)
    return null
  }
}
