<template>
  <div class="editor-container" ref="editorContainer">
    <div v-if="!activeTab" class="empty-editor">
      <div class="empty-message">
        <p>No open files</p>
        <button @click="createNewTab">Create New File</button>
        <button @click="openFile">Open File</button>
      </div>
    </div>
    <div v-else ref="monacoContainer" class="monaco-container"></div>
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

const processBase64encode = async () => {
  try {
    const newContent = transformations.base64Encode(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Base64 encoding failed:', error)
  }
}

const processBase64decode = async () => {
  try {
    const newContent = transformations.base64Decode(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Base64 decoding failed:', error)
  }
}

const processJsonPrettify = async () => {
  try {
    const newContent = transformations.jsonPrettify(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('JSON prettify failed:', error)
  }
}

const processJsonCompact = async () => {
  try {
    const newContent = transformations.jsonCompact(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('JSON compact failed:', error)
  }
}

const processUrlEncode = async () => {
  try {
    const newContent = transformations.urlEncode(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('URL encoding failed:', error)
  }
}

const processUrlDecode = async () => {
  try {
    const newContent = transformations.urlDecode(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('URL decoding failed:', error)
  }
}

const processToUpperCase = async () => {
  try {
    const newContent = transformations.toUpperCase(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('To uppercase failed:', error)
  }
}

const processToLowerCase = async () => {
  try {
    const newContent = transformations.toLowerCase(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('To lowercase failed:', error)
  }
}

const processToTitleCase = async () => {
  try {
    const newContent = transformations.toTitleCase(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('To title case failed:', error)
  }
}

const processXmlPrettify = async () => {
  try {
    const newContent = transformations.xmlPrettify(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('XML prettify failed:', error)
  }
}

const processXmlCompact = async () => {
  try {
    const newContent = transformations.xmlCompact(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('XML compact failed:', error)
  }
}

const processSortLines = async () => {
  try {
    const newContent = transformations.sortLines(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Sort lines failed:', error)
  }
}

const processDeduplicateLines = async () => {
  try {
    const newContent = transformations.deduplicateLines(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Deduplicate lines failed:', error)
  }
}

const processReverseLines = async () => {
  try {
    const newContent = transformations.reverseLines(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Reverse lines failed:', error)
  }
}

const processHtmlEncode = async () => {
  try {
    const newContent = transformations.htmlEncode(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('HTML encoding failed:', error)
  }
}

const processHtmlDecode = async () => {
  try {
    const newContent = transformations.htmlDecode(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('HTML decoding failed:', error)
  }
}

const processMd5Hash = async () => {
  try {
    const newContent = transformations.md5Hash(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('MD5 hash failed:', error)
  }
}

const processSha1Hash = async () => {
  try {
    const newContent = transformations.sha1Hash(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('SHA-1 hash failed:', error)
  }
}

const processSha256Hash = async () => {
  try {
    const newContent = transformations.sha256Hash(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('SHA-256 hash failed:', error)
  }
}

const processBcryptHash = async () => {
  try {
    const newContent = transformations.bcryptHash(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Bcrypt hash failed:', error)
  }
}

const processUnicodeEscape = async () => {
  try {
    const newContent = transformations.unicodeEscape(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Unicode escape failed:', error)
  }
}

const processUnicodeUnescape = async () => {
  try {
    const newContent = transformations.unicodeUnescape(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Unicode unescape failed:', error)
  }
}

const processJsonToYaml = async () => {
  try {
    const newContent = transformations.jsonToYaml(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('JSON to YAML conversion failed:', error)
  }
}

const processYamlToJson = async () => {
  try {
    const newContent = transformations.yamlToJson(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('YAML to JSON conversion failed:', error)
  }
}

const processPropertiesToYaml = async () => {
  try {
    const newContent = transformations.propertiesFileToYaml(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('Properties to YAML conversion failed:', error)
  }
}

const processYamlToProperties = async () => {
  try {
    const newContent = transformations.yamlToPropertiesFile(editor.getModel().getValue())
    editor.getModel().setValue(newContent)
  } catch (error) {
    console.error('YAML to Properties conversion failed:', error)
  }
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
  saveFile,
  saveFileAs,
  openFile,
  createNewTab,
  undo,
  redo,
  processBase64encode,
  processBase64decode,
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
</style>
