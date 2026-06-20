<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getAllCategories } from '../transformations/registry'
import './About.css'

const props = defineProps<{
  onClose: () => void
}>()

const handleKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') props.onClose()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const appVersion = ref<string>('Unknown')

const featureCategories = getAllCategories().map((c) => ({
  name: c.name,
  count: c.transformations.length
}))

const onOverlayClick = (e: MouseEvent, onClose: () => void): void => {
  if ((e.target as HTMLElement).className === 'about-overlay') {
    onClose()
  }
}

onMounted(async () => {
  try {
    appVersion.value = await window.api.getAppVersion()
  } catch (error) {
    console.error('Failed to get app version:', error)
  }
})
</script>

<template>
  <div class="about-overlay" @click="(e) => onOverlayClick(e, onClose)">
    <div class="about-container">
      <div class="about-header">
        <h2>About Textonom</h2>
        <button class="close-button" aria-label="Close" @click="onClose">✕</button>
      </div>

      <div class="about-content">
        <div class="about-logo"></div>

        <h1>Textonom</h1>
        <p class="version">Version {{ appVersion }}</p>

        <p class="description">
          A text editor that lets you perform common text transformations locally.
        </p>

        <div class="about-section">
          <h3>Features</h3>
          <ul>
            <li v-for="cat in featureCategories" :key="cat.name">
              {{ cat.name }} ({{ cat.count }})
            </li>
          </ul>
        </div>

        <div class="about-section">
          <h3>Credits</h3>
          <p>
            Created by
            <a href="https://netroforge.github.io" target="_blank" rel="noopener noreferrer">
              Netroforge
            </a>
          </p>
          <p>
            <a
              href="https://github.com/Netroforge/textonom"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </p>
        </div>

        <div class="about-section">
          <h3>Support the Project</h3>
          <p>If you find Textonom useful, consider supporting its development:</p>
          <ul>
            <li>
              <a
                href="https://github.com/sponsors/Netroforge"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Sponsors
              </a>
            </li>
            <li>
              <a href="https://ko-fi.com/netroforge" target="_blank" rel="noopener noreferrer">
                Ko-fi
              </a>
            </li>
            <li>
              <a
                href="https://opencollective.com/netroforge"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Collective
              </a>
            </li>
            <li>
              <a href="https://patreon.com/Netroforge" target="_blank" rel="noopener noreferrer">
                Patreon
              </a>
            </li>
          </ul>
        </div>

        <div class="about-section">
          <h3>License</h3>
          <p>This software is open source and available under the Apache License 2.0.</p>
        </div>
      </div>
    </div>
  </div>
</template>
