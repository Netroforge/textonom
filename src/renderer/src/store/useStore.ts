import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Browser-compatible UUID generation function
const generateUUID = (): string => {
  // Use browser's crypto.randomUUID if available
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export interface Tab {
  id: string
  title: string
  content: string
  filePath?: string
  isModified: boolean
}

export interface EditorSettings {
  theme: 'light' | 'dark' | 'cyberpunk' | 'cyberpunkTurbo'
  fontFamily: string
  fontSize: number
  tabSize: number
  insertSpaces: boolean
  autoIndent: boolean
  showLineNumbers: boolean
  wordWrap: boolean
  wrapColumn: number
  autoSave: boolean
  autoSaveInterval: number
}

interface AppState {
  tabs: Tab[]
  activeTabId: string | null
  settings: EditorSettings

  // Tab actions
  addTab: (tab: Omit<Tab, 'id' | 'isModified'>) => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTabContent: (id: string, content: string) => void
  setTabFilePath: (id: string, filePath: string) => void
  markTabAsModified: (id: string, isModified: boolean) => void

  // Settings actions
  updateSettings: (settings: Partial<EditorSettings>) => void
}

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'light',
  fontFamily: 'monospace',
  fontSize: 14,
  tabSize: 2,
  insertSpaces: true,
  autoIndent: true,
  showLineNumbers: true,
  wordWrap: true,
  wrapColumn: 80,
  autoSave: false,
  autoSaveInterval: 30000 // 30 seconds
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      tabs: [],
      activeTabId: null,
      settings: DEFAULT_SETTINGS,

      addTab: (tab) => set((state) => {
        const newTab = {
          ...tab,
          id: generateUUID(),
          isModified: false
        }

        return {
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id
        }
      }),

      closeTab: (id) => set((state) => {
        const tabIndex = state.tabs.findIndex((tab) => tab.id === id)
        if (tabIndex === -1) return state

        const newTabs = [...state.tabs]
        newTabs.splice(tabIndex, 1)

        let newActiveTabId = state.activeTabId
        if (state.activeTabId === id) {
          newActiveTabId = newTabs.length > 0
            ? (newTabs[Math.min(tabIndex, newTabs.length - 1)].id)
            : null
        }

        return {
          tabs: newTabs,
          activeTabId: newActiveTabId
        }
      }),

      setActiveTab: (id) => set({ activeTabId: id }),

      updateTabContent: (id, content) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === id ? { ...tab, content, isModified: true } : tab
        )
      })),

      setTabFilePath: (id, filePath) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === id ? { ...tab, filePath, title: filePath.split('/').pop() || 'Untitled' } : tab
        )
      })),

      markTabAsModified: (id, isModified) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === id ? { ...tab, isModified } : tab
        )
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      }))
    }),
    {
      name: 'textonom-storage',
      partialize: (state) => ({ settings: state.settings })
    }
  )
)
