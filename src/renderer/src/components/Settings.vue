<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'
import { THEMES } from '../styles/themes'
import './Settings.css'

defineProps<{
  onClose: () => void
}>()

interface Section {
  id: string
  title: string
}

const settingsStore = useSettingsStore()
const {
  setTheme,
  setFontSize,
  setFontFamily,
  setAutoUpdate,
  setCheckForUpdatesOnStartup,
  setCrtEffect,
  setBcryptRounds,
  setWordWrap,
  resetSettings
} = settingsStore

const sections: Section[] = [
  { id: 'theme', title: 'Theme' },
  { id: 'font', title: 'Font' },
  { id: 'updates', title: 'Updates' },
  { id: 'transformations', title: 'Transformations' }
]

const activeSection = ref('theme')

const fontOptions = [
  "Consolas, 'Courier New', monospace",
  "'Courier New', monospace",
  "'Fira Code', monospace",
  "'Source Code Pro', monospace",
  'monospace'
]

const localSettings = reactive({
  theme: settingsStore.settings.theme,
  fontSize: settingsStore.settings.fontSize,
  fontFamily: settingsStore.settings.fontFamily,
  autoUpdate: settingsStore.settings.autoUpdate,
  checkForUpdatesOnStartup: settingsStore.settings.checkForUpdatesOnStartup,
  turboMode: settingsStore.settings.crtEffect,
  bcryptRounds: settingsStore.settings.bcryptRounds || 12,
  wordWrap: settingsStore.settings.wordWrap
})

watch(() => localSettings.theme, (v) => setTheme(v))
watch(() => localSettings.fontSize, (v) => setFontSize(Number(v)))
watch(() => localSettings.fontFamily, (v) => setFontFamily(v))
watch(() => localSettings.autoUpdate, (v) => setAutoUpdate(v))
watch(() => localSettings.checkForUpdatesOnStartup, (v) => setCheckForUpdatesOnStartup(v))
watch(() => localSettings.turboMode, (v) => setCrtEffect(v))
watch(() => localSettings.bcryptRounds, (v) => setBcryptRounds(Number(v)))
watch(() => localSettings.wordWrap, (v) => setWordWrap(v))

const handleReset = (): void => {
  if (window.confirm('Are you sure you want to reset all settings to their default values?')) {
    resetSettings()
    localSettings.theme = 'cyberpunk'
    localSettings.fontSize = 14
    localSettings.fontFamily = "Consolas, 'Courier New', monospace"
    localSettings.autoUpdate = true
    localSettings.checkForUpdatesOnStartup = true
    localSettings.turboMode = true
    localSettings.bcryptRounds = 12
    localSettings.wordWrap = true
  }
}

const onOverlayClick = (e: MouseEvent, onClose: () => void): void => {
  if ((e.target as HTMLElement).className === 'settings-overlay') {
    onClose()
  }
}
</script>

<template>
  <div class="settings-overlay" @click="(e) => onOverlayClick(e, onClose)">
    <div class="settings-container">
      <div class="settings-header">
        <h2>Settings</h2>
        <button class="close-button" @click="onClose">✕</button>
      </div>

      <div class="settings-content">
        <div class="settings-layout">
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

          <div class="settings-sections-container">
            <div v-if="activeSection === 'theme'" class="settings-section">
              <h3 class="settings-section-title">Theme</h3>
              <div class="settings-section-content">
                <div class="settings-row">
                  <label class="settings-label">Theme</label>
                  <div class="settings-control">
                    <select v-model="localSettings.theme">
                      <option :value="THEMES.LIGHT">Light</option>
                      <option :value="THEMES.DARK">Dark</option>
                      <option :value="THEMES.CYBERPUNK">Cyberpunk</option>
                    </select>
                  </div>
                </div>

                <div class="settings-row">
                  <label class="settings-label">Turbo Mode</label>
                  <div class="settings-control">
                    <input v-model="localSettings.turboMode" type="checkbox" />
                    <span class="settings-description">Enable</span>
                  </div>
                </div>

                <div class="settings-info">
                  <p>
                    Turbo Mode adds visual effects that may impact performance on older devices.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'font'" class="settings-section">
              <h3 class="settings-section-title">Font</h3>
              <div class="settings-section-content">
                <div class="settings-row">
                  <label class="settings-label">Font Family</label>
                  <div class="settings-control">
                    <select v-model="localSettings.fontFamily">
                      <option v-for="font in fontOptions" :key="font" :value="font">
                        {{ font.split(',')[0].replace(/["']/g, '') }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="settings-row">
                  <label class="settings-label">Font Size</label>
                  <div class="settings-control">
                    <input v-model.number="localSettings.fontSize" type="number" min="8" max="32" />
                  </div>
                </div>
                <div class="settings-row">
                  <label class="settings-label">Word Wrap</label>
                  <div class="settings-control">
                    <input v-model="localSettings.wordWrap" type="checkbox" />
                    <span class="settings-description">Enable word wrap in text areas</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'updates'" class="settings-section">
              <h3 class="settings-section-title">Updates</h3>
              <div class="settings-section-content">
                <div class="settings-row">
                  <label class="settings-label">Enable Auto Update</label>
                  <div class="settings-control">
                    <input v-model="localSettings.autoUpdate" type="checkbox" />
                  </div>
                </div>
                <div class="settings-row">
                  <label class="settings-label">Check for Updates on Startup</label>
                  <div class="settings-control">
                    <input
                      v-model="localSettings.checkForUpdatesOnStartup"
                      type="checkbox"
                      :disabled="!localSettings.autoUpdate"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'transformations'" class="settings-section">
              <h3 class="settings-section-title">Transformations</h3>
              <div class="settings-section-content">
                <div class="settings-row">
                  <label class="settings-label">Bcrypt Rounds (Cost Factor)</label>
                  <div class="settings-control">
                    <input
                      v-model.number="localSettings.bcryptRounds"
                      type="number"
                      min="1"
                      max="20"
                    />
                    <span class="settings-description">Default: 12 (recommended)</span>
                  </div>
                </div>
                <div class="settings-info">
                  <p>
                    Higher rounds provide stronger security but take longer to compute. The
                    default value of 12 is a good balance between security and performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-footer">
        <button @click="handleReset">Reset to Defaults</button>
        <button @click="onClose">Close</button>
      </div>
    </div>
  </div>
</template>
