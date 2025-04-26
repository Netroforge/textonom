import { ElectronAPI } from '@electron-toolkit/preload'

// FileOperationResult interface has been removed

interface AppStateResult {
  success: boolean
  state?: string
  error?: string
}

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

  // File operations have been removed

  // App state persistence
  saveAppState: (data: { state: string }) => Promise<{
    success: boolean
    error?: string
  }>
  loadAppState: () => Promise<AppStateResult>

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
