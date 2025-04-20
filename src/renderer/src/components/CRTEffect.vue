<template>
  <div class="crt-container crt-flicker">
    <div class="crt-content">
      <slot></slot>
    </div>
    <div class="crt-glitch-overlay" data-text="GLITCH"></div>
    <div class="crt-scanlines"></div>
    <div class="crt-rgb-separation"></div>
    <div class="crt-vignette"></div>
    <div class="crt-glow"></div>
    <div class="crt-flicker-overlay"></div>
    <div class="crt-horizontal-glitch"></div>
    <div class="crt-color-shift"></div>
    <div class="crt-static-noise"></div>
    <div class="crt-vertical-sync"></div>
    <div class="crt-signal-jitter"></div>
    <div class="crt-digital-corruption"></div>
    <div class="crt-scan-distortion"></div>
    <div class="crt-text-corruption"></div>
    <div class="crt-pixel-displacement"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// The CRT effect is now controlled by the data-crt-effect attribute
// which is set in the applyTheme function

// Glitch effect timing
let glitchInterval: ReturnType<typeof setInterval> | null = null

// Create random glitches
const createGlitch = (): void => {
  // Check if CRT effect is active using the data attribute
  if (document.documentElement.getAttribute('data-crt-effect') !== 'true') return

  // Determine which type of glitch to create
  const glitchType = Math.floor(Math.random() * 3)

  // Duration for the glitch effect
  const duration = 100 + Math.random() * 300

  switch (glitchType) {
    case 0:
      createBasicGlitch(duration)
      break
    case 1:
      createHorizontalGlitch(duration)
      break
    case 2:
      createColorShift(duration)
      break
  }
}

// Original basic glitch effect
const createBasicGlitch = (duration: number): void => {
  const glitchElement = document.querySelector('.crt-glitch-overlay') as HTMLElement
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
  }, duration)
}

// Horizontal glitch lines
const createHorizontalGlitch = (duration: number): void => {
  const element = document.querySelector('.crt-horizontal-glitch') as HTMLElement
  if (!element) return

  // Make element visible
  element.style.display = 'block'

  // Create 2-5 horizontal glitch lines
  const numLines = Math.floor(Math.random() * 4) + 2
  let html = ''

  for (let i = 0; i < numLines; i++) {
    const glitchY = Math.random() * 100
    const glitchHeight = Math.random() * 8 + 2
    const glitchAlpha = Math.random() * 0.5 + 0.3
    const offsetX = Math.random() < 0.5 ? Math.random() * 30 : 0
    const glitchWidth = 100 - offsetX

    html += `<div style="
      position: absolute;
      top: ${glitchY}%;
      left: ${offsetX}%;
      width: ${glitchWidth}%;
      height: ${glitchHeight}px;
      background-color: white;
      opacity: ${glitchAlpha.toFixed(2)};
      z-index: 10;
    "></div>`

    // Sometimes add a second line close to the first
    if (Math.random() < 0.4) {
      const secondLineOffset = Math.random() * 4 + 1
      html += `<div style="
        position: absolute;
        top: calc(${glitchY}% + ${glitchHeight}px + ${secondLineOffset}px);
        left: ${offsetX}%;
        width: ${glitchWidth * 0.9}%;
        height: ${glitchHeight * 0.8}px;
        background-color: white;
        opacity: ${(glitchAlpha * 0.7).toFixed(2)};
        z-index: 10;
      "></div>`
    }
  }

  element.innerHTML = html

  // Reset after duration
  setTimeout(() => {
    element.style.display = 'none'
    element.innerHTML = ''
  }, duration)
}

