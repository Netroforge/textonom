<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import './ShortcutsOverlay.css'

const props = defineProps<{
  onClose: () => void
}>()

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') props.onClose()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const onOverlayClick = (e: MouseEvent): void => {
  if (e.target === e.currentTarget) props.onClose()
}

interface ShortcutGroup {
  name: string
  shortcuts: { keys: string; description: string }[]
}

const shortcutGroups: ShortcutGroup[] = [
  {
    name: 'General',
    shortcuts: [
      { keys: 'Ctrl + ,', description: 'Open Settings' },
      { keys: 'Ctrl + Shift + H', description: 'Open History & Favorites' },
      { keys: '?', description: 'Show keyboard shortcuts' },
      { keys: 'Escape', description: 'Close dialog / Clear search' }
    ]
  },
  {
    name: 'Navigation',
    shortcuts: [
      { keys: 'Ctrl + H', description: 'Go to Home' },
      { keys: 'Ctrl + F', description: 'Focus search (Home)' },
      { keys: 'Ctrl + Tab', description: 'Next tab' },
      { keys: 'Ctrl + Shift + Tab', description: 'Previous tab' },
      { keys: 'Ctrl + 1-9', description: 'Switch to tab by position' }
    ]
  },
  {
    name: 'Tabs',
    shortcuts: [{ keys: 'Ctrl + W', description: 'Close active tab' }]
  },
  {
    name: 'Transformations',
    shortcuts: [{ keys: 'Ctrl + Enter', description: 'Run transformation' }]
  }
]

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

const formatKey = (keys: string): string => {
  if (isMac) {
    return keys.replace('Ctrl', 'Cmd').replace('Ctrl +', 'Cmd +')
  }
  return keys
}
</script>

<template>
  <div class="shortcuts-overlay" @click="onOverlayClick">
    <div
      class="shortcuts-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div class="shortcuts-header">
        <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
        <button class="close-button" aria-label="Close" @click="onClose">✕</button>
      </div>

      <div class="shortcuts-content">
        <div v-for="group in shortcutGroups" :key="group.name" class="shortcut-group">
          <h3 class="shortcut-group-title">{{ group.name }}</h3>
          <div class="shortcut-list">
            <div v-for="shortcut in group.shortcuts" :key="shortcut.keys" class="shortcut-row">
              <span class="shortcut-keys">{{ formatKey(shortcut.keys) }}</span>
              <span class="shortcut-description">{{ shortcut.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
