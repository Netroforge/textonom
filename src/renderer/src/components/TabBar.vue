<template>
  <div class="tabs">
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
    <button class="new-tab-button" @click="createNewTab">+</button>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useTabsStore } from '../store/tabsStore'

// Define props
const props = defineProps({
  editorRef: Object
})

// Get the tabs store
const tabsStore = useTabsStore()

// Computed properties for tabs and active tab
const tabs = computed(() => tabsStore.tabs)
const activeTabId = computed(() => tabsStore.activeTabId)

// Methods
const setActiveTab = (tabId) => {
  tabsStore.setActiveTab(tabId)
}

const closeTab = (tabId) => {
  tabsStore.closeTab(tabId)
}

const createNewTab = () => {
  if (props.editorRef) {
    props.editorRef.createNewTab()
  } else {
    tabsStore.addTab({
      title: 'Untitled',
      content: '',
      isUnsaved: true
    })
  }
}
</script>

<style scoped>
/* Tab styling is in global.css */
</style>
