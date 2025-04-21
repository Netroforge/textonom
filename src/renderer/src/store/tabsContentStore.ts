import { defineStore } from 'pinia'
import { TransformationParamValues } from '../types/transformation'

// Tab content state interface
export interface TabContentState {
  inputText: string
  outputText: string
  paramValues: TransformationParamValues
}

// Store state interface
interface TabContentStoreState {
  tabContents: Record<string, TabContentState>
}

export const useTabsContentStore = defineStore('tabsContent', {
  state: (): TabContentStoreState => ({
    tabContents: {}
  }),

  actions: {
    // Save tab content state
    saveTabContent(tabId: string, content: TabContentState): void {
      this.tabContents[tabId] = { ...content }
    },

    // Get tab content state
    getTabContent(tabId: string): TabContentState | undefined {
      return this.tabContents[tabId]
    },

    // Remove tab content state
    removeTabContent(tabId: string): void {
      if (this.tabContents[tabId]) {
        delete this.tabContents[tabId]
      }
    },

    // Clear all tab content states
    clearAllTabContents(): void {
      this.tabContents = {}
    }
  }
})
