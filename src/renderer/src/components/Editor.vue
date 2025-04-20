<template>
  <div ref="editorContainer" class="editor-container">
    <div v-if="!activeTabId" class="empty-editor">
      <div class="empty-message">
        <p>No open files</p>
        <div>
          <button @click="createNewTab">Create New Scratch File</button>
        </div>
        <div>
          <button @click="openFile">Open File</button>
        </div>
      </div>
    </div>
    <textarea
      v-if="activeTabId"
      ref="textareaEditor"
      class="textarea-editor"
      spellcheck="false"
      @input="handleTextareaInput"
    ></textarea>

    <!-- Error Popup -->
    <div v-if="showErrorPopup" class="error-popup">
      <div class="error-popup-content">
        <h3>Error</h3>
        <p>{{ errorMessage }}</p>
        <button @click="closeErrorPopup">Close</button>
      </div>
    </div>

    <!-- Bcrypt Dialog -->
    <BcryptDialog v-if="showBcryptDialog" @close="closeBcryptDialog" @apply="applyBcryptHash" />

    <!-- Transformation Overlay -->
    <TransformationOverlay />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useTabsStore } from '../store/tabsStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTransformationStore } from '../store/transformationStore'
import { applyTheme } from '../styles/themes'
import transformations from '../transformations'
import BcryptDialog from './BcryptDialog.vue'
import TransformationOverlay from './TransformationOverlay.vue'
import { TransformationFunction } from '../types'

// Refs
const editorContainer = ref<HTMLElement | null>(null)
const textareaEditor = ref<HTMLTextAreaElement | null>(null)
let autoSaveInterval: ReturnType<typeof setInterval> | null = null
let contentSaveInterval: ReturnType<typeof setInterval> | null = null

// Get stores
const tabsStore = useTabsStore()
const settingsStore = useSettingsStore()
const transformationStore = useTransformationStore()

// Computed properties
const activeTabId = computed(() => tabsStore.getActiveTabId)

// Show error
const showErrorPopup = ref<boolean>(false)
const errorMessage = ref<string>('')

// Bcrypt dialog
const showBcryptDialog = ref<boolean>(false)

// Create a new tab
const createNewTab = (): void => {
  const tabId = tabsStore.addTab({
    title: 'Untitled',
    content: '',
    isUnsaved: true
  })
  if (!activeTabId.value) {
    tabsStore.setActiveTab(tabId)
  }
}

// Extract filename from a path (works with both forward and backslashes)
const getFilenameFromPath = (filePath: string | null): string => {
  if (!filePath) return 'Untitled'
  // Replace backslashes with forward slashes for consistency
  const normalizedPath = filePath.replace(/\\/g, '/')
  // Get the last part after the last slash
  return normalizedPath.split('/').pop()
}

// Open a file
const openFile = async (): Promise<void> => {
  try {
    // Pass the last directory from settings if available
    const result = await window.api.openFile({ lastDirectory: settingsStore.lastDirectory })
    if (result.success) {
      // Update the last directory in settings
      if (result.lastDirectory) {
        settingsStore.setLastDirectory(result.lastDirectory)
      }

      tabsStore.addTab({
        title: getFilenameFromPath(result.filePath),
        content: result.content,
        filePath: result.filePath,
        isUnsaved: false
      })
    }
  } catch (error) {
    console.error('Error opening file:', error)
  }
}

// Save the current file
const saveFile = async (): Promise<void> => {
  const activeTab = tabsStore.getActiveTab
  if (!activeTab) return

  try {
    const content = textareaEditor.value?.value || ''
    const result = await window.api.saveFile({
      filePath: activeTab.filePath,
      content,
      lastDirectory: settingsStore.lastDirectory
    })

    if (result.success) {
      // Update the last directory in settings
      if (result.lastDirectory) {
        settingsStore.setLastDirectory(result.lastDirectory)
      }

      const fileName = getFilenameFromPath(result.filePath)
      tabsStore.updateTabAfterSave(activeTab.id, result.filePath, fileName)
    }
  } catch (error) {
    console.error('Error saving file:', error)
  }
}

// Save the current file as a new file
const saveFileAs = async (): Promise<void> => {
  const activeTab = tabsStore.getActiveTab
  if (!activeTab) return

  try {
    const content = textareaEditor.value?.value || ''
    const result = await window.api.saveFileAs({
      content,
      currentPath: activeTab.filePath,
      lastDirectory: settingsStore.lastDirectory
    })

    if (result.success) {
      // Update the last directory in settings
      if (result.lastDirectory) {
        settingsStore.setLastDirectory(result.lastDirectory)
      }

      const fileName = getFilenameFromPath(result.filePath)
      tabsStore.updateTabAfterSave(activeTab.id, result.filePath, fileName)
    }
  } catch (error) {
    console.error('Error saving file as:', error)
  }
}

