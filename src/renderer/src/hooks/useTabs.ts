import { useContext } from 'react'
import { TabsContext, TabsContextType } from '../contexts/TabsContextDef'

// Hook for using the tabs context
export const useTabs = (): TabsContextType => {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
