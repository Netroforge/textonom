<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import './TopNavBar.css'

const props = defineProps<{
  onMenuAction: (menuAction: string) => void
  onOpenSettings: () => void
  onOpenShortcuts: () => void
  onOpenHistory: () => void
}>()

const activeMenu = ref('')
const menuClicked = ref(false)

const toggleMenu = (menu: string): void => {
  if (activeMenu.value === menu) {
    activeMenu.value = ''
    menuClicked.value = false
  } else {
    activeMenu.value = menu
    menuClicked.value = true
  }
}

const closeAllMenus = (): void => {
  activeMenu.value = ''
  menuClicked.value = false
}

const handleOutsideClick = (event: MouseEvent): void => {
  const target = event.target as Element
  const isMenuClick = target.closest('.menu-container')
  const isTopNavClick = target.closest('.top-nav')

  if (!isMenuClick) closeAllMenus()
  if (!isTopNavClick) menuClicked.value = false
}

const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.ctrlKey || event.metaKey) {
    if (event.key.toLowerCase() === ',') {
      event.preventDefault()
      props.onOpenSettings()
    } else if (event.key.toLowerCase() === 'h' && event.shiftKey) {
      event.preventDefault()
      props.onOpenHistory()
    }
  } else if (event.key === '?') {
    const target = event.target as HTMLElement
    if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
      event.preventDefault()
      props.onOpenShortcuts()
    }
  } else if (event.key === 'Escape') {
    closeAllMenus()
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('keydown', handleKeyDown)
})

const handleMenuAction = (menuAction: string): void => {
  closeAllMenus()
  props.onMenuAction(menuAction)
}

const handleHover = (menu: string): void => {
  if (menuClicked.value) {
    activeMenu.value = menu
  }
}

const openGithub = (): void => {
  closeAllMenus()
  window.open('https://github.com/Netroforge/textonom', '_blank')
}

const openSupport = (): void => {
  closeAllMenus()
  window.open('https://ko-fi.com/netroforge', '_blank')
}
</script>

<template>
  <div class="top-nav">
    <div class="top-nav-menus">
      <div class="menu-container">
        <button
          type="button"
          class="top-nav-item"
          :aria-expanded="activeMenu === 'file'"
          @click="toggleMenu('file')"
          @mouseenter="handleHover('file')"
        >
          File
        </button>
        <div v-if="activeMenu === 'file'" class="menu" role="menu">
          <button
            type="button"
            class="menu-item"
            role="menuitem"
            @click="handleMenuAction('history')"
          >
            <span>History & Favorites</span>
            <span class="menu-item-shortcut">Ctrl+Shift+H</span>
          </button>
          <button
            type="button"
            class="menu-item"
            role="menuitem"
            @click="handleMenuAction('settings')"
          >
            <span>Settings</span>
            <span class="menu-item-shortcut">Ctrl+,</span>
          </button>
          <div class="menu-divider"></div>
          <button type="button" class="menu-item" role="menuitem" @click="handleMenuAction('exit')">
            <span>Exit Textonom</span>
          </button>
        </div>
      </div>

      <div class="menu-container">
        <button
          type="button"
          class="top-nav-item"
          :aria-expanded="activeMenu === 'help'"
          @click="toggleMenu('help')"
          @mouseenter="handleHover('help')"
        >
          Help
        </button>
        <div v-if="activeMenu === 'help'" class="menu" role="menu">
          <button
            type="button"
            class="menu-item"
            role="menuitem"
            @click="handleMenuAction('shortcuts')"
          >
            <span>Keyboard Shortcuts</span>
            <span class="menu-item-shortcut">?</span>
          </button>
          <button
            type="button"
            class="menu-item"
            role="menuitem"
            @click="handleMenuAction('about')"
          >
            <span>About Textonom</span>
          </button>
          <button type="button" class="menu-item" role="menuitem" @click="openSupport">
            <span>Support Textonom</span>
          </button>
          <div class="menu-divider"></div>
          <button type="button" class="menu-item" role="menuitem" @click="openGithub">
            <span>GitHub Repository</span>
          </button>
          <button
            type="button"
            class="menu-item"
            role="menuitem"
            @click="handleMenuAction('checkForUpdates')"
          >
            <span>Check for Updates</span>
          </button>
        </div>
      </div>
    </div>

    <div class="top-nav-actions" aria-label="Application shortcuts">
      <button
        type="button"
        class="top-nav-action"
        title="History & Favorites (Ctrl+Shift+H)"
        @click="props.onOpenHistory"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5M12 7v5l3 2" />
        </svg>
        <span>History</span>
      </button>
      <button
        type="button"
        class="top-nav-action"
        title="Keyboard shortcuts (?)"
        @click="props.onOpenShortcuts"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h6M17 14h.01" />
        </svg>
        <span>Shortcuts</span>
      </button>
      <button
        type="button"
        class="top-nav-action"
        title="Settings (Ctrl+,)"
        @click="props.onOpenSettings"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path
            d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.2 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.4v-4h.09A1.7 1.7 0 0 0 4.2 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.6 4.2a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.4h4v.09A1.7 1.7 0 0 0 15 4.2a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.6a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.09v4h-.09a1.7 1.7 0 0 0-1.7 1Z"
          />
        </svg>
        <span>Settings</span>
      </button>
    </div>
  </div>
</template>
