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
        <div class="menu-item" @click="handleMenuAction('settings')">
          <span>Settings</span>
        </div>
        <div class="menu-item" @click="handleMenuAction('exit')">
          <span>Exit</span>
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

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Define props and emits
const emit = defineEmits<{
  'menu-action': [action: string]
}>()

// State
const activeMenu = ref<string>('')
const activeSubmenu = ref<string>('')
const menuClicked = ref<boolean>(false)

// Toggle menu visibility
const toggleMenu = (menu: string): void => {
  activeMenu.value = activeMenu.value === menu ? '' : menu
  activeSubmenu.value = ''
  menuClicked.value = activeMenu.value !== ''
}

// Close all menus
const closeMenus = (): void => {
  activeMenu.value = ''
  activeSubmenu.value = ''
  menuClicked.value = false
}

// Handle menu actions
const handleMenuAction = (action: string): void => {
  closeMenus()
  emit('menu-action', action)
}

// Add ref for the top nav bar
const topNavRef = ref<HTMLElement | null>(null)

// Use onMounted to add an event listener after a component is mounted
onMounted(() => {
  // Handle clicks outside the menu and top nav
  const handleOutsideClick = (event: MouseEvent): void => {
    const isMenuClick = (event.target as Element).closest('.menu-container')
    const isTopNavClick = (event.target as Element).closest('.top-nav')

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
/* Top navigation bar */
.top-nav {
  display: flex;
  background-color: var(--surface);
  padding: 0.25rem 0.5rem;
  border-bottom: 1px solid var(--border);
}

.top-nav-item {
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  color: var(--text);
  position: relative;
}

.top-nav-item:hover {
  background-color: var(--menuHoverBackground);
}

/* Menu styling */
.menu-container {
  position: relative;
}

.menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--menuBackground);
  border: 1px solid var(--menuBorder);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 200px;
}

.menu-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.menu-item:hover {
  background-color: var(--menuHoverBackground);
}

.menu-item.has-submenu {
  position: relative;
}

.submenu {
  position: absolute;
  left: 100%;
  top: 0;
  background-color: var(--menuBackground);
  border: 1px solid var(--menuBorder);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  min-width: 200px;
  z-index: 1001;
  /* Ensure submenu appears above other elements */
  margin-left: 0;
  /* Ensure no margin is pushing the submenu */
  margin-top: 0;
  /* Ensure no margin is pushing the submenu */
}
</style>
