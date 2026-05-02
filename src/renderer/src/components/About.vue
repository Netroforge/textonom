<script setup lang="ts">
import { ref, onMounted } from 'vue'
import './About.css'

defineProps<{
  onClose: () => void
}>()

const appVersion = ref<string>('Unknown')

onMounted(async () => {
  try {
    appVersion.value = await window.api.getAppVersion()
  } catch (error) {
    console.error('Failed to get app version:', error)
  }
})
</script>

<template>
  <div class="about-overlay">
    <div class="about-container">
      <div class="about-header">
        <h2>About Textonom</h2>
        <button class="close-button" @click="onClose">✕</button>
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
            <li>Base64 encoding/decoding</li>
            <li>JSON formatting and minification</li>
            <li>URL encoding/decoding</li>
            <li>Case conversion</li>
            <li>XML formatting</li>
            <li>Line operations</li>
            <li>HTML encoding/decoding</li>
            <li>Cryptographic hashing</li>
            <li>Format conversion (JSON/YAML)</li>
            <li>And more...</li>
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
          <h3>License</h3>
          <p>
            This software is open source and available under the Apache License Version 2.0
            license.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