const undo = (): void => {
  if (!textareaEditor.value) return

  try {
    textareaEditor.value.focus()
    document.execCommand('undo')
  } catch (error) {
    console.error('Undo action failed:', error)
  }
}

const redo = (): void => {
  if (!textareaEditor.value) return

  try {
    textareaEditor.value.focus()
    document.execCommand('redo')
  } catch (error) {
    console.error('Redo action failed:', error)
  }
}

const cut = (): void => {
  if (!textareaEditor.value) return

  try {
    textareaEditor.value.focus()
    document.execCommand('cut')
  } catch (error) {
    console.error('Cut action failed:', error)
  }
}

const copy = (): void => {
  if (!textareaEditor.value) return

  try {
    textareaEditor.value.focus()
    document.execCommand('copy')
  } catch (error) {
    console.error('Copy action failed:', error)
  }
}

const paste = (): void => {
  if (!textareaEditor.value) return

  try {
    textareaEditor.value.focus()
    document.execCommand('paste')
  } catch (error) {
    console.error('Paste action failed:', error)
  }
}

const selectAll = (): void => {
  if (!textareaEditor.value) return

  try {
    textareaEditor.value.focus()
    textareaEditor.value.select()
  } catch (error) {
    console.error('Select all action failed:', error)
  }
}

const processBase64Encode = async (): Promise<void> => {
  await processTransformation(transformations.base64Encode)
}

const processBase64Decode = async (): Promise<void> => {
  await processTransformation(transformations.base64Decode)
}

const processJsonPrettify = async (): Promise<void> => {
  await processTransformation(transformations.jsonPrettify)
}

const processJsonCompact = async (): Promise<void> => {
  await processTransformation(transformations.jsonCompact)
}

const processUrlEncode = async (): Promise<void> => {
  await processTransformation(transformations.urlEncode)
}

const processUrlDecode = async (): Promise<void> => {
  await processTransformation(transformations.urlDecode)
}

const processToUpperCase = async (): Promise<void> => {
  await processTransformation(transformations.toUpperCase)
}

const processToLowerCase = async (): Promise<void> => {
  await processTransformation(transformations.toLowerCase)
}

const processToTitleCase = async (): Promise<void> => {
  await processTransformation(transformations.toTitleCase)
}

const processXmlPrettify = async (): Promise<void> => {
  await processTransformation(transformations.xmlPrettify)
}

const processXmlCompact = async (): Promise<void> => {
  await processTransformation(transformations.xmlCompact)
}

const processSortLines = async (): Promise<void> => {
  await processTransformation(transformations.sortLines)
}

const processDeduplicateLines = async (): Promise<void> => {
  await processTransformation(transformations.deduplicateLines)
}

const processReverseLines = async (): Promise<void> => {
  await processTransformation(transformations.reverseLines)
}

const processHtmlEncode = async (): Promise<void> => {
  await processTransformation(transformations.htmlEncode)
}

const processHtmlDecode = async (): Promise<void> => {
  await processTransformation(transformations.htmlDecode)
}

const processMd5Hash = async (): Promise<void> => {
  await processTransformation(transformations.md5Hash)
}

const processSha1Hash = async (): Promise<void> => {
  await processTransformation(transformations.sha1Hash)
}

const processSha256Hash = async (): Promise<void> => {
  await processTransformation(transformations.sha256Hash)
}

const processBcryptHash = async (): Promise<void> => {
  // Show the bcrypt dialog instead of directly applying the transformation
  showBcryptDialog.value = true
}

// Close the bcrypt dialog
const closeBcryptDialog = (): void => {
  showBcryptDialog.value = false
}

// Apply bcrypt hash with custom rounds
const applyBcryptHash = async (rounds: number): Promise<void> => {
  // Create a function that will use the specified rounds
  const bcryptWithCustomRounds = async (text: string): Promise<string> =>
    transformations.bcryptHash(text, rounds)
  await processTransformation(bcryptWithCustomRounds)
}

const processUnicodeEscape = async (): Promise<void> => {
  await processTransformation(transformations.unicodeEscape)
}

