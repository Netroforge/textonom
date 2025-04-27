import { create } from 'zustand'
import { TransformationParamValues } from '../types/transformation'

// Tab content interface
export interface TabContent {
  inputText: string
  outputText: string
  paramValues: TransformationParamValues
}

// Default empty tab content
const defaultTabContent: TabContent = {
  inputText: '',
  outputText: '',
  paramValues: {}
}

// Tabs content store interface
interface TabsContentState {
  // Tabs content state
  tabsContent: Record<string, TabContent>

  // Tabs content actions
  getTabContent: (tabId: string) => TabContent
  saveTabContent: (tabId: string, content: TabContent) => void
  removeTabContent: (tabId: string) => void
  clearAllTabsContent: () => void
}

// Create the tabs content store
export const useTabsContentStore = create<TabsContentState>()((set, get) => ({
  // Tabs content state
  tabsContent: {},

  // Tabs content actions
  getTabContent: (tabId) => {
    const { tabsContent } = get()
    return tabsContent[tabId] || { ...defaultTabContent }
  },

  saveTabContent: (tabId, content) => {
    set((state) => ({
      tabsContent: {
        ...state.tabsContent,
        [tabId]: content
      }
    }))
  },

  removeTabContent: (tabId) => {
    set((state) => {
      const newTabsContent = { ...state.tabsContent }
      delete newTabsContent[tabId]
      return { tabsContent: newTabsContent }
    })
  },

  clearAllTabsContent: () => {
    set({ tabsContent: {} })
  }
}))
