<template>
  <div class="hotkey-settings">
    <div v-for="(section, sectionName) in hotkeyGroups" :key="sectionName" class="hotkey-section">
      <h4>{{ formatSectionName(sectionName.toString()) }}</h4>
      <div v-for="(hotkey, actionId) in section" :key="actionId" class="hotkey-row">
        <div class="hotkey-description">{{ hotkey.description }}</div>
        <div class="hotkey-controls">
          <div
            class="hotkey-display"
            :class="{ recording: recordingAction === actionId.toString() }"
            @click="startRecording(actionId.toString())"
          >
            {{
              recordingAction === actionId.toString()
                ? 'Press keys...'
                : hotkeysStore.getHotkeyString(actionId.toString()) || 'Not set'
            }}
          </div>
          <button
            class="hotkey-reset"
            title="Reset to default"
            @click="resetHotkey(actionId.toString())"
          >
            ↺
          </button>
        </div>
      </div>
    </div>
    <div class="hotkey-actions">
      <button @click="resetAllHotkeys">Reset All Hotkeys</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useHotkeysStore, type HotkeyConfig } from '../store/hotkeysStore'

// Get the hotkeys store
const hotkeysStore = useHotkeysStore()

// State for recording hotkeys
const recordingAction = ref<string | null>(null)

// Define interface for grouped hotkeys
interface HotkeyGroups {
  [section: string]: {
    [actionId: string]: HotkeyConfig
  }
}

// Group hotkeys by section
const hotkeyGroups = computed((): HotkeyGroups => {
  const groups: HotkeyGroups = {}

  Object.entries(hotkeysStore.hotkeys).forEach(([actionId, config]) => {
    const [section] = actionId.split('.')
    if (!groups[section]) {
      groups[section] = {}
    }
    groups[section][actionId] = config
  })

  return groups
})

// Format section name for display
const formatSectionName = (section: string): string => {
  return section.charAt(0).toUpperCase() + section.slice(1) + ' Shortcuts'
}

// Start recording a new hotkey
const startRecording = (actionId: string): void => {
  recordingAction.value = actionId
}

// Handle key press during recording
const handleKeyDown = (event: KeyboardEvent): void => {
  if (!recordingAction.value) return

  // Prevent default browser shortcuts
  event.preventDefault()

  // Ignore standalone modifier keys
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(event.key)) {
    return
  }

  // Create a new hotkey configuration
  const newHotkey = {
    key: event.key,
    ctrl: event.ctrlKey,
    shift: event.shiftKey,
    alt: event.altKey,
    description: hotkeysStore.hotkeys[recordingAction.value]?.description || ''
  }

  // Update the hotkey
  hotkeysStore.updateHotkey(recordingAction.value, newHotkey)

  // Stop recording
  recordingAction.value = null
}

// Reset a specific hotkey by default
const resetHotkey = (actionId: string): void => {
  hotkeysStore.resetHotkey(actionId)
}

// Reset all hotkeys to defaults
const resetAllHotkeys = (): void => {
  if (confirm('Are you sure you want to reset all hotkeys to their default values?')) {
    hotkeysStore.resetAllHotkeys()
  }
}

// Cancel recording when clicking outside
const handleClickOutside = (event: MouseEvent): void => {
  if (recordingAction.value && !(event.target as Element).closest('.hotkey-display')) {
    recordingAction.value = null
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.hotkey-settings {
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.hotkey-section {
  margin-bottom: 1rem;
}

.hotkey-section h4 {
  margin-bottom: 0.5rem;
  color: var(--primary);
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.25rem;
}

.hotkey-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  margin-bottom: 0.25rem;
}

.hotkey-description {
  flex: 1;
}

.hotkey-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hotkey-display {
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  min-width: 120px;
  text-align: center;
  cursor: pointer;
}

.hotkey-display.recording {
  background-color: var(--primary);
  color: white;
  animation: pulse 1.5s infinite;
}

.hotkey-reset {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  opacity: 0.7;
}

.hotkey-reset:hover {
  opacity: 1;
}

.hotkey-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
