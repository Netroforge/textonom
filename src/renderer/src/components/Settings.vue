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
import { onMounted, ref, watch } from 'vue'
import { THEMES, useSettingsStore } from '../store/settingsStore'
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
  { id: 'updates', title: 'Updates' },
  { id: 'transformations', title: 'Transformations' }
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
const autoUpdate = ref<boolean>(settingsStore.autoUpdate)
const checkForUpdatesOnStartup = ref<boolean>(settingsStore.checkForUpdatesOnStartup)
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
    autoUpdate.value = settingsStore.autoUpdate
    checkForUpdatesOnStartup.value = settingsStore.checkForUpdatesOnStartup
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
/* Settings dialog */
.settings-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.settings-content {
  background-color: var(--surface);
  border-radius: 8px;
  width: 80%;
  max-width: 900px;
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background-color: var(--surface);
  z-index: 10;
  width: 100%;
  padding: 1rem 1rem 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-row {
  display: flex;
  margin-bottom: 0.5rem;
  align-items: center;
}

.settings-label {
  flex: 1;
}

.settings-control {
  flex: 2;
}

.settings-description {
  margin-left: 8px;
  font-size: 0.9em;
  color: var(--text);
  opacity: 0.8;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 1rem 1rem;
  border-top: 1px solid var(--border);
  background-color: var(--surface);
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

/* Update notification button */
.check-updates-btn {
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  width: 100%;
  margin-top: 0.5rem;
}

.check-updates-btn:hover {
  background-color: var(--info);
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

  .settings-content {
    width: 95%;
  }

  .settings-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .settings-control {
    width: 100%;
    margin-top: 0.25rem;
  }
}
</style>
