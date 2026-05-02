<script setup lang="ts">
import { ref, onMounted } from 'vue'
import './UpdateNotification.css'

const props = defineProps<{
  show: boolean
  onClose: () => void
}>()

const showManualCheckUpdateStartedNotification = ref(false)
const showManualCheckUpdateCompletedUpdateNotAvailableNotification = ref(false)
const showUpdateAvailableNotification = ref(false)
const showUpdateErrorNotification = ref(false)

const updateInfo = ref<{ version: string; releaseNotes?: string } | null>(null)
const isDownloading = ref(false)
const isInstalling = ref(false)
const downloadButtonText = ref('Download Update')
const updateReadyToInstall = ref(false)
const lastError = ref<string>('')
const copyErrorButtonText = ref('Copy details')

defineExpose({
  manualCheckUpdateStarted: (): void => {
    showManualCheckUpdateStartedNotification.value = true
    showManualCheckUpdateCompletedUpdateNotAvailableNotification.value = false
    showUpdateAvailableNotification.value = false
    props.onClose()
  },
  manualCheckUpdateCompletedUpdateNotAvailable: (): void => {
    showManualCheckUpdateStartedNotification.value = false
    showManualCheckUpdateCompletedUpdateNotAvailableNotification.value = true
    showUpdateAvailableNotification.value = false
  }
})

const closeNotification = (): void => {
  showManualCheckUpdateStartedNotification.value = false
  showManualCheckUpdateCompletedUpdateNotAvailableNotification.value = false
  showUpdateAvailableNotification.value = false
  showUpdateErrorNotification.value = false
  props.onClose()
}

const showError = (error: string): void => {
  lastError.value = error
  showManualCheckUpdateStartedNotification.value = false
  showUpdateErrorNotification.value = true
}

const retryDownload = async (): Promise<void> => {
  showUpdateErrorNotification.value = false
  showUpdateAvailableNotification.value = true
  await downloadUpdate()
}

const copyErrorDetails = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(lastError.value)
    copyErrorButtonText.value = 'Copied'
    setTimeout(() => {
      copyErrorButtonText.value = 'Copy details'
    }, 1500)
  } catch (error) {
    console.error('Failed to copy error details:', error)
  }
}

const checkForUpdates = async (): Promise<void> => {
  try {
    const result = await window.api.checkForUpdates()
    if (result.updateAvailable) {
      updateInfo.value = {
        version: result.version,
        releaseNotes: result.releaseNotes
      }
      showManualCheckUpdateStartedNotification.value = false
      showUpdateAvailableNotification.value = true
    } else {
      updateInfo.value = null
      showManualCheckUpdateStartedNotification.value = false
      showManualCheckUpdateCompletedUpdateNotAvailableNotification.value = true
    }
  } catch (error) {
    console.error('Failed to check for updates:', error)
    showError(error instanceof Error ? error.message : String(error))
  }
}

const downloadUpdate = async (): Promise<void> => {
  try {
    isDownloading.value = true
    downloadButtonText.value = 'Downloading (0%)...'
    await window.api.downloadUpdate()
  } catch (error) {
    console.error('Failed to download update:', error)
    isDownloading.value = false
    downloadButtonText.value = 'Download Update'
    showError(error instanceof Error ? error.message : String(error))
  }
}

const installUpdate = async (): Promise<void> => {
  try {
    isInstalling.value = true
    const result = await window.api.installUpdate()
    if (result.success) {
      // The app will restart automatically
    } else if (result.isDev) {
      showError('Update installation skipped in development mode.')
      isInstalling.value = false
    } else {
      showError('Failed to install update. Please try again later.')
      isInstalling.value = false
    }
  } catch (error) {
    console.error('Failed to install update:', error)
    isInstalling.value = false
    showError(error instanceof Error ? error.message : String(error))
  }
}

