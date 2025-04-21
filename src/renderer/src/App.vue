<template>
  <div class="app-container">
    <CRTEffect>
      <TitleBar />
      <TopNavBar @menu-action="handleMenuAction" @open-settings="showSettings = true" />
      <TabBar @show-home="showHomePage = true" @hide-home="showHomePage = false" />

      <!-- Show HomePage when no tabs are open or when home is requested -->
      <HomePage v-if="!activeTabId || showHomePage" @transformation-opened="showHomePage = false" />

      <!-- Show dedicated transformation page for tabs -->
      <component
        :is="transformationComponent"
        v-else-if="activeTabId && activeTransformationId && transformationComponent"
        :tab-id="activeTabId"
      />

      <!-- Fallback to HomePage if something goes wrong -->
      <HomePage v-else />

      <StatusBar />

      <Settings v-if="showSettings" @close="closeSettings" />
      <About v-if="showAbout" @close="closeAbout" />
    </CRTEffect>

    <UpdateNotification ref="updateNotificationRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TabBar from './components/TabBar.vue'
import TopNavBar from './components/TopNavBar.vue'
import StatusBar from './components/StatusBar.vue'
import Settings from './components/Settings.vue'
import About from './components/About.vue'
import CRTEffect from './components/CRTEffect.vue'
import TitleBar from './components/TitleBar.vue'
import UpdateNotification from './components/UpdateNotification.vue'
import HomePage from './components/HomePage.vue'
import { useSettingsStore } from './store/settingsStore'
import { useTabsStore } from './store/tabsStore'
import { applyTheme } from './styles/themes'
import { getTransformationPageByTransformationId } from './components/transformations'

// Refs
const updateNotificationRef = ref<InstanceType<typeof UpdateNotification> | null>(null)
const showSettings = ref<boolean>(false)
const showAbout = ref<boolean>(false)
const showHomePage = ref<boolean>(true)

// Get stores
const settingsStore = useSettingsStore()
const tabsStore = useTabsStore()

// Watch for active tab changes to hide home page when a tab is activated
watch(
  () => tabsStore.activeTabId,
  (newActiveTabId) => {
    if (newActiveTabId) {
      showHomePage.value = false
    }

    // Ensure tab state is saved to disk when active tab changes
    tabsStore.saveTabsToDisk().catch((error) => {
      console.error('Failed to save tabs after active tab changed:', error)
    })
  }
)

// Computed properties for tab management
const activeTabId = computed(() => {
  return tabsStore.getActiveTabId
})

const activeTransformationId = computed(() => {
  const tab = tabsStore.getActiveTab
  return tab ? tab.transformationId : ''
})

// Get the component for the active transformation
const transformationComponent = computed(() => {
  if (!activeTransformationId.value) return null
  return getTransformationPageByTransformationId(activeTransformationId.value)
})

// Handle menu actions
const handleMenuAction = (action: string): void => {
  switch (action) {
    // File
    case 'checkForUpdates':
      checkForUpdates()
      break
    case 'about':
      showAbout.value = true
      break
    case 'settings':
      showSettings.value = true
      break
    case 'exit':
      window.close()
      break

    // Default
    default:
      console.error(`Menu action ${action} not found`)
      break
  }
}

// Close settings dialog
const closeSettings = (): void => {
  showSettings.value = false
}

// Close about dialog
const closeAbout = (): void => {
  showAbout.value = false
}

// Check for updates
const checkForUpdates = async (): Promise<void> => {
  try {
    updateNotificationRef.value.manualCheckUpdateStarted()
    window.api.checkForUpdates().then((result) => {
      if (!result.updateAvailable) {
        updateNotificationRef.value.manualCheckUpdateCompletedUpdateNotAvailable()
      }
    })
  } catch (error) {
    alert(`Error checking for updates: ${error.message}`)
  }
}

// Save state before window unloads
const saveStateBeforeUnload = (): void => {
  // We can't use async/await in beforeunload, so we'll just trigger the save
  // The actual saving will happen asynchronously, but at least we've initiated it
  try {
    // Create the state object to save (only tabs structure, not content)
    const state = {
      tabs: tabsStore.tabs,
      activeTabId: tabsStore.activeTabId,
      version: '1.0'
    }

    // Save state to disk (this is async but we've at least triggered it)
    window.api.saveAppState({ state: JSON.stringify(state) })
  } catch (error) {
    console.error('Failed to save tabs before unload:', error)
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Apply the current theme
  applyTheme(settingsStore.theme)

  // Apply font settings
  document.documentElement.style.setProperty('--fontSize', `${settingsStore.fontSize}px`)
  document.documentElement.style.setProperty('--fontFamily', settingsStore.fontFamily)

  // Initialize tabs from disk
  try {
    await tabsStore.initializeFromDisk()

    // If we have tabs, update the showHomePage state
    if (tabsStore.tabs.length > 0 && tabsStore.activeTabId) {
      showHomePage.value = false
    }
  } catch (error) {
    console.error('Error initializing tabs from disk:', error)
  }

  // Check for updates on startup if enabled
  if (settingsStore.autoUpdate && settingsStore.checkForUpdatesOnStartup) {
    // Wait a bit before checking for updates to ensure the app is fully loaded
    setTimeout(() => {
      window.api.checkForUpdates().catch((error) => {
        console.error('Error checking for updates on startup:', error)
      })
    }, 5000)
  }

  // Add event listener for beforeunload to save state
  window.addEventListener('beforeunload', saveStateBeforeUnload)
})

// Clean up event listeners
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', saveStateBeforeUnload)
})
</script>

<style>
@import './styles/global.css';

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Ensure the CRTEffect container takes full height */
.app-container > div {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
