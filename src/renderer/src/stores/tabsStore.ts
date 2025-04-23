import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTransformationById } from '../transformations/registry'

export interface Tab {
  id: string
  title: string
  transformationId: string
}

interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
  showHomePage: boolean
  setShowHomePage: (show: boolean) => void
  addTab: (transformationId: string) => string
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  reorderTabs: (fromIndex: number, toIndex: number) => void
  saveTabsToDisk: () => Promise<void>
  initializeFromDisk: () => Promise<void>
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,
      showHomePage: true,

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

        // Create a new tab
        const newTab: Tab = {
          id: crypto.randomUUID().toString(),
          title: transformation.name,
          transformationId: transformationId
        }

        // Add the tab to the list and set it as active
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id,
          showHomePage: false
        }))

        return newTab.id
      },

      closeTab: (tabId) => {
        const { tabs, activeTabId } = get()
        const tabIndex = tabs.findIndex((tab) => tab.id === tabId)

        if (tabIndex === -1) return

        // Remove the tab
        const newTabs = tabs.filter((tab) => tab.id !== tabId)

        // Update state based on conditions
        if (activeTabId === tabId) {
          if (newTabs.length > 0) {
            // Determine which tab to activate next
            let nextTabIndex

            // If there's a tab to the right, use it
            if (tabIndex < newTabs.length) {
              nextTabIndex = tabIndex
            }
            // Otherwise use the last tab (which would be the one to the left)
            else {
              nextTabIndex = newTabs.length - 1
            }

            const nextTabId = newTabs[nextTabIndex].id

            set({
              tabs: newTabs,
              activeTabId: nextTabId,
              showHomePage: false
            })
          } else {
            // No tabs left, show home page
            set({
              tabs: newTabs,
              activeTabId: null,
              showHomePage: true
            })
          }
        } else {
          // Just remove the tab, active tab stays the same
          set({ tabs: newTabs })
        }
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
      },

      saveTabsToDisk: async () => {
        try {
          const { tabs, activeTabId, showHomePage } = get()

          // Create the state object to save (only tabs structure, not content)
          const state = {
            tabs,
            activeTabId,
            showHomePage,
            version: '1.0'
          }

          // Save state to disk using the Electron API
          await window.api.saveAppState({ state: JSON.stringify(state) })
          return Promise.resolve()
        } catch (error) {
          console.error('Failed to save tabs to disk:', error)
          return Promise.reject(error)
        }
      },

      initializeFromDisk: async () => {
        try {
          const loadedState = await window.api.loadAppState()
          if (loadedState && loadedState.state) {
            const parsedState = JSON.parse(loadedState.state)
            set({
              tabs: parsedState.tabs || [],
              activeTabId: parsedState.activeTabId || null,
              showHomePage: parsedState.showHomePage !== undefined ? parsedState.showHomePage : true
            })
          }
          return Promise.resolve()
        } catch (error) {
          console.error('Failed to initialize tabs from disk:', error)
          return Promise.reject(error)
        }
      }
    }),
    {
      name: 'textonom-tabs',
      // Only persist these fields to localStorage
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        showHomePage: state.showHomePage
      })
    }
  )
)
