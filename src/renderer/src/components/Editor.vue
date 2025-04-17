<template>
  <div ref="editorContainer" class="editor-container">
    <div v-if="!activeTab" class="empty-editor">
      <div class="empty-message">
        <p>No open files</p>
        <button @click="createNewTab">Create New File</button>
        <button @click="openFile">Open File</button>
      </div>
    </div>
    <div v-else ref="monacoContainer" class="monaco-container"></div>

    <!-- Error Popup -->
    <div v-if="showErrorPopup" class="error-popup">
      <div class="error-popup-content">
        <h3>Error</h3>
        <p>{{ errorMessage }}</p>
        <button @click="closeErrorPopup">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { useTabsStore } from '../store/tabsStore'
import { useSettingsStore } from '../store/settingsStore'
import { applyTheme } from '../styles/themes'
import transformations from '../transformations'

// Refs
const editorContainer = ref(null)
const monacoContainer = ref(null)
let editor = null
let autoSaveInterval = null
let contentSaveInterval = null

// Get stores
const tabsStore = useTabsStore()
const settingsStore = useSettingsStore()

// Computed properties
const activeTab = computed(() => tabsStore.getActiveTab)

// Show error
const showErrorPopup = ref(false)
const errorMessage = ref('')

// Create a new tab
const createNewTab = () => {
  tabsStore.addTab({
    title: 'Untitled',
    content: '',
    isUnsaved: true
  })
}

