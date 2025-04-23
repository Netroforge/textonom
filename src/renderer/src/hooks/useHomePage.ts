import { useContext } from 'react'
import { HomePageContext, HomePageContextType } from '../contexts/HomePageContextDef'

// Hook for using the home page context
export const useHomePage = (): HomePageContextType => {
  const context = useContext(HomePageContext)
  if (context === undefined) {
    throw new Error('useHomePage must be used within a HomePageProvider')
  }
  return context
}
