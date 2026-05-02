<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import './TopNavBar.css'

const props = defineProps<{
  onMenuAction: (menuAction: string) => void
  onOpenSettings: () => void
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

const exitApp = (): void => {
  window.api.closeWindow()
}

const openGithub = (): void => {
  closeAllMenus()
  window.open('https://github.com/Netroforge/textonom', '_blank')
}
</script>

<template>
  <div class="top-nav">
    <div class="menu-container">
      <div class="top-nav-item" @click="toggleMenu('file')" @mouseenter="handleHover('file')">
        File
      </div>
      <div v-if="activeMenu === 'file'" class="menu">
        <div class="menu-item" @click="handleMenuAction('settings')">
          <span>Settings</span>
        </div>
        <div class="menu-item" @click="exitApp">
          <span>Exit</span>
        </div>
      </div>
    </div>

    <div class="menu-container">
      <div class="top-nav-item" @click="toggleMenu('help')" @mouseenter="handleHover('help')">
        Help
      </div>
      <div v-if="activeMenu === 'help'" class="menu">
        <div class="menu-item" @click="handleMenuAction('about')">
          <span>About Textonom</span>
        </div>
        <div class="menu-item" @click="openGithub">
          <span>GitHub Repository</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('checkForUpdates')">
          <span>Check for Updates</span>
        </div>
      </div>
    </div>
  </div>
</template>
