<script setup lang="ts">
import { ref, onMounted } from 'vue'
import './Versions.css'

const versions = ref<Record<string, string>>({})

onMounted(async () => {
  try {
    const appVersion = await window.api.getAppVersion()
    versions.value = {
      app: appVersion,
      electron: process.versions.electron || '',
      chrome: process.versions.chrome || '',
      node: process.versions.node || ''
    }
  } catch (error) {
    console.error('Failed to get versions:', error)
  }
})
</script>

<template>
  <div class="versions">
    <div class="version-item">
      <span class="version-label">App:</span>
      <span class="version-value">{{ versions.app }}</span>
    </div>
    <div class="version-item">
      <span class="version-label">Electron:</span>
      <span class="version-value">{{ versions.electron }}</span>
    </div>
    <div class="version-item">
      <span class="version-label">Chrome:</span>
      <span class="version-value">{{ versions.chrome }}</span>
    </div>
    <div class="version-item">
      <span class="version-label">Node:</span>
      <span class="version-value">{{ versions.node }}</span>
    </div>
  </div>
</template>
