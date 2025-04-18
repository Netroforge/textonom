<template>
  <div v-if="showNotification" class="update-notification">
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h3>Update Available</h3>
        <button @click="closeNotification" class="close-button">✕</button>
      </div>
      <div class="update-notification-body">
        <p>A new version ({{ updateInfo.version }}) is available.</p>
        <p v-if="updateInfo.releaseNotes" class="release-notes">
          {{ updateInfo.releaseNotes }}
        </p>
        <div class="update-notification-actions">
          <button @click="downloadAndInstall" :disabled="downloading">
            {{ downloadButtonText }}
          </button>
          <button @click="closeNotification">Remind Me Later</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// State
const showNotification = ref(false)
const updateInfo = ref({
  version: '',
  releaseNotes: ''
})
const downloading = ref(false)
const downloadButtonText = ref('Download and Install')

// Methods
const closeNotification = () => {
  showNotification.value = false
}

const downloadAndInstall = async () => {
  try {
    downloading.value = true
    downloadButtonText.value = 'Downloading...'

    const result = await window.api.downloadUpdate()

    if (result.success) {
      downloadButtonText.value = 'Installing...'
      await window.api.installUpdate()
    } else {
      if (result.isDev) {
        alert('Cannot download updates in development mode')
      } else {
        alert(`Error downloading update: ${result.error || 'Unknown error'}`)
      }
      downloading.value = false
      downloadButtonText.value = 'Download and Install'
    }
  } catch (error) {
    alert(`Error: ${error.message}`)
    downloading.value = false
    downloadButtonText.value = 'Download and Install'
  }
}

// Event listeners
const handleUpdateAvailable = (_, info) => {
  updateInfo.value = info
  showNotification.value = true
}

const handleUpdateDownloaded = (_, info) => {
  updateInfo.value = info
  downloading.value = false
  downloadButtonText.value = 'Install Now'
}

const handleUpdateError = (_, error) => {
  if (downloading.value) {
    alert(`Update error: ${error}`)
    downloading.value = false
    downloadButtonText.value = 'Download and Install'
  }
}

// Lifecycle hooks
onMounted(() => {
  // Listen for update events from the main process
  window.electron.ipcRenderer.on('update-available', handleUpdateAvailable)
  window.electron.ipcRenderer.on('update-downloaded', handleUpdateDownloaded)
  window.electron.ipcRenderer.on('update-error', handleUpdateError)
})

onBeforeUnmount(() => {
  // Remove event listeners
  window.electron.ipcRenderer.removeListener('update-available', handleUpdateAvailable)
  window.electron.ipcRenderer.removeListener('update-downloaded', handleUpdateDownloaded)
  window.electron.ipcRenderer.removeListener('update-error', handleUpdateError)
})
</script>

<style scoped>
.update-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 350px;
  max-width: 90vw;
  overflow: hidden;
}

.update-notification-content {
  padding: 15px;
}

.update-notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.update-notification-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.update-notification-body {
  color: var(--text-color);
}

.release-notes {
  max-height: 100px;
  overflow-y: auto;
  margin: 10px 0;
  padding: 10px;
  background-color: var(--background-secondary-color);
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-line;
}

.update-notification-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.update-notification-actions button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: var(--button-background-color);
  color: var(--button-text-color);
  border: 1px solid var(--border-color);
}

.update-notification-actions button:first-child {
  background-color: var(--primary-color);
  color: white;
}

.update-notification-actions button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
