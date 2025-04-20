<template>
  <div class="tabs-container">
    <div class="tabs-scroll-area">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: tab.id === activeTabId }"
        @click="setActiveTab(tab.id)"
      >
        <div class="tab-title">{{ tab.title }}{{ tab.isUnsaved ? '*' : '' }}</div>
        <div class="tab-close" @click.stop="closeTab(tab.id)">✕</div>
      </div>
    </div>
    <button class="new-tab-button" @click="createNewTab">+</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTabsStore } from '../store/tabsStore'

const emit = defineEmits<{
  'new-tab': []
}>()

// Get the tab's store
const tabsStore = useTabsStore()

// Computed properties for tabs and active tab
const tabs = computed(() => tabsStore.tabs)
const activeTabId = computed(() => tabsStore.activeTabId)

// Methods
const setActiveTab = (tabId: string): void => {
  tabsStore.setActiveTab(tabId)
}

const closeTab = (tabId: string): void => {
  tabsStore.closeTab(tabId)
}

const createNewTab = (): void => {
  emit('new-tab')
}
</script>

<style scoped>
/* Tab styling */
.tabs-container {
  display: flex;
  position: relative;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  height: 38px; /* Match the height of tabs */
}

.tabs-scroll-area {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  flex: 1;
  padding-right: 40px; /* Make space for the new tab button */
}

.tab {
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: var(--tabBackground);
  color: var(--tabText);
  border-right: 1px solid var(--border);
  display: flex;
  align-items: center;
  min-width: 120px;
  max-width: 200px;
}

.tab.active {
  background-color: var(--tabActiveBackground);
  color: var(--tabActiveText);
  border-bottom: 2px solid var(--tabActiveBorder);
}

.tab:hover:not(.active) {
  background-color: var(--tabHoverBackground);
}

.tab-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  margin-left: 0.5rem;
  opacity: 0.7;
}

.tab-close:hover {
  opacity: 1;
}

.new-tab-button {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0.5rem;
  cursor: pointer;
  background-color: var(--surface);
  color: var(--tabText);
  border: none;
  border-left: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.new-tab-button:hover {
  background-color: var(--tabHoverBackground);
}
</style>
