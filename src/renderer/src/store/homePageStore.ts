import { defineStore } from 'pinia'

// Home page state interface
interface HomePageState {
  scrollPosition: number
  searchQuery: string
}

export const useHomePageStore = defineStore('homePage', {
  state: (): HomePageState => ({
    scrollPosition: 0,
    searchQuery: ''
  }),

  actions: {
    // Save scroll position
    setScrollPosition(position: number): void {
      this.scrollPosition = position
    },

    // Save search query
    setSearchQuery(query: string): void {
      this.searchQuery = query
    },

    // Reset state
    resetState(): void {
      this.scrollPosition = 0
      this.searchQuery = ''
    }
  }
})
