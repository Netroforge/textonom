// Type definitions for the application

// API exposed from preload
export interface ElectronAPI {
  // Window control
  minimizeWindow: () => Promise<boolean>
  maximizeWindow: () => Promise<boolean>
  closeWindow: () => Promise<boolean>
  isWindowMaximized: () => Promise<boolean>
  setWindowTitle: (title: string) => Promise<boolean>

  // File operations have been removed

  // App state persistence
  saveAppState: (data: { state: string }) => Promise<{
    success: boolean
    error?: string
  }>
  loadAppState: () => Promise<{
    success: boolean
    state?: string
    error?: string
  }>

  // Auto-update operations
  checkForUpdates: () => Promise<{
    updateAvailable: boolean
    version: string
    releaseNotes?: string
    error?: string
  }>
  downloadUpdate: () => Promise<void>
  installUpdate: () => Promise<{ success: boolean; isDev?: boolean }>
  getAppVersion: () => Promise<string>
}

// Theme definitions
export type ThemeType = 'light' | 'dark' | 'cyberpunk'

// Settings interface
export interface Settings {
  theme: ThemeType
  turboMode: boolean
  fontSize: number
  fontFamily: string
  autoUpdate: boolean
  checkForUpdatesOnStartup: boolean
  bcryptRounds: number
}

// Tab interface
export interface Tab {
  id: string
  name: string
  content: string
  filePath: string | null
  isDirty: boolean
  language: string
}

// Transformation function type
export type TransformationFunction = (text: string, ...args: unknown[]) => Promise<string>

// Transformation interface
export interface Transformation {
  name: string
  description: string
  category: string
  fn: TransformationFunction
  parameters?: {
    name: string
    type: string
    description: string
    default?: never
  }[]
}

// Hotkey interface
export interface Hotkey {
  id: string
  name: string
  description: string
  keys: string[]
  action: () => void
}

// Declare global window interface
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, listener: (...args: unknown[]) => void) => void
        off: (channel: string, listener: (...args: unknown[]) => void) => void
        send: (channel: string, ...args: unknown[]) => void
      }
      process: {
        versions: Record<string, string>
      }
    }
    api: ElectronAPI
  }
}
