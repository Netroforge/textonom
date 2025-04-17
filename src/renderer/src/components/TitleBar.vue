<template>
  <div class="title-bar">
    <div class="title-bar-drag-area">
      <div class="app-title">Textonom</div>
    </div>
    <div class="window-controls">
      <button class="window-control minimize" @click="minimizeWindow">
        <svg width="10" height="1" viewBox="0 0 10 1">
          <path d="M0 0h10v1H0z" fill="currentColor" />
        </svg>
      </button>
      <button class="window-control maximize" @click="toggleMaximize">
        <svg v-if="isMaximized" width="10" height="10" viewBox="0 0 10 10">
          <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z" fill="currentColor" />
        </svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10">
          <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" fill="currentColor" />
        </svg>
      </button>
      <button class="window-control close" @click="closeWindow">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// State for window maximized status
const isMaximized = ref(false)

// Check initial maximized state
onMounted(async () => {
  isMaximized.value = await window.api.isWindowMaximized()

  // Listen for window resize to update maximized state
  window.addEventListener('resize', checkMaximizedState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMaximizedState)
})

// Check if window is maximized
const checkMaximizedState = async () => {
  isMaximized.value = await window.api.isWindowMaximized()
}

// Window control functions
const minimizeWindow = () => {
  window.api.minimizeWindow()
}

const toggleMaximize = async () => {
  const maximized = await window.api.maximizeWindow()
  isMaximized.value = maximized
}

const closeWindow = () => {
  window.api.closeWindow()
}
</script>

<style>
.title-bar {
  height: 30px;
  background-color: var(--titleBarBackground);
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag; /* Make the title bar draggable */
  user-select: none;
}

.title-bar-drag-area {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.app-title {
  font-size: 12px;
  color: var(--titleBarText);
}

.window-controls {
  display: flex;
  -webkit-app-region: no-drag; /* Make buttons clickable */
}

.window-control {
  width: 46px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  outline: none;
  color: var(--titleBarText);
  cursor: pointer;
}

.window-control:hover {
  background-color: var(--titleBarControlHover);
}

.close:hover {
  background-color: var(--titleBarCloseHover);
}
</style>
