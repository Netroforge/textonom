import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTransformationById } from '../transformations/registry'
import { TransformationParamValues } from '../types/transformation'

// Window state slice
export interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
  isFullScreen: boolean
  displayId?: string // Identifier for the display/monitor
}

// Settings slice
export interface Settings {
  theme: string
  fontSize: number
  fontFamily: string
  autoUpdate: boolean
  checkForUpdatesOnStartup: boolean
  crtEffect: boolean
  bcryptRounds: number
  wordWrap: boolean
}

// Default settings
const defaultSettings: Settings = {
  theme: 'cyberpunk',
  fontSize: 14,
  fontFamily: "Consolas, 'Courier New', monospace",
  autoUpdate: true,
  checkForUpdatesOnStartup: true,
  crtEffect: true,
  bcryptRounds: 12,
  wordWrap: true
}

// Tabs slice
export interface Tab {
  id: string
  title: string
  transformationId: string
}

// Tab content slice
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

// HomePage slice
export interface HomePageState {
  searchQuery: string
  scrollPosition: number
}

// UI state slice
export interface UIState {
  showSettings: boolean
  showAbout: boolean
  showUpdateNotification: boolean
}

// App state interface
interface AppState {
  // Settings slice
  settings: Settings
  setTheme: (theme: string) => void
  setFontSize: (size: number) => void
  setFontFamily: (family: string) => void
  setAutoUpdate: (enabled: boolean) => void
  setCheckForUpdatesOnStartup: (enabled: boolean) => void
  setCrtEffect: (enabled: boolean) => void
  setBcryptRounds: (rounds: number) => void
  setWordWrap: (enabled: boolean) => void

  // Window state slice
  windowState: WindowState | null

  // Tabs slice
  tabs: Tab[]
  activeTabId: string | null
  showHomePage: boolean
  setShowHomePage: (show: boolean) => void
  addTab: (transformationId: string) => string
  closeTab: (tabId: string) => void
  closeOtherTabs: (tabId: string) => void
  closeAllTabs: () => void
  closeTabsToRight: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  reorderTabs: (fromIndex: number, toIndex: number) => void

  // Tab content slice
  tabsContent: Record<string, TabContent>
  getTabContent: (tabId: string) => TabContent
  saveTabContent: (tabId: string, content: TabContent) => void
  removeTabContent: (tabId: string) => void
  clearAllTabsContent: () => void

  // HomePage slice
  homePage: HomePageState
  setHomePageSearchQuery: (query: string) => void
  setHomePageScrollPosition: (position: number) => void

  // UI state slice
  ui: UIState
  setShowSettings: (show: boolean) => void
  setShowAbout: (show: boolean) => void
  setShowUpdateNotification: (show: boolean) => void

  // Persistence methods
  saveAppStateToDisk: () => Promise<void>
  initializeFromDisk: () => Promise<void>
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Settings slice
      settings: defaultSettings,
      setTheme: (theme) => set((state) => ({ settings: { ...state.settings, theme } })),
      setFontSize: (fontSize) => set((state) => ({ settings: { ...state.settings, fontSize } })),
      setFontFamily: (fontFamily) =>
        set((state) => ({ settings: { ...state.settings, fontFamily } })),
      setAutoUpdate: (autoUpdate) =>
        set((state) => ({ settings: { ...state.settings, autoUpdate } })),
      setCheckForUpdatesOnStartup: (checkForUpdatesOnStartup) =>
        set((state) => ({ settings: { ...state.settings, checkForUpdatesOnStartup } })),
      setCrtEffect: (crtEffect) => set((state) => ({ settings: { ...state.settings, crtEffect } })),
      setBcryptRounds: (bcryptRounds) =>
        set((state) => ({ settings: { ...state.settings, bcryptRounds } })),
      setWordWrap: (wordWrap) => set((state) => ({ settings: { ...state.settings, wordWrap } })),

      // Window state slice
      windowState: null,

