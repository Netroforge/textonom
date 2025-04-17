import { defineStore } from 'pinia'
import { ref } from 'vue'

// Load tabs from localStorage if available
const loadTabs = () => {
  const savedTabs = localStorage.getItem('textonom-tabs')
  if (savedTabs) {
    try {
      const parsedTabs = JSON.parse(savedTabs)

      // Initialize savedContent for existing tabs if it doesn't exist
      if (parsedTabs.tabs) {
        parsedTabs.tabs.forEach(tab => {
          if (!tab.hasOwnProperty('savedContent')) {
            // If tab is not marked as unsaved, set savedContent to current content
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
  return { tabs: [], activeTabId: null }
}

export const useTabsStore = defineStore('tabs', {
  state: () => loadTabs(),

  actions: {
    // Add a new tab
    addTab(tab) {
      const content = tab.content || ''
      const newTab = {
        id: Date.now().toString(),
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
    closeTab(tabId) {
      const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId)
      if (tabIndex === -1) return

      this.tabs.splice(tabIndex, 1)

      // Set new active tab if the closed tab was active
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

    // Set the active tab
    setActiveTab(tabId) {
      this.activeTabId = tabId
      this.saveTabs()
    },

    // Update tab content
    updateTabContent(tabId, content, saveToLocalStorage = true) {
      console.log('Updating tab content:', { tabId, contentLength: content?.length, saveToLocalStorage })

      // Find the tab index
      const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId)

      if (tabIndex !== -1) {
        console.log('Found tab to update at index:', tabIndex)

        const currentTab = this.tabs[tabIndex]

        // Ensure savedContent is initialized
        if (currentTab.savedContent === undefined) {
          currentTab.savedContent = currentTab.isUnsaved ? null : currentTab.content
        }

        // Check if content has changed from saved content
        const hasChanged = currentTab.savedContent === null || content !== currentTab.savedContent
        console.log('Content changed check:', {
          hasChanged,
          savedContentExists: currentTab.savedContent !== null,
          contentLength: content?.length,
          savedContentLength: currentTab.savedContent?.length,
          contentMatchesSaved: content === currentTab.savedContent
        })

        // Create a new tab object with updated content
        const updatedTab = {
          ...currentTab,
          content,
          isUnsaved: hasChanged
        }

        // Replace the tab in the array
        this.tabs.splice(tabIndex, 1, updatedTab)

        console.log('Tab replaced in array, isUnsaved:', hasChanged)

        // Only save to localStorage if explicitly requested
        // This prevents unnecessary updates that can cause cursor position issues
        if (saveToLocalStorage) {
          console.log('Saving tabs to localStorage')
          this.saveTabs()
        }

        console.log('Tab content updated successfully')
      } else {
        console.error('Tab not found for ID:', tabId)
      }
    },

    // Update tab after save
    updateTabAfterSave(tabId, filePath, title) {
      const tab = this.tabs.find((tab) => tab.id === tabId)
      if (tab) {
        console.log('Updating tab after save:', { tabId, filePath, title })
        tab.filePath = filePath
        tab.title = title
        tab.savedContent = tab.content // Store the saved content
        tab.isUnsaved = false
        console.log('Tab updated after save, savedContent set to:', tab.savedContent)
        this.saveTabs()
      }
    },

    // Clear all tabs
    clearTabs() {
      this.tabs = []
      this.activeTabId = null
      this.saveTabs()
    },

    // Save tabs to localStorage
    saveTabs() {
      localStorage.setItem('textonom-tabs', JSON.stringify({
        tabs: this.tabs,
        activeTabId: this.activeTabId
      }))
    }
  },

  getters: {
    // Get active tab
    getActiveTab() {
      return this.tabs.find((tab) => tab.id === this.activeTabId)
    },

    // Check if there are unsaved tabs
    hasUnsavedTabs() {
      return this.tabs.some((tab) => tab.isUnsaved)
    }
  }
})
