import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createElectronStorage } from './electronStorage'

// Window state slice
export interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
  isFullScreen: boolean
  displayId?: string // Identifier for the display/monitor
}

// Default window state
const defaultWindowState: WindowState = {
  width: 1200,
  height: 800,
  isMaximized: false,
  isFullScreen: false
}

// Window store interface
interface WindowStoreState {
  // Window state
  windowState: WindowState | null

  // Window actions
  setWindowState: (windowState: WindowState) => void
}

// Create the window store
export const useWindowStore = create<WindowStoreState>()(
  persist(
    (set) => ({
      // Window state
      windowState: defaultWindowState,

      // Window actions
      setWindowState: (windowState) => set({ windowState })
    }),
    {
      name: 'textonom-window-state',
      storage: createJSONStorage(() => createElectronStorage('window')),
      version: 1
    }
  )
)
