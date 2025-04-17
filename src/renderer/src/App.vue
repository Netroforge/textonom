<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TabBar from './components/TabBar.vue'
import Editor from './components/Editor.vue'
import TopNavBar from './components/TopNavBar.vue'
import StatusBar from './components/StatusBar.vue'
import Settings from './components/Settings.vue'
import CRTEffect from './components/CRTEffect.vue'
import { useTabsStore } from './store/tabsStore'
import { useSettingsStore } from './store/settingsStore'
import { applyTheme } from './styles/themes'

// Refs
const editorRef = ref(null)
const showSettings = ref(false)

// Get stores
const tabsStore = useTabsStore()
const settingsStore = useSettingsStore()

// Handle menu actions
const handleMenuAction = (action) => {
  switch (action) {
    case 'new':
      editorRef.value?.createNewTab()
      break
    case 'open':
      editorRef.value?.openFile()
      break
    case 'save':
      editorRef.value?.saveFile()
      break
    case 'saveAs':
      editorRef.value?.saveFileAs()
      break
    case 'settings':
      showSettings.value = true
      break
    case 'exit':
      window.close()
      break
    case 'undo':
    case 'redo':
    case 'cut':
    case 'copy':
    case 'paste':
    case 'selectAll':
      // These actions are handled by Monaco editor directly
      break
  }
}

// Handle transformation result
const handleTransformation = (result) => {
  console.log('Transformation event received in App.vue:', result)
  if (!result.success) {
    alert(`Error: ${result.error}`)
  }
}

// Close settings dialog
const closeSettings = () => {
  showSettings.value = false
}

// Handle keyboard shortcuts
const handleKeyDown = (event) => {
  // Ctrl+S: Save
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    editorRef.value?.saveFile()
  }

  // Ctrl+Shift+S: Save As
  if (event.ctrlKey && event.shiftKey && event.key === 'S') {
    event.preventDefault()
    editorRef.value?.saveFileAs()
  }

  // Ctrl+O: Open
  if (event.ctrlKey && event.key === 'o') {
    event.preventDefault()
    editorRef.value?.openFile()
  }

  // Ctrl+N: New
  if (event.ctrlKey && event.key === 'n') {
    event.preventDefault()
    editorRef.value?.createNewTab()
  }

  // Ctrl+,: Settings
  if (event.ctrlKey && event.key === ',') {
    event.preventDefault()
    showSettings.value = true
  }
}

// Lifecycle hooks
onMounted(() => {
  // Apply the current theme
  applyTheme(settingsStore.theme)

  // Add keyboard shortcut listener
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  // Remove keyboard shortcut listener
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="app-container">
    <CRTEffect>
      <TopNavBar @menu-action="handleMenuAction" @transformation="handleTransformation"
        @open-settings="showSettings = true" />
      <TabBar />
      <Editor ref="editorRef" />
      <StatusBar />

      <Settings v-if="showSettings" @close="closeSettings" />
    </CRTEffect>
  </div>
</template>

<style>
@import './styles/global.css';

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
