<template>
  <div class="settings-dialog" @click.self="close">
    <div class="settings-content">
      <div class="settings-header">
        <h2>Settings</h2>
        <button @click="close">✕</button>
      </div>

      <div class="settings-layout">
        <!-- Settings Navigation Sidebar -->
        <div class="settings-sidebar">
          <div
            v-for="section in sections"
            :key="section.id"
            class="settings-nav-item"
            :class="{ active: activeSection === section.id }"
            @click="activeSection = section.id"
          >
            {{ section.title }}
          </div>
        </div>

        <!-- Settings Content Area -->
        <div class="settings-sections-container">
          <!-- Theme Settings -->
          <div v-show="activeSection === 'theme'" class="settings-section">
            <h3 class="settings-section-title">Theme</h3>
            <div class="settings-section-content">
              <div class="settings-row">
                <label class="settings-label">Theme</label>
                <div class="settings-control">
                  <select v-model="theme">
                    <option :value="THEMES.LIGHT">Light</option>
                    <option :value="THEMES.DARK">Dark</option>
                    <option :value="THEMES.CYBERPUNK">Cyberpunk</option>
                  </select>
                </div>
              </div>
              <div class="settings-row">
                <label class="settings-label">Turbo Mode</label>
                <div class="settings-control">
                  <input v-model="turboMode" type="checkbox" />
                  <span class="settings-description">Enable</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Font Settings -->
          <div v-show="activeSection === 'font'" class="settings-section">
            <h3 class="settings-section-title">Font</h3>
            <div class="settings-section-content">
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
          </div>

          <!-- Editor Settings -->
          <div v-show="activeSection === 'editor'" class="settings-section">
            <h3 class="settings-section-title">Editor</h3>
            <div class="settings-section-content">
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
          </div>

          <!-- Auto Save Settings -->
          <div v-show="activeSection === 'autosave'" class="settings-section">
            <h3 class="settings-section-title">Auto Save</h3>
            <div class="settings-section-content">
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
          </div>

          <!-- File Settings -->
          <div v-show="activeSection === 'files'" class="settings-section">
            <h3 class="settings-section-title">Files</h3>
            <div class="settings-section-content">
              <div class="settings-row">
                <label class="settings-label">Last Directory</label>
                <div class="settings-control">
                  <input v-model="lastDirectory" type="text" readonly />
                </div>
              </div>
            </div>
          </div>

          <!-- Auto Update Settings -->
          <div v-show="activeSection === 'updates'" class="settings-section">
            <h3 class="settings-section-title">Updates</h3>
            <div class="settings-section-content">
              <div class="settings-row">
                <label class="settings-label">Enable Auto Update</label>
                <div class="settings-control">
                  <input v-model="autoUpdate" type="checkbox" />
                </div>
              </div>
              <div class="settings-row">
                <label class="settings-label">Check for Updates on Startup</label>
                <div class="settings-control">
                  <input
                    v-model="checkForUpdatesOnStartup"
                    type="checkbox"
                    :disabled="!autoUpdate"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Transformations Settings -->
          <div v-show="activeSection === 'transformations'" class="settings-section">
            <h3 class="settings-section-title">Transformations</h3>
            <div class="settings-section-content">
              <div class="settings-row">
                <label class="settings-label">Bcrypt Rounds (Cost Factor)</label>
                <div class="settings-control">
                  <input
                    v-model="bcryptRounds"
                    type="number"
                    min="1"
                    max="20"
                    title="Higher values are more secure but slower. Default is 12."
                  />
                </div>
              </div>
              <div class="settings-info">
                <p>
                  Higher rounds provide stronger security but take longer to compute. The default
                  value of 12 is a good balance between security and performance.
                </p>
              </div>
            </div>
          </div>

          <!-- Hotkeys Settings -->
          <div v-show="activeSection === 'hotkeys'" class="settings-section">
            <h3 class="settings-section-title">Keyboard Shortcuts</h3>
            <div class="settings-section-content">
              <HotkeySettings />
            </div>
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

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useSettingsStore, THEMES } from '../store/settingsStore'
import HotkeySettings from './HotkeySettings.vue'
import { ThemeType } from '../types'

// Define props and emits
const emit = defineEmits<{
  close: []
}>()

// Get the settings store
const settingsStore = useSettingsStore()

// Define sections for navigation
interface Section {
  id: string
  title: string
}

const sections: Section[] = [
  { id: 'theme', title: 'Theme' },
  { id: 'font', title: 'Font' },
  { id: 'editor', title: 'Editor' },
  { id: 'autosave', title: 'Auto Save' },
  { id: 'files', title: 'Files' },
  { id: 'updates', title: 'Updates' },
  { id: 'transformations', title: 'Transformations' },
  { id: 'hotkeys', title: 'Keyboard Shortcuts' }
]

// Define available font options
const fontOptions: string[] = [
  "Consolas, 'Courier New', monospace",
  "'Courier New', monospace",
  "'Fira Code', monospace",
  "'Source Code Pro', monospace",
  'monospace'
]

