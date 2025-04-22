import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Window control
  minimizeWindow: (): Promise<boolean> => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: (): Promise<boolean> => ipcRenderer.invoke('window-maximize'),
  closeWindow: (): Promise<boolean> => ipcRenderer.invoke('window-close'),
  isWindowMaximized: (): Promise<boolean> => ipcRenderer.invoke('window-is-maximized'),
  setWindowTitle: (title: string): Promise<boolean> =>
    ipcRenderer.invoke('set-window-title', title),

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
