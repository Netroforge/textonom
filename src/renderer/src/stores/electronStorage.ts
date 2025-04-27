// Custom storage adapter for Zustand's persist middleware
// This adapter uses the Electron API to save and load state from separate files

import { StateStorage } from 'zustand/middleware'

// Create a custom storage adapter for Electron
export const createElectronStorage = (storeName: string): StateStorage => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem: async (_name: string): Promise<string | null> => {
    try {
      // Use the Electron API to load the state from disk
      const result = await window.api.loadState({ key: storeName })

      if (result.success && result.state) {
        return result.state
      }

      return null
    } catch (error) {
      console.error(`[electronStorage] Failed to load state for ${storeName}:`, error)
      return null
    }
  },

  setItem: async (_name: string, value: string): Promise<void> => {
    try {
      // Use the Electron API to save the state to disk
      const result = await window.api.saveState({
        key: storeName,
        state: value
      })

      if (!result.success) {
        console.error(`[electronStorage] Failed to save state for ${storeName}:`, result.error)
      }
    } catch (error) {
      console.error(`[electronStorage] Failed to save state for ${storeName}:`, error)
    }
  },

  removeItem: async (name: string): Promise<void> => {
    // This method is not implemented as we don't need to remove state files
    console.warn(`removeItem called for ${name}, but not implemented`)
  }
})
