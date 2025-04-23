import React, { useState, ReactNode } from 'react'
import { HomePageContext } from './HomePageContextDef'

// Provider props
interface HomePageProviderProps {
  children: ReactNode
}

// Provider component
export const HomePageProvider: React.FC<HomePageProviderProps> = ({ children }) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Reset state
  const resetState = (): void => {
    setScrollPosition(0)
    setSearchQuery('')
  }

  return (
    <HomePageContext.Provider
      value={{
        scrollPosition,
        searchQuery,
        setScrollPosition,
        setSearchQuery,
        resetState
      }}
    >
      {children}
    </HomePageContext.Provider>
  )
}

// Hook moved to src/renderer/src/hooks/useHomePage.ts