      // Tabs slice
      tabs: [],
      activeTabId: null,
      showHomePage: true,
      setShowHomePage: (show) => set({ showHomePage: show }),
      addTab: (transformationId) => {
        // Get transformation metadata
        const transformation = getTransformationById(transformationId)
        if (!transformation) {
          console.error('AppStore: Transformation not found:', transformationId)
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
        const { tabs, activeTabId, removeTabContent } = get()
        const tabIndex = tabs.findIndex((tab) => tab.id === tabId)

        if (tabIndex === -1) return

        // Remove the tab content
        removeTabContent(tabId)

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
      closeOtherTabs: (tabId) => {
        const { tabs, tabsContent } = get()
        const tabToKeep = tabs.find((tab) => tab.id === tabId)

        if (!tabToKeep) return

        // Keep only the specified tab's content
        const newTabsContent: Record<string, TabContent> = {}
        if (tabsContent[tabId]) {
          newTabsContent[tabId] = tabsContent[tabId]
        }

        // Keep only the specified tab
        set({
          tabs: [tabToKeep],
          activeTabId: tabId,
          showHomePage: false,
          tabsContent: newTabsContent
        })
      },
      closeAllTabs: () => {
        const { clearAllTabsContent } = get()
        clearAllTabsContent()

        set({
          tabs: [],
          activeTabId: null,
          showHomePage: true
        })
      },
      closeTabsToRight: (tabId) => {
        const { tabs, activeTabId, tabsContent } = get()
        const tabIndex = tabs.findIndex((tab) => tab.id === tabId)

        if (tabIndex === -1) return

        // Keep tabs up to and including the specified tab
        const newTabs = tabs.slice(0, tabIndex + 1)

        // Keep only the content for the remaining tabs
        const newTabsContent: Record<string, TabContent> = {}
        newTabs.forEach((tab) => {
          if (tabsContent[tab.id]) {
            newTabsContent[tab.id] = tabsContent[tab.id]
          }
        })

        // If the active tab was closed, activate the specified tab
        const wasActiveTabClosed = !newTabs.some((tab) => tab.id === activeTabId)

        set({
          tabs: newTabs,
          activeTabId: wasActiveTabClosed ? tabId : activeTabId,
          tabsContent: newTabsContent
        })
      },

      // Tab content slice
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
      },

      // HomePage slice
      homePage: {
        searchQuery: '',
        scrollPosition: 0
      },
      setHomePageSearchQuery: (searchQuery) =>
        set((state) => ({
          homePage: { ...state.homePage, searchQuery }
        })),
      setHomePageScrollPosition: (scrollPosition) =>
        set((state) => ({
          homePage: { ...state.homePage, scrollPosition }
        })),

      // UI state slice
      ui: {
        showSettings: false,
        showAbout: false,
        showUpdateNotification: false
      },
      setShowSettings: (showSettings) =>
        set((state) => ({
          ui: { ...state.ui, showSettings }
        })),
      setShowAbout: (showAbout) =>
        set((state) => ({
          ui: { ...state.ui, showAbout }
        })),
      setShowUpdateNotification: (showUpdateNotification) =>
        set((state) => ({
          ui: { ...state.ui, showUpdateNotification }
        })),

      // Persistence methods
      saveAppStateToDisk: async () => {
        try {
          const { tabs, activeTabId, showHomePage, settings, homePage, windowState } = get()

          // Create the state object to save
          const state = {
            tabs,
            activeTabId,
            showHomePage,
            settings,
            homePage,
            windowState,
            version: '1.0'
          }

          // Save state to disk using the Electron API
          await window.api.saveAppState({ state: JSON.stringify(state) })
          return Promise.resolve()
        } catch (error) {
          console.error('Failed to save app state to disk:', error)
          return Promise.reject(error)
        }
      },
      initializeFromDisk: async () => {
        try {
          const loadedState = await window.api.loadAppState()
          if (loadedState && loadedState.state) {
            const parsedState = JSON.parse(loadedState.state)

            // Update the store with the loaded state
            set({
              tabs: parsedState.tabs || [],
              activeTabId: parsedState.activeTabId || null,
              showHomePage:
                parsedState.showHomePage !== undefined ? parsedState.showHomePage : true,
              settings: parsedState.settings || defaultSettings,
              homePage: parsedState.homePage || { searchQuery: '', scrollPosition: 0 },
              windowState: parsedState.windowState || null
            })
          }
          return Promise.resolve()
        } catch (error) {
          console.error('Failed to initialize app state from disk:', error)
          return Promise.reject(error)
        }
      }
    }),
    {
      name: 'textonom-app-state',
      // Only persist these fields to localStorage
      partialize: (state) => ({
        settings: state.settings,
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        showHomePage: state.showHomePage,
        homePage: state.homePage,
        windowState: state.windowState
      })
    }
  )
)
