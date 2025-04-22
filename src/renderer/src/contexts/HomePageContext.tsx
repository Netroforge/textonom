import React, { createContext, useContext, useState, ReactNode } from 'react'

// Context interface
interface HomePageContextType {
  scrollPosition: number
  searchQuery: string
  setScrollPosition: (position: number) => void
  setSearchQuery: (query: string) => void
  resetState: () => void
}

// Provider props
interface HomePageProviderProps {
  children: ReactNode
}

// Create context
const HomePageContext = createContext<HomePageContextType | undefined>(undefined)

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

// Hook for using the home page context
export const useHomePage = (): HomePageContextType => {
  const context = useContext(HomePageContext)
  if (context === undefined) {
    throw new Error('useHomePage must be used within a HomePageProvider')
  }
  return context
}
