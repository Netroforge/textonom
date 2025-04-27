import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createElectronStorage } from './electronStorage'

// HomePage state interface
export interface HomePageState {
  searchQuery: string
  scrollPosition: number
}

// Default home page state
const defaultHomePageState: HomePageState = {
  searchQuery: '',
  scrollPosition: 0
}

// HomePage store interface
interface HomePageStoreState {
  // HomePage state
  homePage: HomePageState

  // HomePage actions
  setHomePageSearchQuery: (query: string) => void
  setHomePageScrollPosition: (position: number) => void
  resetHomePageState: () => void
}

// Create the home page store
export const useHomePageStore = create<HomePageStoreState>()(
  persist(
    (set) => ({
      // HomePage state
      homePage: defaultHomePageState,

      // HomePage actions
      setHomePageSearchQuery: (searchQuery) =>
        set((state) => ({
          homePage: { ...state.homePage, searchQuery }
        })),

      setHomePageScrollPosition: (scrollPosition) =>
        set((state) => ({
          homePage: { ...state.homePage, scrollPosition }
        })),

      resetHomePageState: () => set({ homePage: defaultHomePageState })
    }),
    {
      name: 'textonom-home-page',
      storage: createJSONStorage(() => createElectronStorage('homePage')),
      version: 1
    }
  )
)