const processUnicodeUnescape = async (): Promise<void> => {
  await processTransformation(transformations.unicodeUnescape)
}

const processJsonToYaml = async (): Promise<void> => {
  await processTransformation(transformations.jsonToYaml)
}

const processYamlToJson = async (): Promise<void> => {
  await processTransformation(transformations.yamlToJson)
}

const processPropertiesToYaml = async (): Promise<void> => {
  await processTransformation(transformations.propertiesFileToYaml)
}

const processYamlToProperties = async (): Promise<void> => {
  await processTransformation(transformations.yamlToPropertiesFile)
}

// Get transformation name from function
const getTransformationName = (transformFn: TransformationFunction): string => {
  // Find the transformation name by comparing the function reference
  for (const [key, value] of Object.entries(transformations)) {
    if (value === transformFn) {
      // Convert camelCase to Title Case
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    }
  }
  return 'Transformation' // Default name if not found
}

const processTransformation = async (transformFn: TransformationFunction): Promise<void> => {
  if (!textareaEditor.value) return

  // Get a transformation name for display
  const transformationName = getTransformationName(transformFn)

  // Start transformation and show overlay
  transformationStore.startTransformation(transformationName)

  try {
    // Get the current selection or use the entire content
    const textarea = textareaEditor.value
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd
    const hasSelection = selectionStart !== selectionEnd
    let text
    let transformedText

    // Process the transformation
    if (hasSelection) {
      // Transform selected text only
      text = textarea.value.substring(selectionStart, selectionEnd)
      transformedText = await transformFn(text)
    } else {
      // Transform entire document
      text = textarea.value
      transformedText = await transformFn(text)
    }

    // Add a small delay to ensure the animation is visible even for quick transformations
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Apply the transformation
    if (hasSelection) {
      // Apply the transformation to the selected text
      const beforeSelection = textarea.value.substring(0, selectionStart)
      const afterSelection = textarea.value.substring(selectionEnd)
      textarea.value = beforeSelection + transformedText + afterSelection

      // Update selection to cover the transformed text
      textarea.setSelectionRange(selectionStart, selectionStart + transformedText.length)
    } else {
      // Replace the entire content
      textarea.value = transformedText
    }

    // Update the tab content in the store
    if (activeTabId.value) {
      tabsStore.updateTabContent(activeTabId.value, textarea.value, false)
    }

    textarea.focus()

    // End transformation and hide overlay
    transformationStore.endTransformation()
  } catch (error) {
    console.error('Transformation failed:', error)
    transformationStore.cancelTransformation()
    showErrorPopup.value = true
    errorMessage.value = error.message
  }
}

const closeErrorPopup = (): void => {
  showErrorPopup.value = false
  errorMessage.value = ''
}

// Handle textarea input event
const handleTextareaInput = (event: Event): void => {
  if (!activeTabId.value) return

  const content = (event.target as HTMLTextAreaElement).value

  // Update tab content in store without triggering a re-render of the editor
  tabsStore.updateTabContent(activeTabId.value, content, false)

  // Schedule a save to localStorage after a short delay
  if (contentSaveInterval) {
    clearTimeout(contentSaveInterval)
  }
  contentSaveInterval = setTimeout(() => {
    tabsStore.saveTabs()
  }, 1000) // Save after 1 second of inactivity
}

// Initialize the textarea editor
const initEditor = (): void => {
  if (!textareaEditor.value) return

  // Apply settings to the textarea
  updateTextareaSettings()

  // Get the active tab content
  const activeTab = tabsStore.getActiveTab
  if (activeTab) {
    // Set the content
    textareaEditor.value.value = activeTab.content || ''

    // Focus the textarea
    textareaEditor.value.focus()
  }

  // Set up auto-save if enabled
  setupAutoSave()
}

// Set up auto-save
const setupAutoSave = (): void => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }

  if (settingsStore.autoSave) {
    autoSaveInterval = setInterval(() => {
      const activeTab = tabsStore.getActiveTab
      if (activeTab) {
        if (activeTab.isUnsaved) {
          saveFile()
        }
      }
    }, settingsStore.autoSaveInterval)
  }
}

// Update textarea settings
const updateTextareaSettings = (): void => {
  if (!textareaEditor.value) return

  // Apply font settings
  textareaEditor.value.style.fontSize = `${settingsStore.fontSize}px`
  textareaEditor.value.style.fontFamily = settingsStore.fontFamily

  // Apply tab size (indentation)
  textareaEditor.value.style.tabSize = `${settingsStore.tabSize}`

  // Apply word wrap
  textareaEditor.value.style.whiteSpace = settingsStore.wordWrap === 'on' ? 'pre-wrap' : 'pre'

  setupAutoSave()
}

