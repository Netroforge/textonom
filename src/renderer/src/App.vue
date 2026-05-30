<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import TitleBar from './components/TitleBar.vue'
import TopNavBar from './components/TopNavBar.vue'
import TabBar from './components/TabBar.vue'
import StatusBar from './components/StatusBar.vue'
import HomePage from './components/HomePage.vue'
import Settings from './components/Settings.vue'
import About from './components/About.vue'
import CRTEffect from './components/CRTEffect.vue'
import UpdateNotification from './components/UpdateNotification.vue'
import Toast from './components/Toast.vue'
import { applyTheme, type ThemeType } from './styles/themes'
import { getTransformationPageComponent } from './components/transformations'
import { useSettingsStore } from './stores/settingsStore'
import { useTabsStore } from './stores/tabsStore'
import { useUIStore } from './stores/uiStore'
import { useWindowStore } from './stores/windowStore'
import './styles/global.css'

const updateNotificationRef = ref<{
  manualCheckUpdateStarted: () => void
  manualCheckUpdateCompletedUpdateNotAvailable: () => void
} | null>(null)

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

const tabsStore = useTabsStore()
const { tabs, activeTabId, showHomePage } = storeToRefs(tabsStore)
const { setShowHomePage } = tabsStore

const uiStore = useUIStore()
const { ui } = storeToRefs(uiStore)
const { setShowSettings, setShowAbout, setShowUpdateNotification } = uiStore

const windowStore = useWindowStore()
const { setWindowState } = windowStore

const activeTransformationId = computed((): string | null => {
  if (!activeTabId.value) return null
  return tabs.value.find((tab) => tab.id === activeTabId.value)?.transformationId || null
})

const TransformationComponent = computed(() => {
  return activeTransformationId.value
    ? getTransformationPageComponent(activeTransformationId.value)
    : null
})

const checkForUpdates = async (): Promise<void> => {
  try {
    setShowUpdateNotification(true)
    if (updateNotificationRef.value) {
      updateNotificationRef.value.manualCheckUpdateStarted()
      window.api.checkForUpdates().then((result) => {
        if (!result.updateAvailable && updateNotificationRef.value) {
          updateNotificationRef.value.manualCheckUpdateCompletedUpdateNotAvailable()
        }
      })
    }
  } catch (error) {
    alert(`Error checking for updates: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const handleMenuAction = (action: string): void => {
  switch (action) {
    case 'checkForUpdates':
      checkForUpdates()
      break
    case 'about':
      setShowAbout(true)
      break
    case 'settings':
      setShowSettings(true)
      break
    case 'exit':
      window.close()
      break
    default:
      console.error(`Menu action ${action} not found`)
      break
  }
}

const closeSettings = (): void => setShowSettings(false)
const closeAbout = (): void => setShowAbout(false)

const saveStateBeforeUnload = (): void => {
  // Persistence runs on store mutations; nothing to do here.
}

let unsubscribeWindowState: (() => void) | null = null

onMounted(() => {
  applyTheme(settings.value.theme as ThemeType)

  document.documentElement.style.setProperty('--fontSize', `${settings.value.fontSize}px`)
  document.documentElement.style.setProperty('--fontFamily', settings.value.fontFamily)

  const appContainer = document.querySelector('.app-container')
  if (appContainer) {
    if (settings.value.wordWrap) {
      appContainer.classList.add('word-wrap-enabled')
    } else {
      appContainer.classList.add('word-wrap-disabled')
    }
  }

  if (settings.value.autoUpdate && settings.value.checkForUpdatesOnStartup) {
    setTimeout(() => {
      window.api.checkForUpdates().catch((error) => {
        console.error('Error checking for updates on startup:', error)
      })
    }, 5000)
  }

  window.addEventListener('beforeunload', saveStateBeforeUnload)

  unsubscribeWindowState = window.api.onWindowStateUpdated((windowState) => {
    setWindowState(windowState)
  })
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', saveStateBeforeUnload)
  if (unsubscribeWindowState) unsubscribeWindowState()
})

watch(
  () => settings.value.theme,
  (theme) => applyTheme(theme as ThemeType)
)
watch(
  () => settings.value.fontSize,
  (fontSize) => {
    document.documentElement.style.setProperty('--fontSize', `${fontSize}px`)
  }
)
watch(
  () => settings.value.fontFamily,
  (fontFamily) => {
    document.documentElement.style.setProperty('--fontFamily', fontFamily)
  }
)
watch(
  () => settings.value.crtEffect,
  (crtEffect) => {
    document.documentElement.setAttribute('data-crt-effect', crtEffect ? 'true' : 'false')
    setTimeout(() => {
      try {
        const glitchElement = document.querySelector('.crt-glitch-overlay') as HTMLElement | null
        if (glitchElement) {
          glitchElement.style.display = 'block'
          glitchElement.style.transform = 'translateX(20px)'
          setTimeout(() => {
            glitchElement.style.transform = 'translateX(0)'
          }, 1000)
        }
      } catch (directError) {
        console.error('APP.VUE - ERROR IN DIRECT GLITCH CREATION:', directError)
      }
    }, 2000)
  },
  { immediate: true }
)
watch(
  () => settings.value.wordWrap,
  (wordWrap) => {
    const appContainer = document.querySelector('.app-container')
    if (!appContainer) return
    if (wordWrap) {
      appContainer.classList.add('word-wrap-enabled')
      appContainer.classList.remove('word-wrap-disabled')
    } else {
      appContainer.classList.add('word-wrap-disabled')
      appContainer.classList.remove('word-wrap-enabled')
    }
  }
)
</script>

<template>
  <div class="app-container">
    <CRTEffect>
      <TitleBar />
      <TopNavBar
        :on-menu-action="handleMenuAction"
        :on-open-settings="() => setShowSettings(true)"
      />
      <TabBar
        :is-home-active="showHomePage"
        :on-show-home="() => setShowHomePage(true)"
        :on-hide-home="() => setShowHomePage(false)"
      />

      <HomePage
        v-if="!activeTabId || showHomePage"
        :on-transformation-opened="() => setShowHomePage(false)"
      />
      <component
        :is="TransformationComponent"
        v-else-if="activeTabId && activeTransformationId && TransformationComponent"
        :key="activeTabId"
        :tab-id="activeTabId"
        :transformation-id="activeTransformationId"
      />

      <StatusBar />

      <Settings v-if="ui.showSettings" :on-close="closeSettings" />
      <About v-if="ui.showAbout" :on-close="closeAbout" />
    </CRTEffect>

    <UpdateNotification
      ref="updateNotificationRef"
      :show="ui.showUpdateNotification"
      :on-close="() => setShowUpdateNotification(false)"
    />
    <Toast />
  </div>
</template>
