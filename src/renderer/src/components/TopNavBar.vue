<template>
  <div class="top-nav" ref="topNavRef">
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
        <div class="menu-item" @click="handleMenuAction('new')">New</div>
        <div class="menu-item" @click="handleMenuAction('open')">Open</div>
        <div class="menu-item" @click="handleMenuAction('save')">Save</div>
        <div class="menu-item" @click="handleMenuAction('saveAs')">Save As</div>
        <div class="menu-item" @click="handleMenuAction('checkForUpdates')">Check for Updates</div>
        <div class="menu-item" @click="handleMenuAction('settings')">Settings</div>
        <div class="menu-item" @click="handleMenuAction('exit')">Exit</div>
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
        <div class="menu-item" @click="handleMenuAction('undo')">Undo</div>
        <div class="menu-item" @click="handleMenuAction('redo')">Redo</div>
        <div class="menu-item" @click="handleMenuAction('cut')">Cut</div>
        <div class="menu-item" @click="handleMenuAction('copy')">Copy</div>
        <div class="menu-item" @click="handleMenuAction('paste')">Paste</div>
        <div class="menu-item" @click="handleMenuAction('selectAll')">Select All</div>
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
            <div class="menu-item" @click="handleMenuAction('base64Encode')">Encode</div>
            <div class="menu-item" @click="handleMenuAction('base64Decode')">Decode</div>
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
            <div class="menu-item" @click="handleMenuAction('jsonPrettify')">Prettify</div>
            <div class="menu-item" @click="handleMenuAction('jsonCompact')">Compact</div>
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
            <div class="menu-item" @click="handleMenuAction('urlEncode')">Encode</div>
            <div class="menu-item" @click="handleMenuAction('urlDecode')">Decode</div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Define props and emits
defineProps({
  editorRef: Object
})
const emit = defineEmits(['menu-action'])

// State
const activeMenu = ref('')
const activeSubmenu = ref('')
const menuClicked = ref(false)

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

// Use onMounted to add event listener after component is mounted
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

  // Clean up the event listener when component is unmounted
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
</style>
