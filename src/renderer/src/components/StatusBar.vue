<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTabsStore } from '../stores/tabsStore'
import './StatusBar.css'

const appVersion = ref<string>('')

const tabsStore = useTabsStore()
const { tabs, activeTabId, showHomePage } = storeToRefs(tabsStore)

const currentTabName = computed((): string => {
  if (showHomePage.value) return 'Home'
  const activeTab = tabs.value.find((tab) => tab.id === activeTabId.value)
  if (!activeTab) return 'Ready'
  return activeTab.title
})

onMounted(async () => {
  try {
    appVersion.value = await window.api.getAppVersion()
  } catch (error) {
    console.error('Failed to get app version:', error)
    appVersion.value = 'Unknown'
  }
})
</script>

<template>
  <div class="status-bar">
    <div class="status-item">{{ currentTabName }}</div>
    <div class="status-item">v{{ appVersion }}</div>
  </div>
</template>
