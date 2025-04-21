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

<script setup lang="ts">
import { computed } from 'vue'
import { useTabsStore } from '../store/tabsStore'
import { useSettingsStore, THEMES } from '../store/settingsStore'

// Get stores
const tabsStore = useTabsStore()
const settingsStore = useSettingsStore()

// Computed properties
const activeTab = computed(() => tabsStore.getActiveTab)

// Get the current theme name
const currentTheme = computed((): string => {
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
/* Status bar */
.status-bar {
  display: flex;
  background-color: var(--surface);
  padding: 0.25rem 0.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  justify-content: space-between;
  height: 24px;
  min-height: auto;
  overflow: hidden;
}

.status-left,
.status-right {
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
}

.status-left {
  flex: 1;
  min-width: 0;
}

.status-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 1rem;
}
</style>
