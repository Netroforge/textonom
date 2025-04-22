import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TransformationParamValues } from '../types/transformation'

export interface TabContent {
  inputText: string
  outputText: string
  paramValues: TransformationParamValues
}

interface TabsContentState {
  tabsContent: Record<string, TabContent>
  getTabContent: (tabId: string) => TabContent
  saveTabContent: (tabId: string, content: TabContent) => void
  removeTabContent: (tabId: string) => void
  clearAllTabsContent: () => void
}

// Default empty tab content
const defaultTabContent: TabContent = {
  inputText: '',
  outputText: '',
  paramValues: {}
}

export const useTabsContentStore = create<TabsContentState>()(
  persist(
    (set, get) => ({
      tabsContent: {},

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
    }),
    {
      name: 'textonom-tabs-content'
    }
  )
)
