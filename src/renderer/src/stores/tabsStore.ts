import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getTransformationById } from '../transformations/registry'
import { setupPersistence } from './electronStorage'

export interface Tab {
  id: string
  title: string
  transformationId: string
}

interface PersistedTabsState {
  tabs?: Tab[]
  activeTabId?: string | null
  showHomePage?: boolean
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<Tab[]>([])
  const activeTabId = ref<string | null>(null)
  const showHomePage = ref(true)

  const setShowHomePage = (show: boolean): void => {
    showHomePage.value = show
  }

  const addTab = (transformationId: string): string => {
    const transformation = getTransformationById(transformationId)
    if (!transformation) {
      console.error('TabsStore: Transformation not found:', transformationId)
      return ''
    }

    const existingTab = tabs.value.find((tab) => tab.transformationId === transformationId)
    if (existingTab) {
      activeTabId.value = existingTab.id
      showHomePage.value = false
      return existingTab.id
    }

    const newTabId = crypto.randomUUID().toString()
    const newTab: Tab = {
      id: newTabId,
      title: transformation.name,
      transformationId
    }

    tabs.value = [...tabs.value, newTab]
    activeTabId.value = newTabId
    showHomePage.value = false

    return newTabId
  }

  const closeTab = (tabId: string): void => {
    const tabIndex = tabs.value.findIndex((tab) => tab.id === tabId)
    if (tabIndex === -1) return

    const newTabs = tabs.value.filter((tab) => tab.id !== tabId)

    if (activeTabId.value === tabId) {
      if (newTabs.length === 0) {
        tabs.value = newTabs
        activeTabId.value = null
        showHomePage.value = true
        return
      }
      const newIndex = Math.min(tabIndex, newTabs.length - 1)
      tabs.value = newTabs
      activeTabId.value = newTabs[newIndex].id
      return
    }

    tabs.value = newTabs
  }

  const closeOtherTabs = (tabId: string): void => {
    const tabToKeep = tabs.value.find((tab) => tab.id === tabId)
    if (!tabToKeep) return
    tabs.value = [tabToKeep]
    activeTabId.value = tabId
    showHomePage.value = false
  }

  const closeAllTabs = (): void => {
    tabs.value = []
    activeTabId.value = null
    showHomePage.value = true
  }

  const closeTabsToRight = (tabId: string): void => {
    const tabIndex = tabs.value.findIndex((tab) => tab.id === tabId)
    if (tabIndex === -1) return
    const newTabs = tabs.value.slice(0, tabIndex + 1)
    const wasActiveTabClosed = !newTabs.some((tab) => tab.id === activeTabId.value)
    tabs.value = newTabs
    if (wasActiveTabClosed) {
      activeTabId.value = tabId
    }
  }

  const setActiveTab = (tabId: string): void => {
    activeTabId.value = tabId
    showHomePage.value = false
  }

  const reorderTabs = (fromIndex: number, toIndex: number): void => {
    if (fromIndex === toIndex) return
    const newTabs = [...tabs.value]
    const [movedTab] = newTabs.splice(fromIndex, 1)
    newTabs.splice(toIndex, 0, movedTab)
    tabs.value = newTabs
  }

  const { persist } = setupPersistence(
    {
      key: 'tabs',
      serialize: () => ({
        tabs: tabs.value,
        activeTabId: activeTabId.value,
        showHomePage: showHomePage.value
      }),
      hydrate: (data: PersistedTabsState) => {
        if (Array.isArray(data?.tabs)) tabs.value = data.tabs
        if (typeof data?.activeTabId !== 'undefined') activeTabId.value = data.activeTabId
        if (typeof data?.showHomePage === 'boolean') showHomePage.value = data.showHomePage
      }
    },
    (notify) => {
      watch([tabs, activeTabId, showHomePage], () => notify(), { deep: true })
    }
  )

  return {
    tabs,
    activeTabId,
    showHomePage,
    setShowHomePage,
    addTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    closeTabsToRight,
    setActiveTab,
    reorderTabs,
    persist
  }
})
