import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { setupPersistence } from './electronStorage'

export interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
  isFullScreen: boolean
  displayId?: string
}

const defaultWindowState: WindowState = {
  width: 1200,
  height: 800,
  isMaximized: false,
  isFullScreen: false
}

export const useWindowStore = defineStore('window', () => {
  const windowState = ref<WindowState | null>({ ...defaultWindowState })

  const setWindowState = (state: WindowState): void => {
    windowState.value = state
  }

  setupPersistence(
    {
      key: 'window',
      serialize: (): WindowState | null => windowState.value,
      hydrate: (data: { windowState?: WindowState } | WindowState | null) => {
        if (!data) return
        const incoming =
          (data as { windowState?: WindowState }).windowState ?? (data as WindowState)
        if (incoming) {
          windowState.value = incoming
        }
      }
    },
    (notify) => {
      watch(windowState, () => notify(), { deep: true })
    }
  )

  return {
    windowState,
    setWindowState
  }
})
