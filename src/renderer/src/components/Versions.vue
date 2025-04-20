<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
  </ul>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// Define interface for versions
interface Versions {
  electron: string
  chrome: string
  node: string
  [key: string]: string
}

const versions = reactive<Versions>({
  electron: window.electron.process.versions.electron || '',
  chrome: window.electron.process.versions.chrome || '',
  node: window.electron.process.versions.node || '',
  ...window.electron.process.versions
})
</script>