onMounted(() => {
  const ipc = window.electron?.ipcRenderer
  if (!ipc) return

  ipc.on('update-available', ((..._args: unknown[]) => {
    const info = _args[1] as { version: string; releaseNotes?: string }
    updateInfo.value = info
    showManualCheckUpdateStartedNotification.value = false
    showUpdateAvailableNotification.value = true
  }) as (...args: unknown[]) => void)

  ipc.on('download-progress', ((..._args: unknown[]) => {
    const progress = _args[1] as { percent: number }
    downloadButtonText.value = `Downloading (${Math.trunc(progress.percent)}%)...`
  }) as (...args: unknown[]) => void)

  ipc.on('update-downloaded', ((..._args: unknown[]) => {
    const info = _args[1] as { version: string; releaseNotes?: string }
    updateInfo.value = info
    isDownloading.value = false
    updateReadyToInstall.value = true
  }) as (...args: unknown[]) => void)

  ipc.on('update-error', ((..._args: unknown[]) => {
    const error = _args[1] as string
    if (isDownloading.value) {
      isDownloading.value = false
      updateReadyToInstall.value = false
      downloadButtonText.value = 'Download Update'
    }
    showError(error)
  }) as (...args: unknown[]) => void)
})
</script>

<template>
  <div v-if="showManualCheckUpdateStartedNotification" class="update-notification">
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h3>Checking for updates</h3>
        <button class="close-button" aria-label="Close" @click="closeNotification">✕</button>
      </div>
      <div class="update-notification-body">
        <p>Looking for a newer version…</p>
      </div>
    </div>
  </div>

  <div
    v-else-if="showManualCheckUpdateCompletedUpdateNotAvailableNotification"
    class="update-notification"
  >
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h3>Update check complete</h3>
        <button class="close-button" aria-label="Close" @click="closeNotification">✕</button>
      </div>
      <div class="update-notification-body">
        <p>You're already on the latest version.</p>
      </div>
    </div>
  </div>

  <div v-else-if="showUpdateAvailableNotification" class="update-notification">
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h3>Update available</h3>
        <button class="close-button" aria-label="Close" @click="closeNotification">✕</button>
      </div>
      <div class="update-notification-body">
        <p>A new version ({{ updateInfo?.version }}) is available.</p>

        <p
          v-if="updateInfo?.releaseNotes"
          class="release-notes"
          v-html="updateInfo.releaseNotes"
        ></p>

        <div class="update-notification-actions">
          <button v-if="!updateReadyToInstall" :disabled="isDownloading" @click="downloadUpdate">
            {{ downloadButtonText }}
          </button>
          <button v-else @click="installUpdate">Install</button>
          <button @click="closeNotification">Close</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="showUpdateErrorNotification" class="update-notification">
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h3>Update error</h3>
        <button class="close-button" aria-label="Close" @click="closeNotification">✕</button>
      </div>
      <div class="update-notification-body">
        <p>The update could not be completed.</p>
        <pre class="update-error-details">{{ lastError }}</pre>
        <div class="update-notification-actions">
          <button v-if="updateInfo" @click="retryDownload">Retry</button>
          <button @click="copyErrorDetails">{{ copyErrorButtonText }}</button>
          <button @click="closeNotification">Close</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="show" class="update-notification">
    <div class="update-notification-content">
      <div class="update-notification-header">
        <h2>Update</h2>
        <button class="close-button" aria-label="Close" @click="onClose">✕</button>
      </div>

      <div class="update-notification-body">
        <template v-if="updateInfo">
          <p>A new version is available: v{{ updateInfo.version }}</p>

          <div v-if="updateInfo.releaseNotes" class="release-notes">
            <h3>Release Notes:</h3>
            <div v-html="updateInfo.releaseNotes"></div>
          </div>

          <div class="update-actions">
            <button
              class="action-button"
              :disabled="isDownloading || isInstalling"
              @click="downloadUpdate"
            >
              {{ isDownloading ? 'Downloading...' : 'Download Update' }}
            </button>

            <button
              class="action-button install-button"
              :disabled="isDownloading || isInstalling"
              @click="installUpdate"
            >
              {{ isInstalling ? 'Installing...' : 'Install Update' }}
            </button>
          </div>
        </template>

        <div v-else class="check-update">
          <p>Check for available updates</p>
          <button class="action-button" @click="checkForUpdates">Check for Updates</button>
        </div>
      </div>
    </div>
  </div>
</template>
