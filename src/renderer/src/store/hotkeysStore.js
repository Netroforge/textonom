import { defineStore } from 'pinia'

// Define default hotkeys
const defaultHotkeys = {
  // File menu
  'file.new': { key: 'n', ctrl: true, shift: false, alt: false, description: 'Create a new file' },
  'file.open': { key: 'o', ctrl: true, shift: false, alt: false, description: 'Open a file' },
  'file.save': { key: 's', ctrl: true, shift: false, alt: false, description: 'Save current file' },
  'file.saveAs': {
    key: 's',
    ctrl: true,
    shift: true,
    alt: false,
    description: 'Save as a new file'
  },
  'file.settings': { key: ',', ctrl: true, shift: false, alt: false, description: 'Open settings' },

  // Edit menu
  'edit.undo': { key: 'z', ctrl: true, shift: false, alt: false, description: 'Undo last action' },
  'edit.redo': { key: 'z', ctrl: true, shift: true, alt: false, description: 'Redo last action' },
  'edit.cut': { key: 'x', ctrl: true, shift: false, alt: false, description: 'Cut selection' },
  'edit.copy': { key: 'c', ctrl: true, shift: false, alt: false, description: 'Copy selection' },
  'edit.paste': {
    key: 'v',
    ctrl: true,
    shift: false,
    alt: false,
    description: 'Paste from clipboard'
  },
  'edit.selectAll': {
    key: 'a',
    ctrl: true,
    shift: false,
    alt: false,
    description: 'Select all text'
  },

  // Transformations menu - examples for common transformations
  'transform.base64Encode': {
    key: '1',
    ctrl: true,
    shift: true,
    alt: false,
    description: 'Base64 encode'
  },
  'transform.base64Decode': {
    key: '2',
    ctrl: true,
    shift: true,
    alt: false,
    description: 'Base64 decode'
  },
  'transform.jsonPrettify': {
    key: 'j',
    ctrl: true,
    shift: true,
    alt: false,
    description: 'Prettify JSON'
  },
  'transform.jsonCompact': {
    key: 'j',
    ctrl: true,
    shift: false,
    alt: true,
    description: 'Compact JSON'
  },
  'transform.urlEncode': {
    key: 'u',
    ctrl: true,
    shift: true,
    alt: false,
    description: 'URL encode'
  },
  'transform.urlDecode': {
    key: 'u',
    ctrl: true,
    shift: false,
    alt: true,
    description: 'URL decode'
  }
}

// Load hotkeys from localStorage if available
const loadHotkeys = () => {
  const savedHotkeys = localStorage.getItem('textonom-hotkeys')
  if (savedHotkeys) {
    try {
      return JSON.parse(savedHotkeys)
    } catch (e) {
      console.error('Failed to parse saved hotkeys:', e)
    }
  }
  return defaultHotkeys
}

export const useHotkeysStore = defineStore('hotkeys', {
  state: () => ({
    hotkeys: loadHotkeys()
  }),

  actions: {
    // Update a specific hotkey
    updateHotkey(actionId, hotkeyConfig) {
      this.hotkeys[actionId] = hotkeyConfig
      this.saveHotkeys()
    },

    // Reset a specific hotkey to default
    resetHotkey(actionId) {
      if (defaultHotkeys[actionId]) {
        this.hotkeys[actionId] = { ...defaultHotkeys[actionId] }
        this.saveHotkeys()
      }
    },

    // Reset all hotkeys to defaults
    resetAllHotkeys() {
      this.hotkeys = { ...defaultHotkeys }
      this.saveHotkeys()
    },

    // Save hotkeys to localStorage
    saveHotkeys() {
      localStorage.setItem('textonom-hotkeys', JSON.stringify(this.hotkeys))
    },

    // Check if a keyboard event matches a specific action
    matchesAction(event, actionId) {
      const hotkey = this.hotkeys[actionId]
      if (!hotkey) return false

      return (
        event.key.toLowerCase() === hotkey.key.toLowerCase() &&
        event.ctrlKey === hotkey.ctrl &&
        event.shiftKey === hotkey.shift &&
        event.altKey === hotkey.alt
      )
    },

    // Get hotkey string representation for display
    getHotkeyString(actionId) {
      const hotkey = this.hotkeys[actionId]
      if (!hotkey) return ''

      const parts = []
      if (hotkey.ctrl) parts.push('Ctrl')
      if (hotkey.shift) parts.push('Shift')
      if (hotkey.alt) parts.push('Alt')

      // Format special keys for better readability
      let keyDisplay = hotkey.key
      if (keyDisplay === ',') keyDisplay = 'Comma'
      else if (keyDisplay === '.') keyDisplay = 'Period'
      else if (keyDisplay === '/') keyDisplay = 'Slash'
      else if (keyDisplay === ' ') keyDisplay = 'Space'
      else if (keyDisplay.length === 1) keyDisplay = keyDisplay.toUpperCase()

      parts.push(keyDisplay)

      return parts.join('+')
    }
  }
})

// Export default hotkeys for reference
export { defaultHotkeys }
