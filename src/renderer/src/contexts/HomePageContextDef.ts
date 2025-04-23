import { createContext } from 'react'

// Context interface
export interface HomePageContextType {
  scrollPosition: number
  searchQuery: string
  setScrollPosition: (position: number) => void
  setSearchQuery: (query: string) => void
  resetState: () => void
}

// Create context
export const HomePageContext = createContext<HomePageContextType | undefined>(undefined)
