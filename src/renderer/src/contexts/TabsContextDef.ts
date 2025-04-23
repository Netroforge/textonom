import { createContext } from 'react'
import { Tab } from './TabsContext'

// Context interface
export interface TabsContextType {
  tabs: Tab[]
  activeTabId: string | null
  showHomePage: boolean
  setShowHomePage: (show: boolean) => void
  addTab: (transformationId: string) => string
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  reorderTabs: (fromIndex: number, toIndex: number) => void
  initializeFromDisk: () => Promise<void>
  saveTabsToDisk: () => Promise<void>
}

// Create context
export const TabsContext = createContext<TabsContextType | undefined>(undefined)
