import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from 'react'
import { getTransformationById } from '../transformations/registry'
import { useTabsContent } from './TabsContentContext'
import { loadTabsState, saveTabsState } from '../services/persistenceService'

// Tab interface
export interface Tab {
  id: string
  title: string
  transformationId: string
}

// Context interface
interface TabsContextType {
  tabs: Tab[]
  activeTabId: string | null
  showHomePage: boolean
  setShowHomePage: (show: boolean) => void
  addTab: (transformationId: string) => string
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  reorderTabs: (fromIndex: number, toIndex: number) => void
  initializeFromDisk: () => Promise<void>
  saveTabsToDisk: () => Promise<void>
}

// Provider props
interface TabsProviderProps {
  children: ReactNode
}

// Create context
const TabsContext = createContext<TabsContextType | undefined>(undefined)

// Provider component
export const TabsProvider: React.FC<TabsProviderProps> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [showHomePage, setShowHomePage] = useState<boolean>(true)
  const { removeTabContent } = useTabsContent()

  // Initialize tabs from disk
  const initializeFromDisk = async (): Promise<void> => {
    try {
      const loadedState = await loadTabsState()
      if (loadedState) {
        setTabs(loadedState.tabs)
        setActiveTabId(loadedState.activeTabId)
        setShowHomePage(loadedState.showHomePage)
      }
    } catch (error) {
      console.error('Failed to initialize tabs from disk:', error)
    }
  }

  // Save tabs state to disk
  const saveTabsToDisk = useCallback(async (): Promise<void> => {
    try {
      // Create the state object to save (only tabs structure, not content)
      const state = {
        tabs,
        activeTabId,
        showHomePage,
        version: '1.0' // For future compatibility
      }

      // Also save to localStorage for internal use
      try {
        localStorage.setItem(
          'textonom-tabs',
          JSON.stringify({
            tabs,
            activeTabId,
            showHomePage
          })
        )
      } catch (error) {
        console.error('Failed to save tabs to localStorage:', error)
      }

      // Save the state to disk
      await saveTabsState(state)
    } catch (error) {
      console.error('Failed to save tabs to disk:', error)
    }
  }, [tabs, activeTabId, showHomePage])

  // Add a new tab
  const addTab = (transformationId: string): string => {
    // Get transformation metadata
    const transformation = getTransformationById(transformationId)
    if (!transformation) {
      console.error('TabsContext: Transformation not found:', transformationId)
      return ''
    }

    // Check if a tab for this transformation already exists
    const existingTab = tabs.find((tab) => tab.transformationId === transformationId)

    if (existingTab) {
      // If it exists, just activate it
      setActiveTabId(existingTab.id)
      return existingTab.id
    }

    // Create a new tab
    const newTab: Tab = {
      id: crypto.randomUUID().toString(),
      title: transformation.name,
      transformationId: transformationId
    }

    // Add the tab to the list
    setTabs((prevTabs) => [...prevTabs, newTab])

    // Set the new tab as active
    setActiveTabId(newTab.id)

    return newTab.id
  }

  // Close a tab by id
  const closeTab = (tabId: string): void => {
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    if (tabIndex === -1) return

    // Remove tab content
    removeTabContent(tabId)

    // Remove the tab
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId))

    // Set a new active tab if the closed tab was active
    if (activeTabId === tabId) {
      if (tabs.length > 1) {
        // Try to activate the tab to the right, or if not available, the tab to the left
        const newActiveTab = tabs[Math.min(tabIndex, tabs.length - 2)]
        setActiveTabId(newActiveTab.id)
      } else {
        setActiveTabId(null)
        setShowHomePage(true)
      }
    }
  }

  // Set active tab
  const setActiveTab = (tabId: string): void => {
    setActiveTabId(tabId)
    setShowHomePage(false)
  }

  // Reorder tabs (drag and drop)
  const reorderTabs = (fromIndex: number, toIndex: number): void => {
    if (fromIndex === toIndex) return

    setTabs((prevTabs) => {
      const newTabs = [...prevTabs]
      const [movedTab] = newTabs.splice(fromIndex, 1)
      newTabs.splice(toIndex, 0, movedTab)
      return newTabs
    })
  }

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        showHomePage,
        setShowHomePage,
        addTab,
        closeTab,
        setActiveTab,
        reorderTabs,
        initializeFromDisk,
        saveTabsToDisk
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

// Hook for using the tabs context
export const useTabs = (): TabsContextType => {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