// Color shift artifacts
const createColorShift = (duration: number): void => {
  const element = document.querySelector('.crt-color-shift') as HTMLElement
  if (!element) return

  // Make element visible
  element.style.display = 'block'

  const shiftX = Math.random() * 70
  const shiftY = Math.random() * 100
  const shiftWidth = Math.random() * 20 + 15
  const shiftHeight = Math.random() * 40 + 15

  // Choose which color channel to shift
  const colorIndex = Math.floor(Math.random() * 5)
  const colors = [
    'rgba(255, 0, 0, 0.25)', // Red
    'rgba(0, 255, 0, 0.25)', // Green
    'rgba(0, 0, 255, 0.25)', // Blue
    'rgba(0, 255, 255, 0.25)', // Cyan
    'rgba(255, 0, 255, 0.25)' // Magenta
  ]
  const shiftColor = colors[colorIndex]

  // Create the color shift element
  element.innerHTML = `<div style="
    position: absolute;
    top: ${shiftY}%;
    left: ${shiftX}%;
    width: ${shiftWidth}%;
    height: ${shiftHeight}px;
    background-color: ${shiftColor};
    mix-blend-mode: screen;
    z-index: 10;
  "></div>`

  // Add complementary color shift
  if (Math.random() < 0.7) {
    const complementaryColors = [
      'rgba(0, 255, 255, 0.2)', // Cyan (complement to Red)
      'rgba(255, 0, 255, 0.2)', // Magenta (complement to Green)
      'rgba(255, 255, 0, 0.2)', // Yellow (complement to Blue)
      'rgba(255, 0, 0, 0.2)', // Red (complement to Cyan)
      'rgba(0, 255, 0, 0.2)' // Green (complement to Magenta)
    ]
    const compColor = complementaryColors[colorIndex]

    const offsetX = Math.random() * 30 - 15

    element.innerHTML += `<div style="
      position: absolute;
      top: calc(${shiftY}% + ${shiftHeight}px + ${Math.random() * 15}px);
      left: calc(${shiftX}% + ${offsetX}px);
      width: ${shiftWidth * 0.9}%;
      height: ${shiftHeight * 0.8}px;
      background-color: ${compColor};
      mix-blend-mode: screen;
      z-index: 10;
    "></div>`
  }

  // Reset after duration
  setTimeout(() => {
    element.style.display = 'none'
    element.innerHTML = ''
  }, duration)
}

// Setup and cleanup glitch effect
onMounted(() => {
  // Create glitches at random intervals
  const setupGlitchInterval = (): void => {
    if (glitchInterval) clearInterval(glitchInterval)

    glitchInterval = setInterval(() => {
      if (Math.random() < 0.5) {
        // 50% chance of glitch
        createGlitch()
      }
    }, 1000) // Check every 1 second
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
  display: flex;
  flex-direction: column;
  flex: 1;
}

.crt-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0) 51%
  );
  background-size: 100% 4px;
  z-index: 2;
  pointer-events: none;
  opacity: 0.4;
}

.crt-rgb-separation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.05) 0%, transparent 70%),
    radial-gradient(circle at 50.5% 50%, rgba(0, 255, 0, 0.05) 0%, transparent 70%),
    radial-gradient(circle at 49.5% 50%, rgba(0, 0, 255, 0.05) 0%, transparent 70%);
  z-index: 2;
  pointer-events: none;
  mix-blend-mode: screen;
}

.crt-vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 0.2) 100%);
  z-index: 3;
  pointer-events: none;
}

.crt-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 150px rgba(0, 255, 255, 0.3);
  background: radial-gradient(
    ellipse at center,
    rgba(0, 255, 255, 0.05) 0%,
    rgba(0, 255, 255, 0.02) 40%,
    transparent 100%
  );
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: screen;
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

.crt-content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.crt-glitch-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition:
    transform 0.1s,
    clip-path 0.1s;
  pointer-events: none;
  z-index: 2;
}

/* Glitch effect containers */
.crt-horizontal-glitch,
.crt-color-shift,
.crt-static-noise,
.crt-vertical-sync,
.crt-signal-jitter,
.crt-digital-corruption,
.crt-scan-distortion,
.crt-text-corruption,
.crt-pixel-displacement {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  display: none;
}

/* Effects are now controlled by the data-crt-effect attribute in global.css */

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
