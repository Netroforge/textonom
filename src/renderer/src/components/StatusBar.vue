<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTabsStore } from '../stores/tabsStore'
import { useTabsContentStore } from '../stores/tabsContentStore'
import { useSettingsStore } from '../stores/settingsStore'
import './StatusBar.css'

const appVersion = ref<string>('')

const tabsStore = useTabsStore()
const { activeTabId, showHomePage } = storeToRefs(tabsStore)

const tabsContentStore = useTabsContentStore()
const { tabsContent } = storeToRefs(tabsContentStore)

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const activeContent = computed(() => {
  if (showHomePage.value || !activeTabId.value) return null
  return tabsContent.value[activeTabId.value] ?? null
})

const inputCount = computed(() => activeContent.value?.inputText.length ?? 0)
const outputCount = computed(() => activeContent.value?.outputText.length ?? 0)

const formatCount = (n: number): string => {
  return n === 1 ? '1 char' : `${n.toLocaleString()} chars`
}

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
    <div class="status-left">
      <template v-if="activeContent">
        <span class="status-item">In: {{ formatCount(inputCount) }}</span>
        <span class="status-divider">•</span>
        <span class="status-item">Out: {{ formatCount(outputCount) }}</span>
      </template>
      <span v-else class="status-item">Ready</span>
    </div>
    <div class="status-right">
      <span class="status-item">{{ settings.theme }}</span>
      <span class="status-divider">•</span>
      <span class="status-item">v{{ appVersion }}</span>
    </div>
  </div>
</template>
