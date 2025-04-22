import { defineStore } from 'pinia'
import { getTransformationById } from '../transformations/registry'
import { useTabsContentStore } from './tabsContentStore'
import { loadTabsState, saveTabsState } from '../services/persistenceService'

// Tab interface
export interface Tab {
  id: string
  title: string
  transformationId: string
}

// State interface
interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
  showHomePage: boolean
}

// Load tabs from disk if available, otherwise start with empty tabs
const loadTabs = async (): Promise<TabsState> => {
  try {
    // Try to load saved tabs state from disk
    const savedState = await loadTabsState()

    if (savedState) {
      return {
        tabs: savedState.tabs,
        activeTabId: savedState.activeTabId,
        showHomePage: savedState.showHomePage !== undefined ? savedState.showHomePage : true
      }
    }
  } catch (error) {
    console.error('Failed to load tabs from disk:', error)
  }

  // If no saved state or error occurred, return empty state
  return {
    tabs: [],
    activeTabId: null,
    showHomePage: true
  }
}

// Initialize with empty state, will be populated after async loading
export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => ({
    tabs: [],
    activeTabId: null,
    showHomePage: true
  }),

  actions: {
    // Initialize tabs from disk
    async initializeFromDisk(): Promise<void> {
      const loadedState = await loadTabs()
      this.tabs = loadedState.tabs
      this.activeTabId = loadedState.activeTabId
      this.showHomePage = loadedState.showHomePage
    },

    // Save tabs state to disk
    async saveTabsToDisk(): Promise<void> {
      // Create the state object to save (only tabs structure, not content)
      const state = {
        tabs: this.tabs,
        activeTabId: this.activeTabId,
        showHomePage: this.showHomePage,
        version: '1.0' // For future compatibility
      }

      // Also save to localStorage for internal use
      try {
        localStorage.setItem(
          'textonom-tabs',
          JSON.stringify({
            tabs: this.tabs,
            activeTabId: this.activeTabId,
            showHomePage: this.showHomePage
          })
        )
      } catch (error) {
        console.error('Failed to save tabs to localStorage:', error)
      }

      // Save the state to disk
      await saveTabsState(state)
    },
    // Add a new tab
    addTab(transformationId: string): string {
      // Create tab first, then save to disk
      // Get transformation metadata
      const transformation = getTransformationById(transformationId)
      if (!transformation) {
        console.error('TabsStore: Transformation not found:', transformationId)
        return ''
      }

      // Check if a tab for this transformation already exists
      const existingTab = this.tabs.find((tab) => tab.transformationId === transformationId)

      if (existingTab) {
        // If it exists, just activate it
        this.activeTabId = existingTab.id
        return existingTab.id
      }

      // Create a new tab
      const newTab: Tab = {
        id: crypto.randomUUID().toString(),
        title: transformation.name,
        transformationId: transformationId
      }
      this.tabs.push(newTab)
      this.activeTabId = newTab.id

      // Save tabs state to disk
      this.saveTabsToDisk().catch((error) => {
        console.error('Failed to save tabs after adding a new tab:', error)
      })

      return newTab.id
    },

    // Close a tab by id
    closeTab(tabId: string): void {
      const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId)
      if (tabIndex === -1) return

      // Remove tab content from the content store
      const tabContentStore = useTabsContentStore()
      tabContentStore.removeTabContent(tabId)

      this.tabs.splice(tabIndex, 1)

      // Set a new active tab if the closed tab was active
      if (this.activeTabId === tabId) {
        if (this.tabs.length > 0) {
          // Try to activate the tab to the right, or if not available, the tab to the left
          this.activeTabId = this.tabs[Math.min(tabIndex, this.tabs.length - 1)]?.id || null
        } else {
          this.activeTabId = null
        }
      }

      // Save tabs state to disk
      this.saveTabsToDisk().catch((error) => {
        console.error('Failed to save tabs after closing a tab:', error)
      })
    },

    // Get an active tab
    getTabById(tabId: string): Tab | undefined {
      return this.tabs.find((tab) => tab.id === tabId)
    },

    // Set the active tab
    setActiveTab(tabId: string): void {
      this.activeTabId = tabId

      // Save tabs state to disk
      this.saveTabsToDisk().catch((error) => {
        console.error('Failed to save tabs after changing active tab:', error)
      })
    },

    // Set home page visibility
    setShowHomePage(show: boolean): void {
      this.showHomePage = show

      // Save tabs state to disk
      this.saveTabsToDisk().catch((error) => {
        console.error('Failed to save tabs after changing home page visibility:', error)
      })
    },

    // Clear all tabs
    clearTabs(): void {
      // Clear all tab content from the content store
      const tabContentStore = useTabsContentStore()
      tabContentStore.clearAllTabContents()

      this.tabs = []
      this.activeTabId = null

      // Save tabs state to disk
      this.saveTabsToDisk().catch((error) => {
        console.error('Failed to save tabs after clearing tabs:', error)
      })
    },

    // Reorder tabs (for drag and drop functionality)
    reorderTabs(fromIndex: number, toIndex: number): void {
      if (
        fromIndex < 0 ||
        fromIndex >= this.tabs.length ||
        toIndex < 0 ||
        toIndex >= this.tabs.length
      ) {
        return
      }

      // Remove the tab from the old position and insert it at the new position
      const [movedTab] = this.tabs.splice(fromIndex, 1)
      this.tabs.splice(toIndex, 0, movedTab)

      // Save tabs state to disk
      this.saveTabsToDisk().catch((error) => {
        console.error('Failed to save tabs after reordering tabs:', error)
      })
    }
  },

  getters: {
    // Get an active tab id
    getActiveTabId(): string | null {
      return this.activeTabId
    },

    // Get an active tab
    getActiveTab(): Tab | undefined {
      return this.tabs.find((tab) => tab.id === this.activeTabId)
    },

    // Check if there is an active tab
    hasActiveTab(): boolean {
      return this.activeTabId !== null
    }
  }
})
