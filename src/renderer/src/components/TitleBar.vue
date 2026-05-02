<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTabsStore } from '../stores/tabsStore'
import './TitleBar.css'

const isMaximized = ref(false)

const tabsStore = useTabsStore()
const { tabs, activeTabId, showHomePage } = storeToRefs(tabsStore)

const appTitle = computed((): string => {
  if (showHomePage.value) return 'Textonom - Home'
  const activeTab = tabs.value.find((tab) => tab.id === activeTabId.value)
  if (!activeTab) return 'Textonom'
  return `Textonom - ${activeTab.title}`
})

const checkMaximizedState = async (): Promise<void> => {
  try {
    isMaximized.value = await window.api.isWindowMaximized()
  } catch (error) {
    console.error('Failed to check if window is maximized:', error)
  }
}

onMounted(() => {
  checkMaximizedState()
  window.addEventListener('resize', checkMaximizedState)
  window.api.setWindowTitle(appTitle.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMaximizedState)
})

watch(appTitle, (title) => {
  window.api.setWindowTitle(title)
})

const minimizeWindow = (): void => {
  window.api.minimizeWindow()
}

const toggleMaximize = async (): Promise<void> => {
  isMaximized.value = await window.api.maximizeWindow()
}

const closeWindow = (): void => {
  window.api.closeWindow()
}
</script>

<template>
  <div class="title-bar">
    <div class="title-bar-drag-area">
      <div class="app-title">{{ appTitle }}</div>
    </div>
    <div class="window-controls">
      <button class="window-control minimize" @click="minimizeWindow">
        <svg width="10" height="1" viewBox="0 0 10 1">
          <path d="M0 0h10v1H0z" fill="currentColor" />
        </svg>
      </button>
      <button class="window-control maximize" @click="toggleMaximize">
        <svg v-if="isMaximized" width="10" height="10" viewBox="0 0 10 10">
          <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z" fill="currentColor" />
        </svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10">
          <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" fill="currentColor" />
        </svg>
      </button>
      <button class="window-control close" @click="closeWindow">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path
            d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
