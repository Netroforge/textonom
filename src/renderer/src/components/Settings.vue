<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
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
const { settings } = storeToRefs(settingsStore)
const { resetSettings } = settingsStore

const sections: Section[] = [
  { id: 'theme', title: 'Theme' },
  { id: 'font', title: 'Font' },
  { id: 'updates', title: 'Updates' },
  { id: 'transformations', title: 'Transformations' }
]

const activeSection = ref('theme')
const showResetConfirm = ref(false)

const fontOptions = [
  "Consolas, 'Courier New', monospace",
  "'Courier New', monospace",
  "'Fira Code', monospace",
  "'Source Code Pro', monospace",
  'monospace'
]

const theme = computed({
  get: () => settings.value.theme,
  set: (v) => (settings.value.theme = v)
})
const fontSize = computed({
  get: () => settings.value.fontSize,
  set: (v) => (settings.value.fontSize = Number(v))
})
const fontFamily = computed({
  get: () => settings.value.fontFamily,
  set: (v) => (settings.value.fontFamily = v)
})
const autoUpdate = computed({
  get: () => settings.value.autoUpdate,
  set: (v) => (settings.value.autoUpdate = v)
})
const checkForUpdatesOnStartup = computed({
  get: () => settings.value.checkForUpdatesOnStartup,
  set: (v) => (settings.value.checkForUpdatesOnStartup = v)
})
const turboMode = computed({
  get: () => settings.value.crtEffect,
  set: (v) => (settings.value.crtEffect = v)
})
const bcryptRounds = computed({
  get: () => settings.value.bcryptRounds,
  set: (v) => (settings.value.bcryptRounds = Number(v))
})
const wordWrap = computed({
  get: () => settings.value.wordWrap,
  set: (v) => (settings.value.wordWrap = v)
})

const requestReset = (): void => {
  showResetConfirm.value = true
}
const confirmReset = (): void => {
  resetSettings()
  showResetConfirm.value = false
}
const cancelReset = (): void => {
  showResetConfirm.value = false
}

const onOverlayClick = (e: MouseEvent, onClose: () => void): void => {
  if ((e.target as HTMLElement).className === 'settings-overlay') {
    onClose()
  }
}
</script>

<template>
  <div class="settings-overlay" @click="(e) => onOverlayClick(e, onClose)">
    <div class="settings-container" role="dialog" aria-labelledby="settings-title">
      <div class="settings-header">
        <h2 id="settings-title">Settings</h2>
        <button class="close-button" aria-label="Close settings" @click="onClose">✕</button>
      </div>

      <div class="settings-content">
        <div class="settings-layout">
          <div class="settings-sidebar" role="tablist">
            <button
              v-for="section in sections"
              :key="section.id"
              type="button"
              class="settings-nav-item"
              :class="{ active: activeSection === section.id }"
              role="tab"
              :aria-selected="activeSection === section.id"
              @click="activeSection = section.id"
            >
              {{ section.title }}
            </button>
          </div>

          <div class="settings-sections-container">
            <div v-if="activeSection === 'theme'" class="settings-section">
              <h3 class="settings-section-title">Theme</h3>
              <div class="settings-section-content">
                <div class="settings-row">
                  <label class="settings-label" for="setting-theme">Theme</label>
                  <div class="settings-control">
                    <select id="setting-theme" v-model="theme">
                      <option :value="THEMES.LIGHT">Light</option>
                      <option :value="THEMES.DARK">Dark</option>
                      <option :value="THEMES.CYBERPUNK">Cyberpunk</option>
                    </select>
                  </div>
                </div>

                <div class="settings-row">
                  <label class="settings-label" for="setting-turbo">Turbo Mode</label>
                  <div class="settings-control">
                    <input id="setting-turbo" v-model="turboMode" type="checkbox" />
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
                  <label class="settings-label" for="setting-font-family">Font Family</label>
                  <div class="settings-control">
                    <select id="setting-font-family" v-model="fontFamily">
                      <option v-for="font in fontOptions" :key="font" :value="font">
                        {{ font.split(',')[0].replace(/["']/g, '') }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="settings-row">
                  <label class="settings-label" for="setting-font-size">Font Size</label>
                  <div class="settings-control">
                    <input
                      id="setting-font-size"
                      v-model.number="fontSize"
                      type="number"
                      min="8"
                      max="32"
                    />
                  </div>
                </div>
                <div class="settings-row">
                  <label class="settings-label" for="setting-wrap">Word Wrap</label>
                  <div class="settings-control">
                    <input id="setting-wrap" v-model="wordWrap" type="checkbox" />
                    <span class="settings-description">Wrap long lines in text areas</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'updates'" class="settings-section">
              <h3 class="settings-section-title">Updates</h3>
              <div class="settings-section-content">
                <div class="settings-row">
                  <label class="settings-label" for="setting-auto-update">Enable auto update</label>
                  <div class="settings-control">
                    <input id="setting-auto-update" v-model="autoUpdate" type="checkbox" />
                  </div>
                </div>
                <div class="settings-row">
                  <label class="settings-label" for="setting-startup-update">
                    Check for updates on startup
                  </label>
                  <div class="settings-control">
                    <input
                      id="setting-startup-update"
                      v-model="checkForUpdatesOnStartup"
                      type="checkbox"
                      :disabled="!autoUpdate"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'transformations'" class="settings-section">
              <h3 class="settings-section-title">Transformations</h3>
              <div class="settings-section-content">
                <div class="settings-row">
                  <label class="settings-label" for="setting-bcrypt">
                    Bcrypt rounds (cost factor)
                  </label>
                  <div class="settings-control">
                    <input
                      id="setting-bcrypt"
                      v-model.number="bcryptRounds"
                      type="number"
                      min="1"
                      max="20"
                    />
                    <span class="settings-description">Default: 12 (recommended)</span>
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
      </div>

      <div class="settings-footer">
        <button class="btn-secondary" @click="requestReset">Reset to defaults</button>
        <button class="btn-primary" @click="onClose">Close</button>
      </div>

      <div v-if="showResetConfirm" class="settings-confirm-overlay" @click.self="cancelReset">
        <div class="settings-confirm">
          <p>Reset all settings to their default values?</p>
          <div class="settings-confirm-actions">
            <button class="btn-secondary" @click="cancelReset">Cancel</button>
            <button class="btn-primary" @click="confirmReset">Reset</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
