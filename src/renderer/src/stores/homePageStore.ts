import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface HomePageState {
  searchQuery: string
  scrollPosition: number
  setSearchQuery: (query: string) => void
  setScrollPosition: (position: number) => void
}

export const useHomePageStore = create<HomePageState>()(
  persist(
    (set) => ({
      searchQuery: '',
      scrollPosition: 0,

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setScrollPosition: (scrollPosition) => set({ scrollPosition })
    }),
    {
      name: 'textonom-homepage'
    }
  )
)
