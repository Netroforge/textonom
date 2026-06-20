import { ElectronAPI } from '@electron-toolkit/preload'

interface UpdateCheckResult {
  updateAvailable: boolean
  version: string
  releaseNotes?: string
  error?: string
}

interface UpdateInstallResult {
  success: boolean
  isDev?: boolean
}

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

interface API {
  // Window control
  minimizeWindow: () => Promise<boolean>
  maximizeWindow: () => Promise<boolean>
  closeWindow: () => Promise<boolean>
  isWindowMaximized: () => Promise<boolean>
  setWindowTitle: (title: string) => Promise<boolean>
  onWindowStateUpdated: (callback: (windowState: WindowState) => void) => () => void

  // App state persistence (for separate files)
  saveState: (data: { key: string; state: string }) => Promise<{
    success: boolean
    error?: string
  }>
  loadState: (data: { key: string }) => Promise<{
    success: boolean
    state?: string
    error?: string
  }>

  // Auto-update operations
  checkForUpdates: () => Promise<UpdateCheckResult>
  downloadUpdate: () => Promise<void>
  installUpdate: () => Promise<UpdateInstallResult>
  getAppVersion: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
