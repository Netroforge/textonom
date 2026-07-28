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
import ShortcutsOverlay from './components/ShortcutsOverlay.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import CRTEffect from './components/CRTEffect.vue'
import UpdateNotification from './components/UpdateNotification.vue'
import Toast from './components/Toast.vue'
import { applyTheme, type ThemeType } from './styles/themes'
import { getTransformationPageComponent } from './components/transformations'
import { useSettingsStore } from './stores/settingsStore'
import { useTabsStore } from './stores/tabsStore'
import { useUIStore } from './stores/uiStore'
import { useWindowStore } from './stores/windowStore'
import { useToast } from './stores/toastStore'
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
const {
  setShowSettings,
  setShowAbout,
  setShowUpdateNotification,
  setShowShortcuts,
  setShowHistory
} = uiStore

const windowStore = useWindowStore()
const { setWindowState } = windowStore

const { showToast } = useToast()

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
    case 'shortcuts':
      setShowShortcuts(true)
      break
    case 'history':
      setShowHistory(true)
      break
    case 'exit':
      void window.api.quitApp()
      break
    default:
      console.error(`Menu action ${action} not found`)
      break
  }
}

const closeSettings = (): void => setShowSettings(false)
const closeAbout = (): void => setShowAbout(false)
const closeShortcuts = (): void => setShowShortcuts(false)
const closeHistory = (): void => setShowHistory(false)

let unsubscribeWindowState: (() => void) | null = null
let unsubscribeShowToast: (() => void) | null = null

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
      window.api.checkForUpdates().catch(() => {
        // Silently ignore — auto-update check failures are non-critical on startup
      })
    }, 5000)
  }

  unsubscribeWindowState = window.api.onWindowStateUpdated((windowState) => {
    setWindowState(windowState)
  })

  // Listen for toast notifications from main process (system tray quick transform)
  unsubscribeShowToast = window.api.onShowToast((message, type) => {
    showToast(message, type as 'success' | 'error')
  })
})

onUnmounted(() => {
  if (unsubscribeWindowState) unsubscribeWindowState()
  if (unsubscribeShowToast) unsubscribeShowToast()
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
    if (!crtEffect) return

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
watch(
  [() => settings.value.showTrayIcon, () => settings.value.minimizeToTray],
  ([showTrayIcon, minimizeToTray]) => {
    void window.api.setTraySettings({ showTrayIcon, minimizeToTray })
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
        :on-open-shortcuts="() => setShowShortcuts(true)"
        :on-open-history="() => setShowHistory(true)"
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
      <ShortcutsOverlay v-if="ui.showShortcuts" :on-close="closeShortcuts" />
      <HistoryPanel v-if="ui.showHistory" :on-close="closeHistory" />
    </CRTEffect>

    <UpdateNotification
      ref="updateNotificationRef"
      :show="ui.showUpdateNotification"
      :on-close="() => setShowUpdateNotification(false)"
    />
    <Toast />
  </div>
</template>
