import { createContext } from 'react'
import { TabContentState } from './TabsContentContext'

// Context interface
export interface TabsContentContextType {
  getTabContent: (tabId: string) => TabContentState
  saveTabContent: (tabId: string, content: TabContentState) => void
  removeTabContent: (tabId: string) => void
  clearAllTabContents: () => void
}

// Create context
export const TabsContentContext = createContext<TabsContentContextType | undefined>(undefined)
