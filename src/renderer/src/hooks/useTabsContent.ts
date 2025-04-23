import { useContext } from 'react'
import { TabsContentContext, TabsContentContextType } from '../contexts/TabsContentContextDef'

// Hook for using the tabs content context
export const useTabsContent = (): TabsContentContextType => {
  const context = useContext(TabsContentContext)
  if (context === undefined) {
    throw new Error('useTabsContent must be used within a TabsContentProvider')
  }
  return context
}
