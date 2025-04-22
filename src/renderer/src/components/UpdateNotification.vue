<template>
  <div v-if="showManualCheckUpdateStartedNotification" class="update-notification">
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h3>Checking for updates</h3>
        <button class="close-button" @click="closeNotification">✕</button>
      </div>
      <div class="update-notification-body">
        <p>In progress...</p>
      </div>
    </div>
  </div>

  <div
    v-if="showManualCheckUpdateCompletedUpdateNotAvailableNotification"
    class="update-notification"
  >
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h3>Updates check completed</h3>
        <button class="close-button" @click="closeNotification">✕</button>
      </div>
      <div class="update-notification-body">
        <p>You are using latest version</p>
      </div>
    </div>
  </div>

  <div v-if="showUpdateAvailableNotification" class="update-notification">
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h3>Update Available</h3>
        <button class="close-button" @click="closeNotification">✕</button>
      </div>
      <div class="update-notification-body">
        <p>A new version ({{ updateInfo.version }}) is available.</p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-if="updateInfo.releaseNotes" class="release-notes" v-html="updateInfo.releaseNotes" />
        <div class="update-notification-actions">
          <button v-if="!updateReadyToInstall" :disabled="downloading" @click="downloadUpdate">
            {{ downloadButtonText }}
          </button>
          <button v-if="updateReadyToInstall" @click="installUpdate">Install</button>
          <button @click="closeNotification">Remind Me Later</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// State
const showManualCheckUpdateStartedNotification = ref<boolean>(false)
const showManualCheckUpdateCompletedUpdateNotAvailableNotification = ref<boolean>(false)
const showUpdateAvailableNotification = ref<boolean>(false)

interface UpdateInfo {
  version: string
  releaseNotes: string
}

const updateInfo = ref<UpdateInfo>({
  version: '',
  releaseNotes: ''
})
const downloading = ref<boolean>(false)
const downloadButtonText = ref<string>('Download')
const updateReadyToInstall = ref<boolean>(false)

// Methods
const manualCheckUpdateStarted = (): void => {
  showManualCheckUpdateStartedNotification.value = true
  showManualCheckUpdateCompletedUpdateNotAvailableNotification.value = false
  showUpdateAvailableNotification.value = false
}

const manualCheckUpdateCompletedUpdateNotAvailable = (): void => {
  showManualCheckUpdateStartedNotification.value = false
  showManualCheckUpdateCompletedUpdateNotAvailableNotification.value = true
  showUpdateAvailableNotification.value = false
}

const closeNotification = (): void => {
  showManualCheckUpdateStartedNotification.value = false
  showManualCheckUpdateCompletedUpdateNotAvailableNotification.value = false
  showUpdateAvailableNotification.value = false
}

const downloadUpdate = async (): Promise<void> => {
  try {
    downloading.value = true
    downloadButtonText.value = 'Downloading (0%)...'
    window.api.downloadUpdate()
  } catch (error) {
    alert(`Error: ${error.message}`)
    downloading.value = false
    downloadButtonText.value = 'Download'
  }
}

const installUpdate = async (): Promise<void> => {
  try {
    await window.api.installUpdate()
    updateReadyToInstall.value = false
    showUpdateAvailableNotification.value = false
  } catch (error) {
    alert(`Error: ${error.message}`)
  }
}

// Event listeners
const handleUpdateAvailable = (_: never, info: UpdateInfo): void => {
  updateInfo.value = info
  showManualCheckUpdateStartedNotification.value = false
  showUpdateAvailableNotification.value = true
}

const handleDownloadProgress = (_: never, progress: { percent: number }): void => {
  const percentTrunc = Math.trunc(progress.percent)
  downloadButtonText.value = `Downloading (${percentTrunc}%)...`
}

const handleUpdateDownloaded = (_: never, info: UpdateInfo): void => {
  updateInfo.value = info
  downloading.value = false
  updateReadyToInstall.value = true
}

const handleUpdateError = (_: never, error: string): void => {
  if (downloading.value) {
    alert(`Update error: ${error}`)
    downloading.value = false
    updateReadyToInstall.value = false
    downloadButtonText.value = 'Download'
  }
}

// Lifecycle hooks
onMounted(() => {
  // Listen for update events from the main process
  window.electron.ipcRenderer.on('update-available', handleUpdateAvailable)
  window.electron.ipcRenderer.on('download-progress', handleDownloadProgress)
  window.electron.ipcRenderer.on('update-downloaded', handleUpdateDownloaded)
  window.electron.ipcRenderer.on('update-error', handleUpdateError)
})

onBeforeUnmount(() => {
  // Remove event listeners
  window.electron.ipcRenderer.off('update-available', handleUpdateAvailable)
  window.electron.ipcRenderer.off('download-progress', handleDownloadProgress)
  window.electron.ipcRenderer.off('update-downloaded', handleUpdateDownloaded)
  window.electron.ipcRenderer.off('update-error', handleUpdateError)
})

defineExpose({
  manualCheckUpdateStarted,
  manualCheckUpdateCompletedUpdateNotAvailable
})
</script>

<style scoped>
.update-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 1);
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
  color: var(--text);
}

.close-button {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.update-notification-body {
  color: var(--text);
}

.release-notes {
  max-height: 100px;
  overflow-y: auto;
  margin: 10px 0;
  padding: 10px;
  background-color: var(--background);
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
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.update-notification-actions button:first-child {
  background-color: var(--primary);
  color: white;
}

.update-notification-actions button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
