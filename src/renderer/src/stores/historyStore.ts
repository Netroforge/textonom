import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { setupPersistence } from './electronStorage'

export interface HistoryEntry {
  id: string
  transformationId: string
  transformationName: string
  timestamp: number
}

interface HistoryState {
  history: HistoryEntry[]
  favorites: string[]
}

const MAX_HISTORY = 100

const defaultState = (): HistoryState => ({
  history: [],
  favorites: []
})

let historyCounter = 0

export const useHistoryStore = defineStore('history', () => {
  const state = reactive<HistoryState>(defaultState())

  const addToHistory = (transformationId: string, transformationName: string): void => {
    // Remove existing entry for the same transformation
    state.history = state.history.filter((e) => e.transformationId !== transformationId)

    // Add new entry at the beginning
    state.history.unshift({
      id: `h${Date.now()}-${++historyCounter}`,
      transformationId,
      transformationName,
      timestamp: Date.now()
    })

    // Trim to max history size
    if (state.history.length > MAX_HISTORY) {
      state.history = state.history.slice(0, MAX_HISTORY)
    }
  }

  const removeFromHistory = (id: string): void => {
    state.history = state.history.filter((e) => e.id !== id)
  }

  const clearHistory = (): void => {
    state.history = []
  }

  const toggleFavorite = (transformationId: string): void => {
    const index = state.favorites.indexOf(transformationId)
    if (index === -1) {
      state.favorites.push(transformationId)
    } else {
      state.favorites.splice(index, 1)
    }
  }

  const isFavorite = (transformationId: string): boolean => {
    return state.favorites.includes(transformationId)
  }

  const { persist } = setupPersistence(
    {
      key: 'history',
      serialize: () => ({
        history: state.history,
        favorites: state.favorites
      }),
      hydrate: (data: HistoryState | Partial<HistoryState>) => {
        if (data && typeof data === 'object') {
          if (Array.isArray(data.history)) {
            state.history = data.history
              .filter(
                (entry): entry is HistoryEntry =>
                  entry !== null &&
                  typeof entry === 'object' &&
                  typeof entry.id === 'string' &&
                  typeof entry.transformationId === 'string' &&
                  typeof entry.transformationName === 'string' &&
                  typeof entry.timestamp === 'number' &&
                  Number.isFinite(entry.timestamp)
              )
              .slice(0, MAX_HISTORY)
          }
          if (Array.isArray(data.favorites)) {
            state.favorites = [...new Set(data.favorites.filter((id) => typeof id === 'string'))]
          }
        }
      }
    },
    (notify) => {
      watch(state, () => notify(), { deep: true })
    }
  )

  return {
    state,
    addToHistory,
    removeFromHistory,
    clearHistory,
    toggleFavorite,
    isFavorite,
    persist
  }
})
