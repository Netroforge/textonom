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
import { useAppStore } from './stores/appStore'
import './styles/global.css'

const App: React.FC = (): React.ReactElement => {
  // Refs
  const updateNotificationRef = useRef<UpdateNotificationRef>(null)

  // Get state from the consolidated app store
  const {
    // Settings
    settings,

    // Tabs
    tabs,
    activeTabId,
    showHomePage,
    setShowHomePage,

    // UI state
    ui,
    setShowSettings,
    setShowAbout,
    setShowUpdateNotification,

    // Persistence methods
    saveAppStateToDisk,
    initializeFromDisk
  } = useAppStore()

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
      // Save app state to disk
      saveAppStateToDisk()
    } catch (error) {
      console.error('Failed to save app state before unload:', error)
    }
  }, [saveAppStateToDisk])

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

    // Initialize app state from disk
    initializeFromDisk().catch((error) => {
      console.error('Error initializing app state from disk:', error)
    })

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
      // Update the app store with the new window state
      useAppStore.setState({ windowState })

      // Save the app state to disk when window state changes
      console.log('Window state updated, saving app state to disk:', windowState)
      saveAppStateToDisk().catch((error) => {
        console.error('Failed to save app state after window state changed:', error)
      })
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
    initializeFromDisk,
    saveStateBeforeUnload,
    saveAppStateToDisk
  ])

  // Watch for active tab changes to save the app state
  useEffect(() => {
    // Ensure app state is saved to disk when active tab changes
    saveAppStateToDisk().catch((error) => {
      console.error('Failed to save app state after active tab changed:', error)
    })
  }, [activeTabId, saveAppStateToDisk])

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
