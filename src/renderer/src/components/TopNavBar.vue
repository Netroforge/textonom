<template>
  <div ref="topNavRef" class="top-nav">
    <!-- File Menu -->
    <div class="menu-container">
      <div
        class="top-nav-item"
        @click="toggleMenu('file')"
        @mouseenter="menuClicked ? (activeMenu = 'file') : null"
      >
        File
      </div>
      <div v-if="activeMenu === 'file'" class="menu">
        <div class="menu-item" @click="handleMenuAction('new')">
          <span>New</span>
          <span class="hotkey-hint">{{ getHotkeyString('file.new') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('open')">
          <span>Open</span>
          <span class="hotkey-hint">{{ getHotkeyString('file.open') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('save')">
          <span>Save</span>
          <span class="hotkey-hint">{{ getHotkeyString('file.save') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('saveAs')">
          <span>Save As</span>
          <span class="hotkey-hint">{{ getHotkeyString('file.saveAs') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('settings')">
          <span>Settings</span>
          <span class="hotkey-hint">{{ getHotkeyString('file.settings') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('exit')">
          <span>Exit</span>
        </div>
      </div>
    </div>

    <!-- Edit Menu -->
    <div class="menu-container">
      <div
        class="top-nav-item"
        @click="toggleMenu('edit')"
        @mouseenter="menuClicked ? (activeMenu = 'edit') : null"
      >
        Edit
      </div>
      <div v-if="activeMenu === 'edit'" class="menu">
        <div class="menu-item" @click="handleMenuAction('undo')">
          <span>Undo</span>
          <span class="hotkey-hint">{{ getHotkeyString('edit.undo') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('redo')">
          <span>Redo</span>
          <span class="hotkey-hint">{{ getHotkeyString('edit.redo') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('cut')">
          <span>Cut</span>
          <span class="hotkey-hint">{{ getHotkeyString('edit.cut') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('copy')">
          <span>Copy</span>
          <span class="hotkey-hint">{{ getHotkeyString('edit.copy') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('paste')">
          <span>Paste</span>
          <span class="hotkey-hint">{{ getHotkeyString('edit.paste') }}</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('selectAll')">
          <span>Select All</span>
          <span class="hotkey-hint">{{ getHotkeyString('edit.selectAll') }}</span>
        </div>
      </div>
    </div>

    <!-- Transformations Menu -->
    <div class="menu-container">
      <div
        class="top-nav-item"
        @click="toggleMenu('transform')"
        @mouseenter="menuClicked ? (activeMenu = 'transform') : null"
      >
        Transformations
      </div>
      <div v-if="activeMenu === 'transform'" class="menu">
        <!-- Base64 -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'base64') : null"
          @mouseleave="activeSubmenu === 'base64' ? (activeSubmenu = '') : null"
        >
          Base64
          <span>▶</span>
          <div v-if="activeSubmenu === 'base64'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('base64Encode')">
              <span>Encode</span>
              <span class="hotkey-hint">{{ getHotkeyString('transform.base64Encode') }}</span>
            </div>
            <div class="menu-item" @click="handleMenuAction('base64Decode')">
              <span>Decode</span>
              <span class="hotkey-hint">{{ getHotkeyString('transform.base64Decode') }}</span>
            </div>
          </div>
        </div>

        <!-- JSON -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'json') : null"
          @mouseleave="activeSubmenu === 'json' ? (activeSubmenu = '') : null"
        >
          JSON
          <span>▶</span>
          <div v-if="activeSubmenu === 'json'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('jsonPrettify')">
              <span>Prettify</span>
              <span class="hotkey-hint">{{ getHotkeyString('transform.jsonPrettify') }}</span>
            </div>
            <div class="menu-item" @click="handleMenuAction('jsonCompact')">
              <span>Compact</span>
              <span class="hotkey-hint">{{ getHotkeyString('transform.jsonCompact') }}</span>
            </div>
          </div>
        </div>

        <!-- URL -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'url') : null"
          @mouseleave="activeSubmenu === 'url' ? (activeSubmenu = '') : null"
        >
          URL
          <span>▶</span>
          <div v-if="activeSubmenu === 'url'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('urlEncode')">
              <span>Encode</span>
              <span class="hotkey-hint">{{ getHotkeyString('transform.urlEncode') }}</span>
            </div>
            <div class="menu-item" @click="handleMenuAction('urlDecode')">
              <span>Decode</span>
              <span class="hotkey-hint">{{ getHotkeyString('transform.urlDecode') }}</span>
            </div>
          </div>
        </div>

        <!-- Case -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'case') : null"
          @mouseleave="activeSubmenu === 'case' ? (activeSubmenu = '') : null"
        >
          Case
          <span>▶</span>
          <div v-if="activeSubmenu === 'case'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('toUpperCase')">UPPERCASE</div>
            <div class="menu-item" @click="handleMenuAction('toLowerCase')">lowercase</div>
            <div class="menu-item" @click="handleMenuAction('toTitleCase')">Title Case</div>
          </div>
        </div>

        <!-- XML -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'xml') : null"
          @mouseleave="activeSubmenu === 'xml' ? (activeSubmenu = '') : null"
        >
          XML
          <span>▶</span>
          <div v-if="activeSubmenu === 'xml'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('xmlPrettify')">Prettify</div>
            <div class="menu-item" @click="handleMenuAction('xmlCompact')">Compact</div>
          </div>
        </div>

        <!-- Line Operations -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'lines') : null"
          @mouseleave="activeSubmenu === 'lines' ? (activeSubmenu = '') : null"
        >
          Line Operations
          <span>▶</span>
          <div v-if="activeSubmenu === 'lines'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('sortLines')">Sort Lines</div>
            <div class="menu-item" @click="handleMenuAction('deduplicateLines')">
              Remove Duplicates
            </div>
            <div class="menu-item" @click="handleMenuAction('reverseLines')">Reverse Lines</div>
          </div>
        </div>

        <!-- HTML -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'html') : null"
          @mouseleave="activeSubmenu === 'html' ? (activeSubmenu = '') : null"
        >
          HTML
          <span>▶</span>
          <div v-if="activeSubmenu === 'html'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('htmlEncode')">Encode</div>
            <div class="menu-item" @click="handleMenuAction('htmlDecode')">Decode</div>
          </div>
        </div>

        <!-- Hash -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'hash') : null"
          @mouseleave="activeSubmenu === 'hash' ? (activeSubmenu = '') : null"
        >
          Hash
          <span>▶</span>
          <div v-if="activeSubmenu === 'hash'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('md5Hash')">MD5</div>
            <div class="menu-item" @click="handleMenuAction('sha1Hash')">SHA-1</div>
            <div class="menu-item" @click="handleMenuAction('sha256Hash')">SHA-256</div>
            <div class="menu-item" @click="handleMenuAction('bcryptHash')">Bcrypt</div>
          </div>
        </div>

        <!-- Unicode -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'unicode') : null"
          @mouseleave="activeSubmenu === 'unicode' ? (activeSubmenu = '') : null"
        >
          Unicode
          <span>▶</span>
          <div v-if="activeSubmenu === 'unicode'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('unicodeEscape')">Escape</div>
            <div class="menu-item" @click="handleMenuAction('unicodeUnescape')">Unescape</div>
          </div>
        </div>

        <!-- JSON/YAML -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'jsonYaml') : null"
          @mouseleave="activeSubmenu === 'jsonYaml' ? (activeSubmenu = '') : null"
        >
          JSON/YAML
          <span>▶</span>
          <div v-if="activeSubmenu === 'jsonYaml'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('jsonToYaml')">JSON to YAML</div>
            <div class="menu-item" @click="handleMenuAction('yamlToJson')">YAML to JSON</div>
          </div>
        </div>

        <!-- Spring Boot Properties -->
        <div
          class="menu-item has-submenu"
          @mouseenter="menuClicked ? (activeSubmenu = 'springBoot') : null"
          @mouseleave="activeSubmenu === 'springBoot' ? (activeSubmenu = '') : null"
        >
          Spring Boot
          <span>▶</span>
          <div v-if="activeSubmenu === 'springBoot'" class="submenu">
            <div class="menu-item" @click="handleMenuAction('propertiesFileToYaml')">
              Properties to YAML
            </div>
            <div class="menu-item" @click="handleMenuAction('yamlToPropertiesFile')">
              YAML to Properties
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- About Menu -->
    <div class="menu-container">
      <div
        class="top-nav-item"
        @click="toggleMenu('about')"
        @mouseenter="menuClicked ? (activeMenu = 'about') : null"
      >
        About
      </div>
      <div v-if="activeMenu === 'about'" class="menu">
        <div class="menu-item" @click="handleMenuAction('about')">About Textonom</div>
        <div class="menu-item" @click="handleMenuAction('checkForUpdates')">Check for Updates</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useHotkeysStore } from '../store/hotkeysStore'

// Define props and emits
defineProps({
  editorRef: Object
})
const emit = defineEmits(['menu-action'])

// State
const activeMenu = ref('')
const activeSubmenu = ref('')
const menuClicked = ref(false)

// Get hotkeys store
const hotkeysStore = useHotkeysStore()

// Get hotkey string for display
const getHotkeyString = (actionId) => {
  return hotkeysStore.getHotkeyString(actionId)
}

// Toggle menu visibility
const toggleMenu = (menu) => {
  activeMenu.value = activeMenu.value === menu ? '' : menu
  activeSubmenu.value = ''
  menuClicked.value = activeMenu.value !== ''
}

// Close all menus
const closeMenus = () => {
  activeMenu.value = ''
  activeSubmenu.value = ''
  menuClicked.value = false
}

// Handle menu actions
const handleMenuAction = (action) => {
  closeMenus()
  emit('menu-action', action)
}

// Add ref for the top nav bar
const topNavRef = ref(null)

// Use onMounted to add an event listener after a component is mounted
onMounted(() => {
  // Handle clicks outside the menu and top nav
  const handleOutsideClick = (event) => {
    const isMenuClick = event.target.closest('.menu-container')
    const isTopNavClick = event.target.closest('.top-nav')

    // Close menus when clicking outside menu containers
    if (!isMenuClick) {
      closeMenus()
    }

    // Reset hover behavior when clicking outside the top nav
    if (!isTopNavClick) {
      menuClicked.value = false
    }
  }

  // Add the event listener
  document.addEventListener('click', handleOutsideClick)

  // Clean up the event listener when the component is unmounted
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick)
  })
})
</script>

<style scoped>
/* Menu styling is in global.css */
.menu-item.has-submenu {
  position: relative;
}

.submenu {
  position: absolute;
  left: 100%;
  top: 0;
  z-index: 1001;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hotkey-hint {
  margin-left: 20px;
  opacity: 0.7;
  font-size: 0.85em;
  color: var(--text);
}
</style>