// Open a file
const openFile = async () => {
  try {
    const result = await window.api.openFile()
    if (result.success) {
      tabsStore.addTab({
        title: result.filePath.split('/').pop(),
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
const saveFile = async () => {
  if (!activeTab.value) return

  try {
    const content = editor.getValue()
    const result = await window.api.saveFile({
      filePath: activeTab.value.filePath,
      content
    })

    if (result.success) {
      const fileName = result.filePath.split('/').pop()
      tabsStore.updateTabAfterSave(activeTab.value.id, result.filePath, fileName)

      // Force update the editor model to ensure it has the latest content
      // This ensures the content comparison works correctly
      const model = editor.getModel()
      if (model && model.getValue() !== content) {
        model.setValue(content)
      }
    }
  } catch (error) {
    console.error('Error saving file:', error)
  }
}

// Save the current file as a new file
const saveFileAs = async () => {
  if (!activeTab.value) return

  try {
    const content = editor.getValue()
    const result = await window.api.saveFileAs({
      content,
      currentPath: activeTab.value.filePath
    })

    if (result.success) {
      const fileName = result.filePath.split('/').pop()
      tabsStore.updateTabAfterSave(activeTab.value.id, result.filePath, fileName)

      // Force update the editor model to ensure it has the latest content
      // This ensures the content comparison works correctly
      const model = editor.getModel()
      if (model && model.getValue() !== content) {
        model.setValue(content)
      }
    }
  } catch (error) {
    console.error('Error saving file as:', error)
  }
}

const undo = async () => {
  await editor.trigger('undo...', 'undo')
}

const redo = async () => {
  await editor.trigger('redo...', 'redo')
}

const processBase64Encode = async () => {
  processTransformation(transformations.base64Encode)
}

const processBase64Decode = async () => {
  processTransformation(transformations.base64Decode)
}

const processJsonPrettify = async () => {
  processTransformation(transformations.jsonPrettify)
}

const processJsonCompact = async () => {
  processTransformation(transformations.jsonCompact)
}

const processUrlEncode = async () => {
  processTransformation(transformations.urlEncode)
}

const processUrlDecode = async () => {
  processTransformation(transformations.urlDecode)
}

const processToUpperCase = async () => {
  processTransformation(transformations.toUpperCase)
}

const processToLowerCase = async () => {
  processTransformation(transformations.toLowerCase)
}

const processToTitleCase = async () => {
  processTransformation(transformations.toTitleCase)
}

const processXmlPrettify = async () => {
  processTransformation(transformations.xmlPrettify)
}

const processXmlCompact = async () => {
  processTransformation(transformations.xmlCompact)
}

const processSortLines = async () => {
  processTransformation(transformations.sortLines)
}

const processDeduplicateLines = async () => {
  processTransformation(transformations.deduplicateLines)
}

const processReverseLines = async () => {
  processTransformation(transformations.reverseLines)
}

const processHtmlEncode = async () => {
  processTransformation(transformations.htmlEncode)
}

const processHtmlDecode = async () => {
  processTransformation(transformations.htmlDecode)
}

const processMd5Hash = async () => {
  processTransformation(transformations.md5Hash)
}

const processSha1Hash = async () => {
  processTransformation(transformations.sha1Hash)
}

const processSha256Hash = async () => {
  processTransformation(transformations.sha256Hash)
}

const processBcryptHash = async () => {
  processTransformation(transformations.bcryptHash)
}

const processUnicodeEscape = async () => {
  processTransformation(transformations.unicodeEscape)
}

const processUnicodeUnescape = async () => {
  processTransformation(transformations.unicodeUnescape)
}

const processJsonToYaml = async () => {
  processTransformation(transformations.jsonToYaml)
}

const processYamlToJson = async () => {
  processTransformation(transformations.yamlToJson)
}

const processPropertiesToYaml = async () => {
  processTransformation(transformations.propertiesFileToYaml)
}

const processYamlToProperties = async () => {
  processTransformation(transformations.yamlToPropertiesFile)
}

const processTransformation = (transformFn) => {
  if (!editor || !editor.getModel()) return

  try {
    // Get the current selection or use an entire document
    const selection = editor.getSelection()
    const model = editor.getModel()
    let text

    if (selection && !selection.isEmpty()) {
      // Transform selected text only
      text = model.getValueInRange(selection)
      const transformedText = transformFn(text)

      // Apply the transformation as an edit operation to preserve undo history
      editor.executeEdits('transformation', [{ range: selection, text: transformedText }])
    } else {
      // Transform entire document
      text = model.getValue()
      const transformedText = transformFn(text)

      // Calculate the full document range
      const fullRange = model.getFullModelRange()

      // Apply the transformation as an edit operation to preserve undo history
      editor.executeEdits('transformation', [{ range: fullRange, text: transformedText }])
    }
  } catch (error) {
    console.error('Transformation failed:', error)
    showErrorPopup.value = true
    errorMessage.value = error.message
  }
}

const closeErrorPopup = () => {
  showErrorPopup.value = false
  errorMessage.value = ''
}

// Initialize the editor
const initEditor = () => {
  if (!monacoContainer.value) return

  // Create the editor
  editor = monaco.editor.create(monacoContainer.value, {
    value: activeTab.value?.content || '',
    language: 'plaintext',
    theme: settingsStore.theme === 'light' ? 'vs' : 'vs-dark',
    automaticLayout: true,
    fontSize: settingsStore.fontSize,
    fontFamily: settingsStore.fontFamily,
    tabSize: settingsStore.tabSize,
    insertSpaces: settingsStore.insertSpaces,
    wordWrap: settingsStore.wordWrap,
    lineNumbers: settingsStore.lineNumbers,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: true
    },
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible'
    },
    quickSuggestions: false
  })

  // Listen for content changes
  editor.onDidChangeModelContent(() => {
    if (!activeTab.value) return

    // Update tab content in store without triggering a re-render of the editor
    // This prevents the cursor from jumping to the beginning of the file
    tabsStore.updateTabContent(activeTab.value.id, editor.getValue(), false)

    // Schedule a save to localStorage after a short delay
    // This ensures content is saved even if the user doesn't switch tabs
    if (contentSaveInterval) {
      clearTimeout(contentSaveInterval)
    }
    contentSaveInterval = setTimeout(() => {
      tabsStore.saveTabs()
    }, 1000) // Save after 1 second of inactivity
  })

  // Set up auto-save if enabled
  setupAutoSave()

  // Focus the editor
  //editor.focus()
}

// Set up auto-save
const setupAutoSave = () => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
  }

  if (settingsStore.autoSave) {
    autoSaveInterval = setInterval(() => {
      if (activeTab.value?.isUnsaved) {
        saveFile()
      }
    }, settingsStore.autoSaveInterval)
  }
}

// Update editor settings
const updateEditorSettings = () => {
  if (!editor) return

  editor.updateOptions({
    fontSize: settingsStore.fontSize,
    fontFamily: settingsStore.fontFamily,
    tabSize: settingsStore.tabSize,
    insertSpaces: settingsStore.insertSpaces,
    wordWrap: settingsStore.wordWrap,
    lineNumbers: settingsStore.lineNumbers,
    theme: settingsStore.theme === 'light' ? 'vs' : 'vs-dark'
  })

  setupAutoSave()
}

// Function to save content before unload
const saveBeforeUnload = () => {
  if (editor && activeTab.value) {
    // Make sure the current tab content is saved
    tabsStore.updateTabContent(activeTab.value.id, editor.getValue(), true)
  }
}

// Lifecycle hooks

onMounted(() => {
  // Initialize the editor if there's an active tab
  if (activeTab.value) {
    initEditor()
  } else if (tabsStore.tabs.length === 0) {
    // Create a new tab if there are no tabs
    createNewTab()
  }

  // Apply the current theme
  applyTheme(settingsStore.theme)

  // Add event listener to save tabs before window unloads
  window.addEventListener('beforeunload', saveBeforeUnload)
})

onUnmounted(() => {
  // Dispose the editor
  if (editor) {
    editor.dispose()
    editor = null
  }

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

// Watch for changes in active tab
watch(
  activeTab,
  (newTab, oldTab) => {
    // If we're switching from one tab to another, ensure the old tab's content is saved
    if (oldTab && editor) {
      // Save the content of the previous tab before switching
      const content = editor.getValue()
      tabsStore.updateTabContent(oldTab.id, content, true)
    }

    if (!editor) {
      if (newTab) {
        initEditor()
      }
      return
    }

    if (oldTab !== newTab) {
      editor.focus()
    }
  },
  { deep: true }
)

// Watch for changes in tab content
watch(
  () => activeTab.value?.content,
  (newContent, oldContent) => {
    if (!editor || !activeTab.value || !newContent) return

    console.log('newContent', newContent)
    // Save current cursor position and selection
    const currentPosition = editor.getPosition()
    const currentSelection = editor.getSelection()

    // Update content
    const model = editor.getModel()
    const currentValue = model.getValue()

    if (currentValue !== newContent) {
      // Force update the model content
      model.setValue(newContent)

      // Restore cursor position and selection if they were valid
      if (currentPosition && currentPosition.lineNumber <= model.getLineCount()) {
        editor.setPosition(currentPosition)
        if (currentSelection) {
          editor.setSelection(currentSelection)
        }
      }
    }
  }
)

watch(
  () => settingsStore.theme,
  (newTheme) => {
    applyTheme(newTheme)
    updateEditorSettings()
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
    updateEditorSettings()
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
}

.monaco-container {
  height: 100%;
  width: 100%;
}

.empty-editor {
  height: 100%;
  width: 100%;
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
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 80%;
  min-width: 300px;
}

.error-popup-content {
  color: #721c24;
}

.error-popup h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.error-popup p {
  margin-bottom: 15px;
}

.error-popup button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.error-popup button:hover {
  background-color: #c82333;
}
</style>
