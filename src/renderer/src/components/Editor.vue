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
    <div ref="monacoContainer" class="monaco-container"></div>

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
import * as monaco from 'monaco-editor'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
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
const monacoContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let autoSaveInterval: ReturnType<typeof setInterval> | null = null
let contentSaveInterval: ReturnType<typeof setInterval> | null = null

// Store models and editor states for each tab
const tabIdToMonacoModelMap = new Map<string, monaco.editor.ITextModel>()
const tabIdToMonacoEditorViewStateMap = new Map<string, monaco.editor.ICodeEditorViewState | null>()

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
    const model = editor.getModel()
    const content = model.getValue()
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
    const model = editor.getModel()
    const content = model.getValue()
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

const undo = async (): Promise<void> => {
  if (!editor) {
    console.error('Editor not initialized')
    return
  }

  try {
    await editor.focus()
    await editor.trigger('keyboard', 'undo', null)
  } catch (error) {
    console.error('Undo action failed:', error)
  }
}

const redo = async (): Promise<void> => {
  if (!editor) {
    console.error('Editor not initialized')
    return
  }

  try {
    await editor.focus()
    await editor.trigger('keyboard', 'redo', null)
  } catch (error) {
    console.error('Redo action failed:', error)
  }
}

const cut = async (): Promise<void> => {
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

const copy = async (): Promise<void> => {
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

const paste = async (): Promise<void> => {
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

const selectAll = async (): Promise<void> => {
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

const processBase64Encode = async (): Promise<void> => {
  processTransformation(transformations.base64Encode)
}

const processBase64Decode = async (): Promise<void> => {
  processTransformation(transformations.base64Decode)
}

const processJsonPrettify = async (): Promise<void> => {
  processTransformation(transformations.jsonPrettify)
}

const processJsonCompact = async (): Promise<void> => {
  processTransformation(transformations.jsonCompact)
}

const processUrlEncode = async (): Promise<void> => {
  processTransformation(transformations.urlEncode)
}

const processUrlDecode = async (): Promise<void> => {
  processTransformation(transformations.urlDecode)
}

const processToUpperCase = async (): Promise<void> => {
  processTransformation(transformations.toUpperCase)
}

const processToLowerCase = async (): Promise<void> => {
  processTransformation(transformations.toLowerCase)
}

const processToTitleCase = async (): Promise<void> => {
  processTransformation(transformations.toTitleCase)
}

const processXmlPrettify = async (): Promise<void> => {
  processTransformation(transformations.xmlPrettify)
}

const processXmlCompact = async (): Promise<void> => {
  processTransformation(transformations.xmlCompact)
}

const processSortLines = async (): Promise<void> => {
  processTransformation(transformations.sortLines)
}

const processDeduplicateLines = async (): Promise<void> => {
  processTransformation(transformations.deduplicateLines)
}

const processReverseLines = async (): Promise<void> => {
  processTransformation(transformations.reverseLines)
}

const processHtmlEncode = async (): Promise<void> => {
  processTransformation(transformations.htmlEncode)
}

const processHtmlDecode = async (): Promise<void> => {
  processTransformation(transformations.htmlDecode)
}

const processMd5Hash = async (): Promise<void> => {
  processTransformation(transformations.md5Hash)
}

const processSha1Hash = async (): Promise<void> => {
  processTransformation(transformations.sha1Hash)
}

const processSha256Hash = async (): Promise<void> => {
  processTransformation(transformations.sha256Hash)
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
const applyBcryptHash = (rounds: number): void => {
  // Create a function that will use the specified rounds
  const bcryptWithCustomRounds = async (text: string): Promise<string> =>
    transformations.bcryptHash(text, rounds)
  processTransformation(bcryptWithCustomRounds)
}

const processUnicodeEscape = async (): Promise<void> => {
  processTransformation(transformations.unicodeEscape)
}

const processUnicodeUnescape = async (): Promise<void> => {
  processTransformation(transformations.unicodeUnescape)
}

const processJsonToYaml = async (): Promise<void> => {
  processTransformation(transformations.jsonToYaml)
}

const processYamlToJson = async (): Promise<void> => {
  processTransformation(transformations.yamlToJson)
}

const processPropertiesToYaml = async (): Promise<void> => {
  processTransformation(transformations.propertiesFileToYaml)
}

const processYamlToProperties = async (): Promise<void> => {
  processTransformation(transformations.yamlToPropertiesFile)
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
  if (!editor) return

  const model = editor.getModel()
  if (!model) return

  // Get a transformation name for display
  const transformationName = getTransformationName(transformFn)

  // Start transformation and show overlay
  transformationStore.startTransformation(transformationName)

  try {
    // Get the current selection or use an entire document
    const selection = editor.getSelection()
    let text
    let transformedText

    // Process the transformation
    if (selection && !selection.isEmpty()) {
      // Transform selected text only
      text = model.getValueInRange(selection)
      transformedText = await transformFn(text)
    } else {
      // Transform entire document
      text = model.getValue()
      transformedText = await transformFn(text)
    }

    // Add a small delay to ensure the animation is visible even for quick transformations
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Apply the transformation
    if (selection && !selection.isEmpty()) {
      // Apply the transformation as an edit operation to preserve undo history
      editor.executeEdits('transformation', [{ range: selection, text: transformedText }])
    } else {
      // Calculate the full document range
      const fullRange = model.getFullModelRange()

      // Apply the transformation as an edit operation to preserve undo history
      editor.executeEdits('transformation', [{ range: fullRange, text: transformedText }])
    }

    editor.focus()

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

// Detect language from file extension
const detectLanguage = (filename: string | null): string => {
  if (!filename) return 'plaintext'

  // Handle filenames with multiple dots correctly
  const parts = filename.split('.')
  const extension = parts.length > 1 ? parts.pop().toLowerCase() : ''

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
const getOrCreateModel = (tabId: string | null): monaco.editor.ITextModel | null => {
  if (!tabId) return null

  // Check if we already have a model for this tab
  if (tabIdToMonacoModelMap.has(tabId)) {
    return tabIdToMonacoModelMap.get(tabId)
  } else {
    const tab = tabsStore.getTabById(tabId)
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
const disposeModel = (tabId): void => {
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
const initEditor = (): void => {
  if (!monacoContainer.value) return

  // Create the editor without a model initially
  editor = monaco.editor.create(monacoContainer.value, {
    theme: settingsStore.theme === 'light' ? 'vs' : 'vs-dark',
    automaticLayout: true,
    smoothScrolling: true,
    fontSize: settingsStore.fontSize,
    fontFamily: settingsStore.fontFamily,
    tabSize: settingsStore.tabSize,
    insertSpaces: settingsStore.insertSpaces,
    wordWrap: settingsStore.wordWrap,
    lineNumbers: settingsStore.lineNumbers,
    scrollBeyondLastLine: true,
    minimap: {
      enabled: true
    },
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible'
    },
    quickSuggestions: false
  })

  const activeTab = tabsStore.getActiveTab
  // If there's an active tab, set its model
  if (activeTab) {
    const activeTab = tabsStore.getActiveTab
    const model = getOrCreateModel(activeTab.id)
    editor.setModel(model)
  }

  // Listen for content changes
  editor.onDidChangeModelContent(() => {
    if (!tabsStore.getActiveTabId) return

    // Get the current model and its content
    const model = editor.getModel()
    if (!model) return

    const content = model.getValue()

    // Update tab content in store without triggering a re-render of the editor
    // This prevents the cursor from jumping to the beginning of the file
    tabsStore.updateTabContent(tabsStore.getActiveTabId, content, false)

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

// Update editor settings
const updateEditorSettings = (): void => {
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
const saveBeforeUnload = (): void => {
  const activeTab = tabsStore.getActiveTab
  if (editor && activeTab) {
    // Make sure the current tab content is saved
    const model = editor.getModel()
    if (model) {
      tabsStore.updateTabContent(activeTab.id, model.getValue(), true)
    }
  }
}

// Configure Monaco Editor workers
const configureMonacoWorkers = (): undefined => {
  // Configure Monaco Editor workers
  window.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker()
      }
      return new editorWorker()
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  // Configure Monaco workers before initializing the editor
  configureMonacoWorkers()

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
  activeTabId,
  (newTabId, oldTabId) => {
    if (!editor) {
      if (newTabId) {
        initEditor()
      }
      return
    }

    // If we're switching from one tab to another
    if (oldTabId && oldTabId !== newTabId) {
      // Save the view state of the old tab
      tabIdToMonacoEditorViewStateMap.set(oldTabId, editor.saveViewState())
    }

    // If we have a new tab, set its model
    if (newTabId) {
      const model = getOrCreateModel(newTabId)
      editor.setModel(model)

      // Restore the view state if we have one
      const viewState = tabIdToMonacoEditorViewStateMap.get(newTabId)
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
