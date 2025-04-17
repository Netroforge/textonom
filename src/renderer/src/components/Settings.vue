<template>
  <div class="settings-dialog" @click.self="close">
    <div class="settings-content">
      <div class="settings-header">
        <h2>Settings</h2>
        <button @click="close">✕</button>
      </div>

      <!-- Theme Settings -->
      <div class="settings-section">
        <h3 class="settings-section-title">Theme</h3>
        <div class="settings-row">
          <label class="settings-label">Theme</label>
          <div class="settings-control">
            <select v-model="theme">
              <option :value="THEMES.LIGHT">Light</option>
              <option :value="THEMES.DARK">Dark</option>
              <option :value="THEMES.CYBERPUNK">Cyberpunk</option>
              <option :value="THEMES.CYBERPUNK_TURBO">Cyberpunk Turbo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Font Settings -->
      <div class="settings-section">
        <h3 class="settings-section-title">Font</h3>
        <div class="settings-row">
          <label class="settings-label">Font Family</label>
          <div class="settings-control">
            <select v-model="fontFamily">
              <option value="Consolas, 'Courier New', monospace">Consolas</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="'Fira Code', monospace">Fira Code</option>
              <option value="'Source Code Pro', monospace">Source Code Pro</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>
        </div>
        <div class="settings-row">
          <label class="settings-label">Font Size</label>
          <div class="settings-control">
            <input v-model="fontSize" type="number" min="8" max="32" />
          </div>
        </div>
      </div>

      <!-- Editor Settings -->
      <div class="settings-section">
        <h3 class="settings-section-title">Editor</h3>
        <div class="settings-row">
          <label class="settings-label">Tab Size</label>
          <div class="settings-control">
            <input v-model="tabSize" type="number" min="1" max="8" />
          </div>
        </div>
        <div class="settings-row">
          <label class="settings-label">Insert Spaces</label>
          <div class="settings-control">
            <input v-model="insertSpaces" type="checkbox" />
          </div>
        </div>
        <div class="settings-row">
          <label class="settings-label">Word Wrap</label>
          <div class="settings-control">
            <select v-model="wordWrap">
              <option value="off">Off</option>
              <option value="on">On</option>
              <option value="wordWrapColumn">Wrap at Column</option>
              <option value="bounded">Bounded</option>
            </select>
          </div>
        </div>
        <div class="settings-row">
          <label class="settings-label">Line Numbers</label>
          <div class="settings-control">
            <select v-model="lineNumbers">
              <option value="on">On</option>
              <option value="off">Off</option>
              <option value="relative">Relative</option>
              <option value="interval">Interval</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Auto Save Settings -->
      <div class="settings-section">
        <h3 class="settings-section-title">Auto Save</h3>
        <div class="settings-row">
          <label class="settings-label">Enable Auto Save</label>
          <div class="settings-control">
            <input v-model="autoSave" type="checkbox" />
          </div>
        </div>
        <div class="settings-row">
          <label class="settings-label">Auto Save Interval (ms)</label>
          <div class="settings-control">
            <input
              v-model="autoSaveInterval"
              type="number"
              min="1000"
              max="60000"
              step="1000"
              :disabled="!autoSave"
            />
          </div>
        </div>
      </div>

      <div class="settings-footer">
        <button @click="resetSettings">Reset to Defaults</button>
        <button @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSettingsStore, THEMES } from '../store/settingsStore'

// Define props and emits
const emit = defineEmits(['close'])

// Get the settings store
const settingsStore = useSettingsStore()

// Create reactive refs for all settings
const theme = ref(settingsStore.theme)
const fontSize = ref(settingsStore.fontSize)
const fontFamily = ref(settingsStore.fontFamily)
const tabSize = ref(settingsStore.tabSize)
const insertSpaces = ref(settingsStore.insertSpaces)
const wordWrap = ref(settingsStore.wordWrap)
const lineNumbers = ref(settingsStore.lineNumbers)
const autoSave = ref(settingsStore.autoSave)
const autoSaveInterval = ref(settingsStore.autoSaveInterval)

// Watch for changes and update the store
watch(theme, (newValue) => {
  settingsStore.setTheme(newValue)
})

watch(fontSize, (newValue) => {
  settingsStore.setFontSize(Number(newValue))
})

watch(fontFamily, (newValue) => {
  settingsStore.setFontFamily(newValue)
})

watch(tabSize, (newValue) => {
  settingsStore.setTabSize(Number(newValue))
})

watch(insertSpaces, (newValue) => {
  settingsStore.setInsertSpaces(newValue)
})

watch(wordWrap, (newValue) => {
  settingsStore.setWordWrap(newValue)
})

watch(lineNumbers, (newValue) => {
  settingsStore.setLineNumbers(newValue)
})

watch(autoSave, (newValue) => {
  settingsStore.setAutoSave(newValue)
})

watch(autoSaveInterval, (newValue) => {
  settingsStore.setAutoSaveInterval(Number(newValue))
})

// Reset settings to defaults
const resetSettings = () => {
  settingsStore.resetSettings()

  // Update local refs
  theme.value = settingsStore.theme
  fontSize.value = settingsStore.fontSize
  fontFamily.value = settingsStore.fontFamily
  tabSize.value = settingsStore.tabSize
  insertSpaces.value = settingsStore.insertSpaces
  wordWrap.value = settingsStore.wordWrap
  lineNumbers.value = settingsStore.lineNumbers
  autoSave.value = settingsStore.autoSave
  autoSaveInterval.value = settingsStore.autoSaveInterval
}

// Close the settings dialog
const close = () => {
  emit('close')
}
</script>

<style scoped>
/* Settings dialog styling is in global.css */
</style>
