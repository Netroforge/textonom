<template>
  <div ref="editorContainer" class="editor-container">
    <div v-if="!activeTab" class="empty-editor">
      <div class="empty-message">
        <p>No open files</p>
        <div>
          <button @click="createNewTab">Create New File</button>
        </div>
        <div>
          <button @click="openFile">Open File</button>
        </div>
      </div>
    </div>
<!--    <div v-else ref="monacoContainer" class="monaco-container"></div>-->
    <div ref="monacoContainer" class="monaco-container"></div>

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
import { computed, onMounted, onUnmounted, ref, watch, reactive } from 'vue'
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

// Store models and editor states for each tab
const tabIdToMonacoModelMap = reactive(new Map())
const tabIdToMonacoEditorViewStateMap = reactive(new Map())

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
    const model = editor.getModel()
    const content = model.getValue()
    const result = await window.api.saveFile({
      filePath: activeTab.value.filePath,
      content
    })

    if (result.success) {
      const fileName = result.filePath.split('/').pop()
      tabsStore.updateTabAfterSave(activeTab.value.id, result.filePath, fileName)
    }
  } catch (error) {
    console.error('Error saving file:', error)
  }
}

// Save the current file as a new file
const saveFileAs = async () => {
  if (!activeTab.value) return

  try {
    const model = editor.getModel()
    const content = model.getValue()
    const result = await window.api.saveFileAs({
      content,
      currentPath: activeTab.value.filePath
    })

    if (result.success) {
      const fileName = result.filePath.split('/').pop()
      tabsStore.updateTabAfterSave(activeTab.value.id, result.filePath, fileName)
    }
  } catch (error) {
    console.error('Error saving file as:', error)
  }
}

const undo = async () => {
  if (!editor) {
    console.error('Editor not initialized')
    return
  }

  try {
    await editor.focus()
    await editor.trigger('keyboard', 'undo')
  } catch (error) {
    console.error('Undo action failed:', error)
  }
}

const redo = async () => {
  if (!editor) {
    console.error('Editor not initialized')
    return
  }

  try {
    await editor.focus()
    await editor.trigger('keyboard', 'redo')
  } catch (error) {
    console.error('Redo action failed:', error)
  }
}

const cut = async () => {
  if (!editor) {
    console.error('Editor not initialized')
    return
  }

  try {
    editor.focus()
    await editor.trigger('keyboard', 'editor.action.clipboardCutAction', null)
  } catch (error) {
    console.error('Cut action failed:', error)
  }
}

const copy = async () => {
  if (!editor) {
    console.error('Editor not initialized')
    return
  }

  try {
    editor.focus()
    await editor.trigger('keyboard', 'editor.action.clipboardCopyAction', null)
  } catch (error) {
    console.error('Copy action failed:', error)
  }
}

const paste = async () => {
  if (!editor) {
    console.error('Editor not initialized')
    return
  }

  try {
    editor.focus()
    await editor.trigger('keyboard', 'editor.action.clipboardPasteAction', null)
  } catch (error) {
    console.error('Paste action failed:', error)
  }
}

const selectAll = async () => {
  if (!editor) {
    console.error('Editor not initialized')
    return
  }

  try {
    editor.focus()
    await editor.trigger('keyboard', 'editor.action.selectAll', null)
  } catch (error) {
    console.error('Select all action failed:', error)
  }
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

// Detect language from file extension
const detectLanguage = (filename) => {
  if (!filename) return 'plaintext'

  const extension = filename.split('.').pop().toLowerCase()

  // Map common extensions to languages
  const languageMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    xml: 'xml',
    md: 'markdown',
    php: 'php',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    h: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    yaml: 'yaml',
    yml: 'yaml',
    ini: 'ini',
    bat: 'bat',
    ps1: 'powershell',
    txt: 'plaintext'
  }

  return languageMap[extension] || 'plaintext'
}

