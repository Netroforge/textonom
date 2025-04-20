<template>
  <div class="app-container">
    <CRTEffect>
      <TitleBar />
      <TopNavBar
        :editor-ref="editorRef"
        @menu-action="handleMenuAction"
        @open-settings="showSettings = true"
      />
      <TabBar :editor-ref="editorRef" @new-tab="handleNewTab" />
      <Editor ref="editorRef" />
      <StatusBar />

      <Settings v-if="showSettings" @close="closeSettings" />
      <About v-if="showAbout" @close="closeAbout" />
    </CRTEffect>

    <UpdateNotification ref="updateNotificationRef" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import TabBar from './components/TabBar.vue'
import Editor from './components/Editor.vue'
import TopNavBar from './components/TopNavBar.vue'
import StatusBar from './components/StatusBar.vue'
import Settings from './components/Settings.vue'
import About from './components/About.vue'
import CRTEffect from './components/CRTEffect.vue'
import TitleBar from './components/TitleBar.vue'
import UpdateNotification from './components/UpdateNotification.vue'
import { useSettingsStore } from './store/settingsStore'
import { useHotkeysStore } from './store/hotkeysStore'
import { applyTheme } from './styles/themes'

// Refs
const editorRef = ref<InstanceType<typeof Editor> | null>(null)
const updateNotificationRef = ref<InstanceType<typeof UpdateNotification> | null>(null)
const showSettings = ref<boolean>(false)
const showAbout = ref<boolean>(false)

// Get stores
const settingsStore = useSettingsStore()
const hotkeysStore = useHotkeysStore()

// Handle menu actions
const handleMenuAction = (action: string): void => {
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
    case 'checkForUpdates':
      checkForUpdates()
      break
    case 'about':
      showAbout.value = true
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
      editorRef.value?.cut()
      break
    case 'copy':
      editorRef.value?.copy()
      break
    case 'paste':
      editorRef.value?.paste()
      break
    case 'selectAll':
      editorRef.value?.selectAll()
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

const handleNewTab = (): void => {
  editorRef.value?.createNewTab()
}

// Close settings dialog
const closeSettings = (): void => {
  showSettings.value = false
}

// Close about dialog
const closeAbout = (): void => {
  showAbout.value = false
}

// Check for updates
const checkForUpdates = async (): Promise<void> => {
  try {
    updateNotificationRef.value.manualCheckUpdateStarted()
    window.api.checkForUpdates().then((result) => {
      if (!result.updateAvailable) {
        updateNotificationRef.value.manualCheckUpdateCompletedUpdateNotAvailable()
      }
    })
  } catch (error) {
    alert(`Error checking for updates: ${error.message}`)
  }
}

// Handle keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent): void => {
  // File menu shortcuts
  if (hotkeysStore.matchesAction(event, 'file.new')) {
    event.preventDefault()
    editorRef.value?.createNewTab()
    return
  }

  if (hotkeysStore.matchesAction(event, 'file.open')) {
    event.preventDefault()
    editorRef.value?.openFile()
    return
  }

  if (hotkeysStore.matchesAction(event, 'file.save')) {
    event.preventDefault()
    editorRef.value?.saveFile()
    return
  }

  if (hotkeysStore.matchesAction(event, 'file.saveAs')) {
    event.preventDefault()
    editorRef.value?.saveFileAs()
    return
  }

  if (hotkeysStore.matchesAction(event, 'file.settings')) {
    event.preventDefault()
    showSettings.value = true
    return
  }

  // Edit menu shortcuts
  if (hotkeysStore.matchesAction(event, 'edit.undo')) {
    // Let the editor handle it by default
    if (!editorRef.value) {
      event.preventDefault()
      editorRef.value?.undo()
    }
    return
  }

  if (hotkeysStore.matchesAction(event, 'edit.redo')) {
    // Let the editor handle it by default
    if (!editorRef.value) {
      event.preventDefault()
      editorRef.value?.redo()
    }
    return
  }

  if (hotkeysStore.matchesAction(event, 'edit.cut')) {
    // Let the editor handle it by default
    if (!editorRef.value) {
      event.preventDefault()
      editorRef.value?.cut()
    }
    return
  }

  if (hotkeysStore.matchesAction(event, 'edit.copy')) {
    // Let the editor handle it by default
    if (!editorRef.value) {
      event.preventDefault()
      editorRef.value?.copy()
    }
    return
  }

  if (hotkeysStore.matchesAction(event, 'edit.paste')) {
    // Let the editor handle it by default
    if (!editorRef.value) {
      event.preventDefault()
      editorRef.value?.paste()
    }
    return
  }

  if (hotkeysStore.matchesAction(event, 'edit.selectAll')) {
    // Let the editor handle it by default
    if (!editorRef.value) {
      event.preventDefault()
      editorRef.value?.selectAll()
    }
    return
  }

  // Transformation shortcuts
  if (hotkeysStore.matchesAction(event, 'transform.base64Encode')) {
    event.preventDefault()
    editorRef.value?.processBase64Encode()
    return
  }

  if (hotkeysStore.matchesAction(event, 'transform.base64Decode')) {
    event.preventDefault()
    editorRef.value?.processBase64Decode()
    return
  }

  if (hotkeysStore.matchesAction(event, 'transform.jsonPrettify')) {
    event.preventDefault()
    editorRef.value?.processJsonPrettify()
    return
  }

  if (hotkeysStore.matchesAction(event, 'transform.jsonCompact')) {
    event.preventDefault()
    editorRef.value?.processJsonCompact()
    return
  }

  if (hotkeysStore.matchesAction(event, 'transform.urlEncode')) {
    event.preventDefault()
    editorRef.value?.processUrlEncode()
    return
  }

  if (hotkeysStore.matchesAction(event, 'transform.urlDecode')) {
    event.preventDefault()
    editorRef.value?.processUrlDecode()
    return
  }
}

// Lifecycle hooks
onMounted(() => {
  // Apply the current theme
  applyTheme(settingsStore.theme)

  // Add keyboard shortcut listener
  window.addEventListener('keydown', handleKeyDown)

  // Check for updates on startup if enabled
  if (settingsStore.autoUpdate && settingsStore.checkForUpdatesOnStartup) {
    // Wait a bit before checking for updates to ensure the app is fully loaded
    setTimeout(() => {
      window.api.checkForUpdates().catch((error) => {
        console.error('Error checking for updates on startup:', error)
      })
    }, 5000)
  }
})

onBeforeUnmount(() => {
  // Remove keyboard shortcut listener
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style>
@import './styles/global.css';

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Ensure the CRTEffect container takes full height */
.app-container > div {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
