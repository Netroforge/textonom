import React, { useState, useCallback, ReactNode } from 'react'
import { TransformationParamValues } from '../types/transformation'
import { TabsContentContext } from './TabsContentContextDef'

// Tab content state interface
export interface TabContentState {
  inputText: string
  outputText: string
  paramValues: TransformationParamValues
}

// Provider props
interface TabsContentProviderProps {
  children: ReactNode
}

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

// Hook moved to src/renderer/src/hooks/useTabsContent.ts