// Create or get a model for a tab
const getOrCreateModel = (tab) => {
  if (!tab) return null

  // Check if we already have a model for this tab
  if (tabIdToMonacoModelMap.has(tab.id)) {
    return tabIdToMonacoModelMap.get(tab.id)
  } else {
    // Detect language based on file extension
    const language = detectLanguage(tab.title)

    // Create a new model for this tab
    // Use the tab ID as part of the URI to ensure uniqueness
    const uri = monaco.Uri.parse(`file:///${tab.id}/${tab.title || 'untitled'}`)
    const model = monaco.editor.createModel(tab.content || '', language, uri)

    // Store the model
    tabIdToMonacoModelMap.set(tab.id, model)

    return model
  }
}

// Dispose of a model for a tab
const disposeModel = (tabId) => {
  if (tabIdToMonacoModelMap.has(tabId)) {
    const model = tabIdToMonacoModelMap.get(tabId)
    model.dispose()
    tabIdToMonacoModelMap.delete(tabId)
  }

  // Also remove any saved view state
  if (tabIdToMonacoEditorViewStateMap.has(tabId)) {
    tabIdToMonacoEditorViewStateMap.delete(tabId)
  }
}

// Initialize the editor
const initEditor = () => {
  if (!monacoContainer.value) return

  // Create the editor without a model initially
  editor = monaco.editor.create(monacoContainer.value, {
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

  // If there's an active tab, set its model
  if (activeTab.value) {
    const model = getOrCreateModel(activeTab.value)
    editor.setModel(model)
  }

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

// Function to save content before unloading
const saveBeforeUnload = () => {
  if (editor && activeTab.value) {
    // Make sure the current tab content is saved
    const model = editor.getModel()
    if (model) {
      tabsStore.updateTabContent(activeTab.value.id, model.getValue(), true)
    }
  }
}

// Lifecycle hooks

onMounted(() => {
  // Initialize the editor if there's an active tab
  if (activeTab.value) {
    initEditor()
  }

  // Apply the current theme
  applyTheme(settingsStore.theme)

  // Add event listener to save tabs before a window unloaded
  window.addEventListener('beforeunload', saveBeforeUnload)
})

onUnmounted(() => {
  // Dispose of the editor
  if (editor) {
    editor.dispose()
    editor = null
  }

  // Dispose of all models
  tabIdToMonacoModelMap.forEach((model) => {
    model.dispose()
  })
  tabIdToMonacoModelMap.clear()
  tabIdToMonacoEditorViewStateMap.clear()

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
  activeTab,
  (newTab, oldTab) => {
    if (!editor) {
      if (newTab) {
        initEditor()
      }
      return
    }

    // If we're switching from one tab to another
    if (oldTab && oldTab !== newTab) {
      // Save the view state of the old tab
      tabIdToMonacoEditorViewStateMap.set(oldTab.id, editor.saveViewState())
    }

    // If we have a new tab, set its model
    if (newTab) {
      const model = getOrCreateModel(newTab)
      editor.setModel(model)

      // Restore the view state if we have one
      const viewState = tabIdToMonacoEditorViewStateMap.get(newTab.id)
      if (viewState) {
        editor.restoreViewState(viewState)
      }

      editor.focus()
    }
  },
  { deep: true }
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

// Watch for tab closures to dispose of models
watch(
  () => tabsStore.tabs.length,
  (newLength, oldLength) => {
    // If the number of tabs decreased, a tab was closed
    if (newLength < oldLength) {
      // Find which tab was closed by comparing the current tabs with the models we have
      const currentTabIds = new Set(tabsStore.tabs.map((tab) => tab.id))

      // Find models that don't have a corresponding tab anymore
      for (const tabId of tabIdToMonacoModelMap.keys()) {
        if (!currentTabIds.has(tabId)) {
          // This model's tab was closed, dispose it
          disposeModel(tabId)
        }
      }
    }
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
}

.monaco-container {
  height: 100%;
  width: 100%;
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