// Function to find the closest matching font option
const findMatchingFontOption = (fontFamily: string): string => {
  // Try to find the exact match first
  const exactMatch = fontOptions.find((option) => option === fontFamily)
  if (exactMatch) return exactMatch

  // If no exact match, try to find a partial match
  const partialMatch = fontOptions.find((option) => {
    // Extract the primary font name from the option
    const primaryFont = option.split(',')[0].trim().replace(/["']/g, '')
    return fontFamily.includes(primaryFont)
  })

  return partialMatch || fontOptions[0] // Default to first option if no match found
}

// Track an active section
const activeSection = ref<string>('theme')

// Create reactive refs for all settings
const theme = ref<ThemeType>(settingsStore.theme)
const turboMode = ref<boolean>(settingsStore.turboMode)
const fontSize = ref<number>(settingsStore.fontSize)
const fontFamily = ref<string>(findMatchingFontOption(settingsStore.fontFamily))
const tabSize = ref<number>(settingsStore.tabSize)
const insertSpaces = ref<boolean>(settingsStore.insertSpaces)
const wordWrap = ref<'on' | 'off' | 'wordWrapColumn' | 'bounded'>(settingsStore.wordWrap)
const lineNumbers = ref<'on' | 'off' | 'relative' | 'interval'>(settingsStore.lineNumbers)
const autoSave = ref<boolean>(settingsStore.autoSave)
const autoSaveInterval = ref<number>(settingsStore.autoSaveInterval)
const autoUpdate = ref<boolean>(settingsStore.autoUpdate)
const checkForUpdatesOnStartup = ref<boolean>(settingsStore.checkForUpdatesOnStartup)
const lastDirectory = ref<string>(settingsStore.lastDirectory)
const bcryptRounds = ref<number>(settingsStore.bcryptRounds)

// Watch for changes and update the store
watch(theme, (newValue) => {
  settingsStore.setTheme(newValue)
})

watch(turboMode, (newValue) => {
  settingsStore.setTurboMode(newValue)
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

watch(autoUpdate, (newValue) => {
  settingsStore.setAutoUpdate(newValue)
})

watch(checkForUpdatesOnStartup, (newValue) => {
  settingsStore.setCheckForUpdatesOnStartup(newValue)
})

watch(bcryptRounds, (newValue) => {
  settingsStore.setBcryptRounds(Number(newValue))
})

// Reset settings to defaults
const resetSettings = (): void => {
  if (confirm('Are you sure you want to reset all settings to their default values?')) {
    settingsStore.resetSettings()

    // Update local refs
    theme.value = settingsStore.theme
    turboMode.value = settingsStore.turboMode
    fontSize.value = settingsStore.fontSize
    fontFamily.value = findMatchingFontOption(settingsStore.fontFamily)
    tabSize.value = settingsStore.tabSize
    insertSpaces.value = settingsStore.insertSpaces
    wordWrap.value = settingsStore.wordWrap
    lineNumbers.value = settingsStore.lineNumbers
    autoSave.value = settingsStore.autoSave
    autoSaveInterval.value = settingsStore.autoSaveInterval
    autoUpdate.value = settingsStore.autoUpdate
    checkForUpdatesOnStartup.value = settingsStore.checkForUpdatesOnStartup
    lastDirectory.value = settingsStore.lastDirectory
    bcryptRounds.value = settingsStore.bcryptRounds
  }
}

// Close the settings dialog
const close = (): void => {
  emit('close')
}

// When a component is mounted, ensure the font family is correctly set
onMounted(() => {
  // Make sure the font family is set to a matching option
  fontFamily.value = findMatchingFontOption(settingsStore.fontFamily)
})
</script>

<style scoped>
.settings-description {
  margin-left: 8px;
  font-size: 0.9em;
  color: var(--text);
  opacity: 0.8;
}
/* Settings layout styling */
.settings-layout {
  display: flex;
  height: calc(100% - 120px); /* Adjust for header and footer */
  overflow: hidden;
}

.settings-sidebar {
  width: 200px;
  border-right: 1px solid var(--border);
  overflow-y: auto;
  background-color: var(--surface);
}

.settings-nav-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: background-color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 44px; /* Fixed height to match section title */
  display: flex;
  align-items: center;
}

.settings-nav-item:hover {
  background-color: var(--menuHoverBackground);
}

.settings-nav-item.active {
  background-color: var(--primary);
  color: white;
  font-weight: bold;
}

.settings-sections-container {
  flex: 1;
  overflow-y: hidden;
  padding: 0;
  position: relative;
}

.settings-section {
  padding: 0;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-section-title {
  position: sticky;
  top: 0;
  background-color: var(--surface);
  padding: 12px 16px;
  margin: 0;
  border-bottom: 1px solid var(--border);
  z-index: 5;
  font-weight: bold;
  height: 44px; /* Fixed height to match nav items */
  display: flex;
  align-items: center;
}

.settings-section-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.settings-info {
  margin-top: 8px;
  font-size: 0.9em;
  color: var(--textSecondary);
  max-width: 500px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
    max-height: 200px;
  }

  .settings-sections-container {
    height: calc(100% - 200px);
  }

  .settings-section {
    position: relative;
  }
}
</style>