// Function to save content before unloading
const saveBeforeUnload = (): void => {
  const activeTab = tabsStore.getActiveTab
  if (textareaEditor.value && activeTab) {
    // Make sure the current tab content is saved
    tabsStore.updateTabContent(activeTab.id, textareaEditor.value.value, true)
  }
}

// Update textarea content
const updateTextareaContent = (content: string): void => {
  if (textareaEditor.value) {
    textareaEditor.value.value = content
  }
}

// Lifecycle hooks
onMounted(() => {
  // Initialize the editor if there's an active tab
  const activeTab = tabsStore.getActiveTab
  if (activeTab) {
    initEditor()
  }

  // Apply the current theme
  applyTheme(settingsStore.theme)

  // Add event listener to save tabs before a window unloaded
  window.addEventListener('beforeunload', saveBeforeUnload)
})

onUnmounted(() => {
  // Save all tabs before unloading
  tabsStore.saveTabs()

  // Clear intervals
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }

  if (contentSaveInterval) {
    clearTimeout(contentSaveInterval)
    contentSaveInterval = null
  }

  // Remove event listener
  window.removeEventListener('beforeunload', saveBeforeUnload)
})

// Watch for changes in the active tab
watch(
  activeTabId,
  (newTabId) => {
    if (!textareaEditor.value) {
      if (newTabId) {
        initEditor()
      }
      return
    }

    // If we have a new tab, update the textarea content
    if (newTabId) {
      const tab = tabsStore.getTabById(newTabId)
      if (tab) {
        updateTextareaContent(tab.content || '')
        textareaEditor.value.focus()
      }
    }
  },
  { deep: true }
)

watch(
  () => settingsStore.theme,
  (newTheme) => {
    applyTheme(newTheme)
    updateTextareaSettings()
  }
)

// Watch for changes in turbo mode
watch(
  () => settingsStore.turboMode,
  () => {
    // Reapply the theme to update the CRT effect
    applyTheme(settingsStore.theme)
  }
)

watch(
  [
    () => settingsStore.fontSize,
    () => settingsStore.fontFamily,
    () => settingsStore.tabSize,
    () => settingsStore.insertSpaces,
    () => settingsStore.wordWrap,
    () => settingsStore.lineNumbers,
    () => settingsStore.autoSave,
    () => settingsStore.autoSaveInterval
  ],
  () => {
    updateTextareaSettings()
  }
)

// Expose methods to parent components
defineExpose({
  showErrorPopup,
  errorMessage,
  saveFile,
  saveFileAs,
  openFile,
  createNewTab,
  undo,
  redo,
  cut,
  copy,
  paste,
  selectAll,
  processBase64Encode,
  processBase64Decode,
  processJsonPrettify,
  processJsonCompact,
  processUrlEncode,
  processUrlDecode,
  processToUpperCase,
  processToLowerCase,
  processToTitleCase,
  processXmlPrettify,
  processXmlCompact,
  processSortLines,
  processDeduplicateLines,
  processReverseLines,
  processHtmlEncode,
  processHtmlDecode,
  processMd5Hash,
  processSha1Hash,
  processSha256Hash,
  processBcryptHash,
  processUnicodeEscape,
  processUnicodeUnescape,
  processJsonToYaml,
  processYamlToJson,
  processPropertiesToYaml,
  processYamlToProperties
})
</script>

<style scoped>
.editor-container {
  height: 100%;
  width: 100%;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.textarea-editor {
  height: 100%;
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  padding: 10px;
  background-color: var(--editorBackground);
  color: var(--editorForeground);
  font-family: var(--fontFamily, 'monospace');
  font-size: var(--fontSize, 14px);
  line-height: 1.5;
  tab-size: var(--tabSize, 4);
  overflow: auto;
  flex: 1;
}

.empty-editor {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-message {
  text-align: center;
}

.empty-message p {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.empty-message button {
  margin: 0.5rem;
}

/* Error Popup Styles */
.error-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.error-popup-content {
  background-color: var(--background);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  padding: 20px;
  color: var(--text);
}

.error-popup h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--error);
}

.error-popup p {
  margin-bottom: 15px;
}

.error-popup button {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background-color: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-popup button:hover {
  background-color: var(--menuHoverBackground);
}
</style>
