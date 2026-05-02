import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { TransformationParamValues } from '../types/transformation'

export interface TabContent {
  inputText: string
  outputText: string
  paramValues: TransformationParamValues
}

const defaultTabContent = (): TabContent => ({
  inputText: '',
  outputText: '',
  paramValues: {}
})

export const useTabsContentStore = defineStore('tabsContent', () => {
  const tabsContent = reactive<Record<string, TabContent>>({})

  const getTabContent = (tabId: string): TabContent => {
    return tabsContent[tabId] ?? defaultTabContent()
  }

  const saveTabContent = (tabId: string, content: TabContent): void => {
    tabsContent[tabId] = content
  }

  const removeTabContent = (tabId: string): void => {
    delete tabsContent[tabId]
  }

  const clearAllTabsContent = (): void => {
    for (const key of Object.keys(tabsContent)) {
      delete tabsContent[key]
    }
  }

  return {
    tabsContent,
    getTabContent,
    saveTabContent,
    removeTabContent,
    clearAllTabsContent
  }
})
