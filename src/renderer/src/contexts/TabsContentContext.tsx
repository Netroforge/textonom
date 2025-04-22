import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { TransformationParamValues } from '../types/transformation'

// Tab content state interface
export interface TabContentState {
  inputText: string
  outputText: string
  paramValues: TransformationParamValues
}

// Context interface
interface TabsContentContextType {
  getTabContent: (tabId: string) => TabContentState
  saveTabContent: (tabId: string, content: TabContentState) => void
  removeTabContent: (tabId: string) => void
  clearAllTabContents: () => void
}

// Provider props
interface TabsContentProviderProps {
  children: ReactNode
}

// Create context
const TabsContentContext = createContext<TabsContentContextType | undefined>(undefined)

// Default tab content
const defaultTabContent: TabContentState = {
  inputText: '',
  outputText: '',
  paramValues: {}
}

// Provider component
export const TabsContentProvider: React.FC<TabsContentProviderProps> = ({ children }) => {
  const [tabContents, setTabContents] = useState<Record<string, TabContentState>>({})

  // Get tab content
  const getTabContent = useCallback(
    (tabId: string): TabContentState => {
      return tabContents[tabId] || { ...defaultTabContent }
    },
    [tabContents]
  )

  // Save tab content
  const saveTabContent = useCallback((tabId: string, content: TabContentState): void => {
    setTabContents((prevContents) => ({
      ...prevContents,
      [tabId]: { ...content }
    }))
  }, [])

  // Remove tab content
  const removeTabContent = useCallback((tabId: string): void => {
    setTabContents((prevContents) => {
      const newContents = { ...prevContents }
      delete newContents[tabId]
      return newContents
    })
  }, [])

  // Clear all tab contents
  const clearAllTabContents = useCallback((): void => {
    setTabContents({})
  }, [])

  return (
    <TabsContentContext.Provider
      value={{
        getTabContent,
        saveTabContent,
        removeTabContent,
        clearAllTabContents
      }}
    >
      {children}
    </TabsContentContext.Provider>
  )
}

// Hook for using the tabs content context
export const useTabsContent = (): TabsContentContextType => {
  const context = useContext(TabsContentContext)
  if (context === undefined) {
    throw new Error('useTabsContent must be used within a TabsContentProvider')
  }
  return context
}
