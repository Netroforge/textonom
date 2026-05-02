import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { setupPersistence } from './electronStorage'

export interface HomePageState {
  searchQuery: string
  scrollPosition: number
}

const defaultHomePageState = (): HomePageState => ({
  searchQuery: '',
  scrollPosition: 0
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

  setupPersistence(
    {
      key: 'homePage',
      serialize: () => ({ homePage: { ...homePage } }),
      hydrate: (data: { homePage?: Partial<HomePageState> } | Partial<HomePageState>) => {
        const incoming = (data as { homePage?: Partial<HomePageState> }).homePage ?? data
        if (incoming && typeof incoming === 'object') {
          Object.assign(homePage, defaultHomePageState(), incoming)
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
    resetHomePageState
  }
})
