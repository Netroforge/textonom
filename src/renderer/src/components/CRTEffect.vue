<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import './CRTEffect.css'

const isVisible = ref(true)
let glitchInterval: number | null = null
let animationFrame: number | null = null
let observer: MutationObserver | null = null
let initialGlitchTimeout: number | null = null

const createBasicGlitch = (duration: number): void => {
  const glitchElement = document.querySelector('.crt-glitch-overlay') as HTMLElement | null
  if (!glitchElement) return

  const xOffset = Math.random() * 15 - 7.5
  glitchElement.style.transform = `translateX(${xOffset}px)`

  const top = Math.random() * 15
  const bottom = 100 - Math.random() * 15
  glitchElement.style.clipPath = `polygon(0 ${top}%, 100% ${top}%, 100% ${bottom}%, 0 ${bottom}%)`
  glitchElement.style.display = 'block'

  const resetTime = performance.now() + duration
  const resetGlitch = (timestamp: number): void => {
    if (timestamp >= resetTime) {
      glitchElement.style.transform = 'translateX(0)'
      glitchElement.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
    } else {
      requestAnimationFrame(resetGlitch)
    }
  }
  requestAnimationFrame(resetGlitch)
}

const createHorizontalGlitch = (duration: number): void => {
  const element = document.querySelector('.crt-horizontal-glitch') as HTMLElement | null
  if (!element) return

  element.style.display = 'block'

  const numLines = Math.floor(Math.random() * 5) + 3
  let html = ''

  for (let i = 0; i < numLines; i++) {
    const glitchY = Math.random() * 100
    const glitchHeight = Math.random() * 10 + 3
    const glitchAlpha = Math.random() * 0.6 + 0.4
    const offsetX = Math.random() < 0.5 ? Math.random() * 30 : 0
    const glitchWidth = 100 - offsetX

    const animationDuration = Math.random() * 0.2 + 0.1
    const animationDelay = Math.random() * 0.1

    html += `<div style="
      position: absolute;
      top: ${glitchY}%;
      left: ${offsetX}%;
      width: ${glitchWidth}%;
      height: ${glitchHeight}px;
      background-color: white;
      opacity: ${glitchAlpha.toFixed(2)};
      z-index: 10;
      will-change: transform, opacity;
      animation: glitch-flicker ${animationDuration}s ease-in-out ${animationDelay}s;
    "></div>`

    if (Math.random() < 0.6) {
      const secondLineOffset = Math.random() * 5 + 1
      html += `<div style="
        position: absolute;
        top: calc(${glitchY}% + ${glitchHeight}px + ${secondLineOffset}px);
        left: ${offsetX}%;
        width: ${glitchWidth * 0.9}%;
        height: ${glitchHeight * 0.8}px;
        background-color: white;
        opacity: ${(glitchAlpha * 0.8).toFixed(2)};
        z-index: 10;
        will-change: transform, opacity;
        animation: glitch-flicker ${animationDuration * 1.2}s ease-in-out ${animationDelay * 1.5}s;
      "></div>`
    }
  }

  html += `<style>
    @keyframes glitch-flicker {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }
  </style>`

  element.innerHTML = html

  const resetTime = performance.now() + duration
  const resetGlitch = (timestamp: number): void => {
    if (timestamp >= resetTime) {
      element.style.display = 'none'
      element.innerHTML = ''
    } else {
      requestAnimationFrame(resetGlitch)
    }
  }
  requestAnimationFrame(resetGlitch)
}

const createColorShift = (duration: number): void => {
  const element = document.querySelector('.crt-color-shift') as HTMLElement | null
  if (!element) return

  element.style.display = 'block'

  const shiftX = Math.random() * 70
  const shiftY = Math.random() * 100
  const shiftWidth = Math.random() * 25 + 20
  const shiftHeight = Math.random() * 50 + 20

  const colorIndex = Math.floor(Math.random() * 5)
  const colors = [
    'rgba(255, 0, 0, 0.35)',
    'rgba(0, 255, 0, 0.35)',
    'rgba(0, 0, 255, 0.35)',
    'rgba(0, 255, 255, 0.35)',
    'rgba(255, 0, 255, 0.35)'
  ]
  const shiftColor = colors[colorIndex]

  const animationDuration = Math.random() * 0.3 + 0.2
  const animationDelay = Math.random() * 0.1

  element.innerHTML = `<div style="
    position: absolute;
    top: ${shiftY}%;
    left: ${shiftX}%;
    width: ${shiftWidth}%;
    height: ${shiftHeight}px;
    background-color: ${shiftColor};
    mix-blend-mode: screen;
    z-index: 10;
    will-change: transform, opacity;
    animation: color-shift-pulse ${animationDuration}s ease-in-out ${animationDelay}s;
  "></div>`

  if (Math.random() < 0.9) {
    const complementaryColors = [
      'rgba(0, 255, 255, 0.3)',
      'rgba(255, 0, 255, 0.3)',
      'rgba(255, 255, 0, 0.3)',
      'rgba(255, 0, 0, 0.3)',
      'rgba(0, 255, 0, 0.3)'
    ]
    const compColor = complementaryColors[colorIndex]
    const offsetX = Math.random() * 35 - 17.5
    const compAnimationDuration = Math.random() * 0.4 + 0.3
    const compAnimationDelay = Math.random() * 0.15

    element.innerHTML += `<div style="
      position: absolute;
      top: calc(${shiftY}% + ${shiftHeight}px + ${Math.random() * 20}px);
      left: calc(${shiftX}% + ${offsetX}px);
      width: ${shiftWidth * 0.95}%;
      height: ${shiftHeight * 0.9}px;
      background-color: ${compColor};
      mix-blend-mode: screen;
      z-index: 10;
      will-change: transform, opacity;
      animation: color-shift-pulse ${compAnimationDuration}s ease-in-out ${compAnimationDelay}s;
    "></div>`
  }

  element.innerHTML += `<style>
    @keyframes color-shift-pulse {
      0% { opacity: 1; transform: translateX(0); }
      25% { opacity: 0.8; transform: translateX(2px); }
      50% { opacity: 1; transform: translateX(-1px); }
      75% { opacity: 0.9; transform: translateX(1px); }
      100% { opacity: 1; transform: translateX(0); }
    }
  </style>`

  const resetTime = performance.now() + duration
  const resetGlitch = (timestamp: number): void => {
    if (timestamp >= resetTime) {
      element.style.display = 'none'
      element.innerHTML = ''
    } else {
      requestAnimationFrame(resetGlitch)
    }
  }
  requestAnimationFrame(resetGlitch)
}

