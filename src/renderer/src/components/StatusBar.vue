<template>
  <div class="status-bar">
    <div class="status-left">
      <div v-if="activeTab" class="status-item">
        {{ activeTab.filePath || 'Unsaved file' }}
      </div>
      <div v-if="activeTab" class="status-item">
        {{ activeTab.isUnsaved ? 'Modified' : 'Saved' }}
      </div>
    </div>
    <div class="status-right">
      <div class="status-item">
        {{ currentTheme }}{{ settingsStore.turboMode ? ' (Turbo Mode)' : '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTabsStore } from '../store/tabsStore'
import { useSettingsStore, THEMES } from '../store/settingsStore'

// Get stores
const tabsStore = useTabsStore()
const settingsStore = useSettingsStore()

// Computed properties
const activeTab = computed(() => tabsStore.getActiveTab)

// Get the current theme name
const currentTheme = computed(() => {
  switch (settingsStore.theme) {
    case THEMES.LIGHT:
      return 'Light Theme'
    case THEMES.DARK:
      return 'Dark Theme'
    case THEMES.CYBERPUNK:
      return 'Cyberpunk Theme'
    default:
      return 'Unknown Theme'
  }
})
</script>

<style scoped>
/* Status bar styling is in global.css */
</style>
