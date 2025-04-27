import React, { useEffect, useRef, useCallback } from 'react'
import TitleBar from './components/TitleBar'
import TopNavBar from './components/TopNavBar'
import TabBar from './components/TabBar'
import StatusBar from './components/StatusBar'
import HomePage from './components/HomePage'
import Settings from './components/Settings'
import About from './components/About'
import CRTEffect from './components/CRTEffect'
import UpdateNotification, { UpdateNotificationRef } from './components/UpdateNotification'
import { applyTheme } from './styles/themes'
import { getTransformationPageComponent } from './components/transformations'
import { useSettingsStore } from './stores/settingsStore'
import { useTabsStore } from './stores/tabsStore'
import { useUIStore } from './stores/uiStore'
import { useWindowStore } from './stores/windowStore'
import './styles/global.css'

const App: React.FC = (): React.ReactElement => {
  // Refs
  const updateNotificationRef = useRef<UpdateNotificationRef>(null)

  // Get state from the separate stores
  // Settings store
  const { settings } = useSettingsStore()

  // Tabs store
  const { tabs, activeTabId, showHomePage, setShowHomePage } = useTabsStore()

  // UI store
  const { ui, setShowSettings, setShowAbout, setShowUpdateNotification } = useUIStore()

  // Window store
  const { setWindowState } = useWindowStore()

  // Get the active transformation ID from the active tab
  const activeTransformationId = activeTabId
    ? tabs.find((tab) => tab.id === activeTabId)?.transformationId || null
    : null

  // Handle menu actions
  const handleMenuAction = (action: string): void => {
    switch (action) {
      // File
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

      // Default
      default:
        console.error(`Menu action ${action} not found`)
        break
    }
  }

  // Close modals
  const closeSettings = (): void => {
    setShowSettings(false)
  }

  const closeAbout = (): void => {
    setShowAbout(false)
  }

  // Check for updates
  const checkForUpdates = async (): Promise<void> => {
    try {
      // Make sure the notification is visible
      setShowUpdateNotification(true)

      if (updateNotificationRef.current) {
        updateNotificationRef.current.manualCheckUpdateStarted()
        window.api.checkForUpdates().then((result) => {
          if (!result.updateAvailable && updateNotificationRef.current) {
            updateNotificationRef.current.manualCheckUpdateCompletedUpdateNotAvailable()
          }
        })
      }
    } catch (error) {
      alert(`Error checking for updates: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Save state before window unloads
  const saveStateBeforeUnload = useCallback((): void => {
    try {
      // State is automatically saved by the persist middleware
      // We don't need to do anything special here as:
      // 1. The main process already saves window state on 'before-quit' and 'will-quit' events
      // 2. The Zustand persist middleware automatically saves state when it changes
    } catch (error) {
      console.error('Failed to save state before unload:', error)
    }
  }, [])

  // Get the active transformation component
  const TransformationComponent = activeTransformationId
    ? getTransformationPageComponent(activeTransformationId)
    : null

  // Initialize app on mount
  useEffect(() => {
    // Apply the current theme
    applyTheme(settings.theme)

    // Apply font settings
    document.documentElement.style.setProperty('--fontSize', `${settings.fontSize}px`)
    document.documentElement.style.setProperty('--fontFamily', settings.fontFamily)

    // Apply initial word wrap setting
    const appContainer = document.querySelector('.app-container')
    if (appContainer) {
      if (settings.wordWrap) {
        appContainer.classList.add('word-wrap-enabled')
      } else {
        appContainer.classList.add('word-wrap-disabled')
      }
    }

    // Tabs state is automatically loaded by the persist middleware

    // Check for updates on startup if enabled
    if (settings.autoUpdate && settings.checkForUpdatesOnStartup) {
      // Wait a bit before checking for updates to ensure the app is fully loaded
      setTimeout(() => {
        window.api.checkForUpdates().catch((error) => {
          console.error('Error checking for updates on startup:', error)
        })
      }, 5000)
    }

    // Add event listener for beforeunload to save state
    window.addEventListener('beforeunload', saveStateBeforeUnload)

    // Listen for window state updates from the main process
    const unsubscribe = window.api.onWindowStateUpdated((windowState) => {
      // Update the window store with the new window state
      setWindowState(windowState)

      // No need to save window state here as it's handled by the persist middleware
    })

    // Clean up event listeners
    return (): void => {
      window.removeEventListener('beforeunload', saveStateBeforeUnload)
      unsubscribe()
    }
  }, [
    settings.theme,
    settings.fontSize,
    settings.fontFamily,
    settings.autoUpdate,
    settings.checkForUpdatesOnStartup,
    settings.wordWrap,
    saveStateBeforeUnload,
    setWindowState
  ])

  // No need to watch for active tab changes to save the tabs state
  // The persist middleware automatically saves state when it changes

  // Apply CRT effect and word wrap based on settings
  useEffect(() => {
    // Apply CRT effect
    const crtEffectValue = settings.crtEffect ? 'true' : 'false'
    document.documentElement.setAttribute('data-crt-effect', crtEffectValue)

    // Double-check that it was applied
    setTimeout(() => {
      // Force a direct glitch for testing
      try {
        const glitchElement = document.querySelector('.crt-glitch-overlay') as HTMLElement
        if (glitchElement) {
          glitchElement.style.display = 'block'
          glitchElement.style.transform = 'translateX(20px)'

          // Reset after 1 second
          setTimeout(() => {
            glitchElement.style.transform = 'translateX(0)'
          }, 1000)
        } else {
          console.error('APP.TSX - DIRECT GLITCH CREATION FAILED - ELEMENT NOT FOUND')
        }
      } catch (directError) {
        console.error('APP.TSX - ERROR IN DIRECT GLITCH CREATION:', directError)
      }
    }, 2000)

    // Apply word wrap class to the app container
    const appContainer = document.querySelector('.app-container')
    if (appContainer) {
      if (settings.wordWrap) {
        appContainer.classList.add('word-wrap-enabled')
        appContainer.classList.remove('word-wrap-disabled')
      } else {
        appContainer.classList.add('word-wrap-disabled')
        appContainer.classList.remove('word-wrap-enabled')
      }
    }
  }, [settings.crtEffect, settings.wordWrap])

  return (
    <div className="app-container">
      <CRTEffect>
        <TitleBar />
        <TopNavBar onMenuAction={handleMenuAction} onOpenSettings={() => setShowSettings(true)} />
        <TabBar
          isHomeActive={showHomePage}
          onShowHome={() => setShowHomePage(true)}
          onHideHome={() => setShowHomePage(false)}
        />

        {/* Show HomePage when no tabs are open or when home is requested */}
        {!activeTabId || showHomePage ? (
          <HomePage onTransformationOpened={() => setShowHomePage(false)} />
        ) : (
          /* Show dedicated transformation page for tabs */
          activeTabId &&
          activeTransformationId &&
          TransformationComponent && <TransformationComponent tabId={activeTabId} />
        )}

        <StatusBar />

        {ui.showSettings && <Settings onClose={closeSettings} />}
        {ui.showAbout && <About onClose={closeAbout} />}
      </CRTEffect>

      <UpdateNotification
        ref={updateNotificationRef}
        show={ui.showUpdateNotification}
        onClose={() => setShowUpdateNotification(false)}
      />
    </div>
  )
}

export default App