const createGlitch = (): void => {
  const crtEffectValue = document.documentElement.getAttribute('data-crt-effect')
  if (crtEffectValue !== 'true' || !isVisible.value) return

  const createMultiple = Math.random() < 0.15

  if (createMultiple) {
    const firstType = Math.floor(Math.random() * 3)
    let secondType = Math.floor(Math.random() * 3)
    while (secondType === firstType) {
      secondType = Math.floor(Math.random() * 3)
    }

    const duration1 = 200 + Math.random() * 400
    const duration2 = 150 + Math.random() * 300

    switch (firstType) {
      case 0:
        createBasicGlitch(duration1)
        break
      case 1:
        createHorizontalGlitch(duration1)
        break
      case 2:
        createColorShift(duration1)
        break
    }

    setTimeout(() => {
      switch (secondType) {
        case 0:
          createBasicGlitch(duration2)
          break
        case 1:
          createHorizontalGlitch(duration2)
          break
        case 2:
          createColorShift(duration2)
          break
      }
    }, 50)
  } else {
    const glitchType = Math.floor(Math.random() * 3)
    const duration = 200 + Math.random() * 450

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
}

const setupGlitchInterval = (visible: boolean): void => {
  if (glitchInterval !== null) {
    clearInterval(glitchInterval)
  }
  glitchInterval = window.setInterval(() => {
    if (!visible) return
    if (Math.random() < 0.3) {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame)
      const forceGlitch = Math.random() < 0.1
      if (forceGlitch) {
        createGlitch()
      } else {
        animationFrame = requestAnimationFrame(createGlitch)
      }
    }
  }, 1000)
}

const handleCrtEffectChange = (): void => {
  const crtEffectValue = document.documentElement.getAttribute('data-crt-effect')
  if (crtEffectValue === 'true') {
    isVisible.value = true
    document
      .querySelectorAll('.crt-glitch-overlay, .crt-horizontal-glitch, .crt-color-shift')
      .forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.display = 'block'
        }
      })
    setTimeout(() => {
      if (Math.random() < 0.5) createGlitch()
    }, 1000)
    setupGlitchInterval(true)
  } else {
    if (glitchInterval !== null) {
      clearInterval(glitchInterval)
      glitchInterval = null
    }
  }
}

onMounted(() => {
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-crt-effect') {
        handleCrtEffectChange()
      }
    })
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-crt-effect']
  })

  if (document.documentElement.getAttribute('data-crt-effect') === 'true') {
    handleCrtEffectChange()
  }

  initialGlitchTimeout = window.setTimeout(() => {
    if (Math.random() < 0.5) {
      try {
        createGlitch()
      } catch (error) {
        console.error('ERROR CREATING INITIAL GLITCH:', error)
      }
    }
    if (Math.random() < 0.3) {
      try {
        const glitchElement = document.querySelector('.crt-glitch-overlay') as HTMLElement | null
        if (glitchElement) {
          glitchElement.style.display = 'block'
          glitchElement.style.transform = 'translateX(10px)'
          setTimeout(() => {
            glitchElement.style.transform = 'translateX(0)'
          }, 600)
        }
      } catch (directError) {
        console.error('ERROR IN DIRECT GLITCH CREATION:', directError)
      }
    }
  }, 1000)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (glitchInterval !== null) clearInterval(glitchInterval)
  if (animationFrame !== null) cancelAnimationFrame(animationFrame)
  if (initialGlitchTimeout !== null) clearTimeout(initialGlitchTimeout)
})
</script>

<template>
  <div class="crt-container crt-flicker">
    <div class="crt-content">
      <slot />
    </div>
    <div class="crt-glitch-overlay" data-text="GLITCH" style="display: block"></div>
    <div class="crt-scanlines"></div>
    <div class="crt-rgb-separation"></div>
    <div class="crt-vignette"></div>
    <div class="crt-glow"></div>
    <div class="crt-flicker-overlay"></div>
    <div class="crt-horizontal-glitch" style="display: block"></div>
    <div class="crt-color-shift" style="display: block"></div>
    <div class="crt-static-noise"></div>
    <div class="crt-vertical-sync"></div>
    <div class="crt-signal-jitter"></div>
    <div class="crt-digital-corruption"></div>
    <div class="crt-scan-distortion"></div>
    <div class="crt-text-corruption"></div>
    <div class="crt-pixel-displacement"></div>
  </div>
</template>
