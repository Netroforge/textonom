<template>
  <div class="crt-container crt-flicker" :class="{ 'crt-active': isCRTActive }">
    <div class="crt-glitch" data-text="GLITCH">
      <slot></slot>
    </div>
    <div class="crt-scanlines"></div>
    <div class="crt-glow"></div>
    <div class="crt-flicker-overlay"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore, THEMES } from '../store/settingsStore'

// Get the current theme from the settings store
const settingsStore = useSettingsStore()

// Compute whether the CRT effect should be active
const isCRTActive = computed(() => {
  return settingsStore.theme === THEMES.CYBERPUNK_TURBO
})

// Glitch effect timing
let glitchInterval = null

// Create random glitches
const createGlitch = () => {
  if (!isCRTActive.value) return

  const glitchElement = document.querySelector('.crt-glitch')
  if (!glitchElement) return

  // Apply random transform
  const xOffset = Math.random() * 10 - 5
  glitchElement.style.transform = `translateX(${xOffset}px)`

  // Apply random clip path
  const top = Math.random() * 10
  const bottom = 100 - Math.random() * 10
  glitchElement.style.clipPath = `polygon(0 ${top}%, 100% ${top}%, 100% ${bottom}%, 0 ${bottom}%)`

  // Reset after a short time
  setTimeout(() => {
    glitchElement.style.transform = 'translateX(0)'
    glitchElement.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
  }, 100 + Math.random() * 200)
}

// Setup and cleanup glitch effect
onMounted(() => {
  // Create glitches at random intervals
  const setupGlitchInterval = () => {
    if (glitchInterval) clearInterval(glitchInterval)

    glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance of glitch
        createGlitch()
      }
    }, 2000) // Check every 2 seconds
  }

  setupGlitchInterval()
})

onUnmounted(() => {
  if (glitchInterval) clearInterval(glitchInterval)
})
</script>

<style scoped>
.crt-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.crt-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.02) 50%,
      rgba(255, 255, 255, 0) 51%);
  background-size: 100% 4px;
  z-index: 2;
  pointer-events: none;
  opacity: 0.3;
}

.crt-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 100px rgba(0, 255, 255, 0.2);
  z-index: 3;
  pointer-events: none;
}

.crt-flicker-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  z-index: 4;
  pointer-events: none;
  animation: flicker 5s infinite;
}

.crt-glitch {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.1s, clip-path 0.1s;
}

/* Only apply effects when active */
.crt-container:not(.crt-active) .crt-scanlines,
.crt-container:not(.crt-active) .crt-glow,
.crt-container:not(.crt-active) .crt-flicker-overlay {
  display: none;
}

.crt-container:not(.crt-active) .crt-glitch {
  transform: none !important;
  clip-path: none !important;
}

@keyframes flicker {
  0% {
    opacity: 0.97;
  }

  5% {
    opacity: 0.9;
  }

  10% {
    opacity: 0.97;
  }

  15% {
    opacity: 0.92;
  }

  20% {
    opacity: 0.97;
  }

  50% {
    opacity: 0.95;
  }

  80% {
    opacity: 0.97;
  }

  85% {
    opacity: 0.9;
  }

  90% {
    opacity: 0.97;
  }

  95% {
    opacity: 0.93;
  }

  100% {
    opacity: 0.97;
  }
}
</style>
