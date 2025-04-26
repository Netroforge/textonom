import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Window state interface
interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
  isFullScreen: boolean
  displayId?: string // Identifier for the display/monitor
}

// Custom APIs for renderer
const api = {
  // Window control
  minimizeWindow: (): Promise<boolean> => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: (): Promise<boolean> => ipcRenderer.invoke('window-maximize'),
  closeWindow: (): Promise<boolean> => ipcRenderer.invoke('window-close'),
  isWindowMaximized: (): Promise<boolean> => ipcRenderer.invoke('window-is-maximized'),
  setWindowTitle: (title: string): Promise<boolean> =>
    ipcRenderer.invoke('set-window-title', title),
  onWindowStateUpdated: (callback: (windowState: WindowState) => void): (() => void) => {
    const listener = (_: IpcRendererEvent, windowState: WindowState): void => callback(windowState)
    ipcRenderer.on('window-state-updated', listener)
    return () => {
      ipcRenderer.removeListener('window-state-updated', listener)
    }
  },

  // File operations have been removed

  // App state persistence
  saveAppState: (data: {
    state: string
  }): Promise<{
    success: boolean
    error?: string
  }> => ipcRenderer.invoke('save-app-state', data),

  loadAppState: (): Promise<{
    success: boolean
    state?: string
    error?: string
  }> => ipcRenderer.invoke('load-app-state'),

  // Auto-update operations
  checkForUpdates: (): Promise<{
    updateAvailable: boolean
    version: string
    releaseNotes?: string
    error?: string
  }> => ipcRenderer.invoke('check-for-updates'),

  downloadUpdate: (): Promise<void> => ipcRenderer.invoke('download-update'),

  installUpdate: (): Promise<{ success: boolean; isDev?: boolean }> =>
    ipcRenderer.invoke('install-update'),

  getAppVersion: (): Promise<string> => ipcRenderer.invoke('get-app-version')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
