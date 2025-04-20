import { defineStore } from 'pinia'

interface Tab {
  id: string
  title: string
  content: string
  savedContent: string | null
  filePath: string | null
  isUnsaved: boolean
}

interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
}

interface TabInput {
  title?: string
  content?: string
  filePath?: string | null
  isUnsaved?: boolean
}

// Load tabs from localStorage if available
const loadTabs = (): TabsState => {
  const savedTabs = localStorage.getItem('textonom-tabs')
  if (savedTabs) {
    try {
      const parsedTabs = JSON.parse(savedTabs) as TabsState

      // Initialize savedContent for existing tabs if it doesn't exist
      if (parsedTabs.tabs) {
        parsedTabs.tabs.forEach((tab) => {
          if (!Object.prototype.hasOwnProperty.call(tab, 'savedContent')) {
            // If the tab is not marked as unsaved, a set savedContent to current content
            // Otherwise, set it to null
            tab.savedContent = tab.isUnsaved ? null : tab.content
          }
        })
      }

      return parsedTabs
    } catch (e) {
      console.error('Failed to parse saved tabs:', e)
    }
  }

  return {
    tabs: [],
    activeTabId: null
  }
}

export const useTabsStore = defineStore('tabs', {
  state: (): TabsState => loadTabs(),

  actions: {
    // Add a new tab
    addTab(tab: TabInput): string {
      const content = tab.content || ''
      const newTab: Tab = {
        id: crypto.randomUUID().toString(),
        title: tab.title || 'Untitled',
        content: content,
        savedContent: tab.isUnsaved ? null : content, // Track saved content
        filePath: tab.filePath || null,
        isUnsaved: tab.isUnsaved !== undefined ? tab.isUnsaved : true
      }

      this.tabs.push(newTab)
      this.activeTabId = newTab.id
      this.saveTabs()

      return newTab.id
    },

    // Close a tab by id
    closeTab(tabId: string): void {
      const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId)
      if (tabIndex === -1) return

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

      this.saveTabs()
    },

    // Get an active tab
    getTabById(tabId: string): Tab | undefined {
      return this.tabs.find((tab) => tab.id === tabId)
    },

    // Set the active tab
    setActiveTab(tabId: string): void {
      this.activeTabId = tabId
      this.saveTabs()
    },

    // Update tab content
    updateTabContent(tabId: string, content: string, saveToLocalStorage = true): void {
      // Find the tab index
      const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId)

      if (tabIndex !== -1) {
        const currentTab = this.tabs[tabIndex]

        // Ensure savedContent is initialized
        if (currentTab.savedContent === undefined) {
          currentTab.savedContent = currentTab.isUnsaved ? null : currentTab.content
        }

        // Check if content has changed from saved content
        const hasChanged = currentTab.savedContent === null || content !== currentTab.savedContent

        // Only update if content has actually changed to prevent recursive updates
        if (currentTab.content !== content || currentTab.isUnsaved !== hasChanged) {
          // Create a new tab object with updated content
          const updatedTab: Tab = {
            ...currentTab,
            content,
            isUnsaved: hasChanged
          }

          // Replace the tab in the array
          this.tabs.splice(tabIndex, 1, updatedTab)

          // Only save to localStorage if explicitly requested
          // This prevents unnecessary updates that can cause cursor position issues
          if (saveToLocalStorage) {
            this.saveTabs()
          }
        }
      } else {
        console.error('Tab not found for ID:', tabId)
      }
    },

    // Update tab after save
    updateTabAfterSave(tabId: string, filePath: string, title: string): void {
      const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId)
      if (tabIndex !== -1) {
        const currentTab = this.tabs[tabIndex]

        // Check if anything has actually changed to prevent recursive updates
        if (
          currentTab.filePath !== filePath ||
          currentTab.title !== title ||
          currentTab.savedContent !== currentTab.content ||
          currentTab.isUnsaved !== false
        ) {
          // Create a new tab object with updated properties
          const updatedTab: Tab = {
            ...currentTab,
            filePath,
            title,
            savedContent: currentTab.content, // Store the saved content
            isUnsaved: false
          }

          // Replace the tab in the array
          this.tabs.splice(tabIndex, 1, updatedTab)

          this.saveTabs()
        }
      }
    },

    // Clear all tabs
    clearTabs(): void {
      this.tabs = []
      this.activeTabId = null
      this.saveTabs()
    },

    // Save tabs to localStorage
    saveTabs(): void {
      localStorage.setItem(
        'textonom-tabs',
        JSON.stringify({
          tabs: this.tabs,
          activeTabId: this.activeTabId
        })
      )
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

    // Check if there are unsaved tabs
    hasUnsavedTabs(): boolean {
      return this.tabs.some((tab) => tab.isUnsaved)
    }
  }
})
