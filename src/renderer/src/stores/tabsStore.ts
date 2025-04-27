import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getTransformationById } from '../transformations/registry'
import { createElectronStorage } from './electronStorage'

// Tabs slice
export interface Tab {
  id: string
  title: string
  transformationId: string
}

// Tabs store interface
interface TabsState {
  // Tabs state
  tabs: Tab[]
  activeTabId: string | null
  showHomePage: boolean

  // Tabs actions
  setShowHomePage: (show: boolean) => void
  addTab: (transformationId: string) => string
  closeTab: (tabId: string) => void
  closeOtherTabs: (tabId: string) => void
  closeAllTabs: () => void
  closeTabsToRight: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  reorderTabs: (fromIndex: number, toIndex: number) => void
}

// Create the tabs store
export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      // Tabs state
      tabs: [],
      activeTabId: null,
      showHomePage: true,

      // Tabs actions
      setShowHomePage: (show) => set({ showHomePage: show }),

      addTab: (transformationId) => {
        // Get transformation metadata
        const transformation = getTransformationById(transformationId)
        if (!transformation) {
          console.error('TabsStore: Transformation not found:', transformationId)
          return ''
        }

        const { tabs } = get()

        // Check if a tab for this transformation already exists
        const existingTab = tabs.find((tab) => tab.transformationId === transformationId)

        if (existingTab) {
          // If it exists, just activate it
          set({ activeTabId: existingTab.id, showHomePage: false })
          return existingTab.id
        }

        // Create a new tab with a unique ID
        const newTabId = crypto.randomUUID().toString()
        const newTab: Tab = {
          id: newTabId,
          title: transformation.name,
          transformationId
        }

        // Add the new tab and set it as active
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTabId,
          showHomePage: false
        }))

        return newTabId
      },

      closeTab: (tabId) => {
        const { tabs, activeTabId } = get()

        // Find the tab to close
        const tabToClose = tabs.find((tab) => tab.id === tabId)
        if (!tabToClose) return

        // Find the index of the tab to close
        const tabIndex = tabs.indexOf(tabToClose)

        // Create a new tabs array without the closed tab
        const newTabs = tabs.filter((tab) => tab.id !== tabId)

        // Determine the new active tab
        let newActiveTabId = activeTabId

        // If we're closing the active tab, we need to activate another tab
        if (activeTabId === tabId) {
          // If there are no more tabs, show the home page
          if (newTabs.length === 0) {
            newActiveTabId = null
            set({ tabs: newTabs, activeTabId: newActiveTabId, showHomePage: true })
            return
          }

          // Otherwise, activate the tab to the left (or right if it's the first tab)
          const newIndex = Math.min(tabIndex, newTabs.length - 1)
          newActiveTabId = newTabs[newIndex].id
        }

        // Update the state
        set({ tabs: newTabs, activeTabId: newActiveTabId })
      },

      closeOtherTabs: (tabId) => {
        const { tabs } = get()
        const tabToKeep = tabs.find((tab) => tab.id === tabId)

        if (!tabToKeep) return

        // Keep only the specified tab
        set({
          tabs: [tabToKeep],
          activeTabId: tabId,
          showHomePage: false
        })
      },

      closeAllTabs: () => {
        set({
          tabs: [],
          activeTabId: null,
          showHomePage: true
        })
      },

      closeTabsToRight: (tabId) => {
        const { tabs, activeTabId } = get()

        // Find the index of the reference tab
        const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
        if (tabIndex === -1) return

        // Keep only tabs up to and including the reference tab
        const newTabs = tabs.slice(0, tabIndex + 1)

        // If the active tab was closed, activate the reference tab
        const wasActiveTabClosed = !newTabs.some((tab) => tab.id === activeTabId)
        const newActiveTabId = wasActiveTabClosed ? tabId : activeTabId

        // Update the state
        set({ tabs: newTabs, activeTabId: newActiveTabId })
      },

      setActiveTab: (tabId) => {
        set({ activeTabId: tabId, showHomePage: false })
      },

      reorderTabs: (fromIndex, toIndex) => {
        if (fromIndex === toIndex) return

        set((state) => {
          const newTabs = [...state.tabs]
          const [movedTab] = newTabs.splice(fromIndex, 1)
          newTabs.splice(toIndex, 0, movedTab)
          return { tabs: newTabs }
        })
      }
    }),
    {
      name: 'textonom-tabs',
      storage: createJSONStorage(() => createElectronStorage('tabs')),
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        showHomePage: state.showHomePage
      }),
      version: 1
    }
  )
)
