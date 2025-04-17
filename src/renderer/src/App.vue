<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TabBar from './components/TabBar.vue'
import Editor from './components/Editor.vue'
import TopNavBar from './components/TopNavBar.vue'
import StatusBar from './components/StatusBar.vue'
import Settings from './components/Settings.vue'
import CRTEffect from './components/CRTEffect.vue'
import TitleBar from './components/TitleBar.vue'
import { useSettingsStore } from './store/settingsStore'
import { applyTheme } from './styles/themes'

// Refs
const editorRef = ref(null)
const showSettings = ref(false)

// Get settings store
const settingsStore = useSettingsStore()

// Handle menu actions
const handleMenuAction = (action) => {
  switch (action) {
    // File
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

    // Edit
    case 'undo':
      editorRef.value?.undo()
      break
    case 'redo':
      editorRef.value?.redo()
      break
    case 'cut':
    case 'copy':
    case 'paste':
    case 'selectAll':
      // These actions are handled by Monaco Editor directly
      break

    // Transformations
    case 'base64Encode':
      editorRef.value?.processBase64Encode()
      break
    case 'base64Decode':
      editorRef.value?.processBase64Decode()
      break
    case 'jsonPrettify':
      editorRef.value?.processJsonPrettify()
      break
    case 'jsonCompact':
      editorRef.value?.processJsonCompact()
      break
    case 'urlEncode':
      editorRef.value?.processUrlEncode()
      break
    case 'urlDecode':
      editorRef.value?.processUrlDecode()
      break
    case 'toUpperCase':
      editorRef.value?.processToUpperCase()
      break
    case 'toLowerCase':
      editorRef.value?.processToLowerCase()
      break
    case 'toTitleCase':
      editorRef.value?.processToTitleCase()
      break
    case 'xmlPrettify':
      editorRef.value?.processXmlPrettify()
      break
    case 'xmlCompact':
      editorRef.value?.processXmlCompact()
      break
    case 'sortLines':
      editorRef.value?.processSortLines()
      break
    case 'deduplicateLines':
      editorRef.value?.processDeduplicateLines()
      break
    case 'reverseLines':
      editorRef.value?.processReverseLines()
      break
    case 'htmlEncode':
      editorRef.value?.processHtmlEncode()
      break
    case 'htmlDecode':
      editorRef.value?.processHtmlDecode()
      break
    case 'md5Hash':
      editorRef.value?.processMd5Hash()
      break
    case 'sha1Hash':
      editorRef.value?.processSha1Hash()
      break
    case 'sha256Hash':
      editorRef.value?.processSha256Hash()
      break
    case 'bcryptHash':
      editorRef.value?.processBcryptHash()
      break
    case 'unicodeEscape':
      editorRef.value?.processUnicodeEscape()
      break
    case 'unicodeUnescape':
      editorRef.value?.processUnicodeUnescape()
      break
    case 'jsonToYaml':
      editorRef.value?.processJsonToYaml()
      break
    case 'yamlToJson':
      editorRef.value?.processYamlToJson()
      break
    case 'propertiesFileToYaml':
      editorRef.value?.processPropertiesToYaml()
      break
    case 'yamlToPropertiesFile':
      editorRef.value?.processYamlToProperties()
      break

    // Default
    default:
      console.error(`Menu action ${action} not found`)
      break
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
      <TitleBar />
      <TopNavBar
        :editor-ref="editorRef"
        @menu-action="handleMenuAction"
        @open-settings="showSettings = true"
      />
      <TabBar :editor-ref="editorRef" />
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
