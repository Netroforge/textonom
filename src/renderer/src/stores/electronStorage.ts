// Storage adapter that persists Pinia store state to disk via the Electron API.

export interface PersistedStorage {
  getItem(name: string): Promise<string | null>
  setItem(name: string, value: string): Promise<void>
}

export const createElectronStorage = (storeName: string): PersistedStorage => ({
  getItem: async (): Promise<string | null> => {
    try {
      const result = await window.api.loadState({ key: storeName })
      if (result.success && result.state) {
        return result.state
      }
      return null
    } catch (error) {
      console.error(`[electronStorage] Failed to load state for ${storeName}:`, error)
      return null
    }
  },

  setItem: async (_name: string, value: string): Promise<void> => {
    try {
      const result = await window.api.saveState({ key: storeName, state: value })
      if (!result.success) {
        console.error(`[electronStorage] Failed to save state for ${storeName}:`, result.error)
      }
    } catch (error) {
      console.error(`[electronStorage] Failed to save state for ${storeName}:`, error)
    }
  }
})

interface PersistOptions<T> {
  key: string
  serialize: () => T
  hydrate: (data: T) => void
}

export const setupPersistence = <T>(opts: PersistOptions<T>, watcher: (cb: () => void) => void): void => {
  const storage = createElectronStorage(opts.key)

  void (async (): Promise<void> => {
    const raw = await storage.getItem(opts.key)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { state?: T } | T
        const data = (parsed as { state?: T }).state ?? (parsed as T)
        opts.hydrate(data)
      } catch (error) {
        console.error(`[electronStorage] Failed to parse state for ${opts.key}:`, error)
      }
    }

    let saving = false
    let pending = false
    const save = async (): Promise<void> => {
      if (saving) {
        pending = true
        return
      }
      saving = true
      try {
        const value = JSON.stringify({ state: opts.serialize(), version: 1 })
        await storage.setItem(opts.key, value)
      } finally {
        saving = false
        if (pending) {
          pending = false
          await save()
        }
      }
    }

    watcher(() => {
      void save()
    })
  })()
}
