import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tab {
  id: string;
  title: string;
  content: string;
  path: string | null; // null for unsaved tabs
  isModified: boolean;
}

export interface EditorSettings {
  theme: 'light' | 'dark' | 'cyberpunk' | 'cyberpunk-turbo';
  fontFamily: string;
  fontSize: number;
  tabSize: number;
  insertSpaces: boolean;
  autoIndent: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
  wrapColumn: number;
  autoSave: boolean;
  autoSaveInterval: number; // in milliseconds
}

interface StoreState {
  tabs: Tab[];
  activeTabId: string | null;
  settings: EditorSettings;
  addTab: (tab: Omit<Tab, 'id'>) => string;
  updateTabContent: (id: string, content: string) => void;
  updateTabPath: (id: string, path: string) => void;
  updateTabTitle: (id: string, title: string) => void;
  setTabModified: (id: string, isModified: boolean) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateSettings: (settings: Partial<EditorSettings>) => void;
}

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'light',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 14,
  tabSize: 2,
  insertSpaces: true,
  autoIndent: true,
  showLineNumbers: true,
  wordWrap: true,
  wrapColumn: 80,
  autoSave: false,
  autoSaveInterval: 30000, // 30 seconds
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      tabs: [],
      activeTabId: null,
      settings: DEFAULT_SETTINGS,

      addTab: (tab) => {
        const id = crypto.randomUUID();
        set((state) => ({
          tabs: [...state.tabs, { ...tab, id }],
          activeTabId: id,
        }));
        return id;
      },

      updateTabContent: (id, content) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, content, isModified: true } : tab
          ),
        }));
      },

      updateTabPath: (id, path) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, path, isModified: false } : tab
          ),
        }));
      },

      updateTabTitle: (id, title) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, title } : tab
          ),
        }));
      },

      setTabModified: (id, isModified) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, isModified } : tab
          ),
        }));
      },

      closeTab: (id) => {
        set((state) => {
          const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
          if (tabIndex === -1) return state;

          const newTabs = state.tabs.filter((tab) => tab.id !== id);
          let newActiveTabId = state.activeTabId;

          // If we're closing the active tab, select a new active tab
          if (state.activeTabId === id) {
            if (newTabs.length === 0) {
              newActiveTabId = null;
            } else if (tabIndex < newTabs.length) {
              newActiveTabId = newTabs[tabIndex].id;
            } else {
              newActiveTabId = newTabs[newTabs.length - 1].id;
            }
          }

          return {
            tabs: newTabs,
            activeTabId: newActiveTabId,
          };
        });
      },

      setActiveTab: (id) => {
        set({ activeTabId: id });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'textonom-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
