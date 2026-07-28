import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { setupPersistence } from './electronStorage'

export interface HomePageState {
  searchQuery: string
  scrollPosition: number
  layoutVersion: number
}

const CURRENT_LAYOUT_VERSION = 2

const defaultHomePageState = (): HomePageState => ({
  searchQuery: '',
  scrollPosition: 0,
  layoutVersion: CURRENT_LAYOUT_VERSION
})

export const useHomePageStore = defineStore('homePage', () => {
  const homePage = reactive<HomePageState>(defaultHomePageState())

  const setHomePageSearchQuery = (searchQuery: string): void => {
    homePage.searchQuery = searchQuery
  }
  const setHomePageScrollPosition = (scrollPosition: number): void => {
    homePage.scrollPosition = scrollPosition
  }
  const resetHomePageState = (): void => {
    Object.assign(homePage, defaultHomePageState())
  }

  const { persist } = setupPersistence(
    {
      key: 'homePage',
      serialize: () => ({ homePage: { ...homePage } }),
      hydrate: (data: { homePage?: Partial<HomePageState> } | Partial<HomePageState>) => {
        const incoming: Partial<HomePageState> =
          (data as { homePage?: Partial<HomePageState> }).homePage ??
          (data as Partial<HomePageState>)
        if (incoming && typeof incoming === 'object') {
          Object.assign(homePage, defaultHomePageState(), incoming)
          if (incoming.layoutVersion !== CURRENT_LAYOUT_VERSION) {
            homePage.scrollPosition = 0
          }
          homePage.layoutVersion = CURRENT_LAYOUT_VERSION
        }
      }
    },
    (notify) => {
      watch(homePage, () => notify(), { deep: true })
    }
  )

  return {
    homePage,
    setHomePageSearchQuery,
    setHomePageScrollPosition,
    resetHomePageState,
    persist
  }
})
