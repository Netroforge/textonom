import React, { useState, useEffect, useRef, useCallback } from 'react'
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

const App: React.FC = (): React.ReactElement => {
  // State
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)
  // TailwindDemo state removed

  // Refs
  const updateNotificationRef = useRef<UpdateNotificationRef>(null)

  // Get state from Zustand stores
  const { settings } = useSettingsStore()
  const { tabs, activeTabId, showHomePage, setShowHomePage, saveTabsToDisk, initializeFromDisk } =
    useTabsStore()

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

  // TailwindDemo toggle function removed

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
      // Save tabs state to disk
      saveTabsToDisk()
    } catch (error) {
      console.error('Failed to save tabs before unload:', error)
    }
  }, [saveTabsToDisk])

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

    // Initialize tabs from disk
    initializeFromDisk().catch((error) => {
      console.error('Error initializing tabs from disk:', error)
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

    // Clean up event listeners
    return (): void => {
      window.removeEventListener('beforeunload', saveStateBeforeUnload)
    }
  }, [
    settings.theme,
    settings.fontSize,
    settings.fontFamily,
    settings.autoUpdate,
    settings.checkForUpdatesOnStartup,
    settings.wordWrap,
    initializeFromDisk,
    saveStateBeforeUnload
  ])

  // Watch for active tab changes to save the tab state
  useEffect(() => {
    // Ensure tab state is saved to disk when active tab changes
    saveTabsToDisk().catch((error) => {
      console.error('Failed to save tabs after active tab changed:', error)
    })
  }, [activeTabId, saveTabsToDisk])

  // Apply CRT effect and word wrap based on settings
  useEffect(() => {
    // Apply CRT effect
    document.documentElement.setAttribute('data-crt-effect', settings.crtEffect ? 'true' : 'false')

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
    <div className="app-container flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a16]">
      <CRTEffect>
        <div className="flex flex-col h-full w-full">
          <TitleBar />
          <TopNavBar onMenuAction={handleMenuAction} onOpenSettings={() => setShowSettings(true)} />
          <TabBar
            isHomeActive={showHomePage}
            onShowHome={() => setShowHomePage(true)}
            onHideHome={() => setShowHomePage(false)}
          />

          <div className="flex-1 overflow-hidden relative">
            {/* Show HomePage when no tabs are open or when home is requested */}
            {!activeTabId || showHomePage ? (
              <HomePage onTransformationOpened={() => setShowHomePage(false)} />
            ) : (
              /* Show dedicated transformation page for tabs */
              activeTabId &&
              activeTransformationId &&
              TransformationComponent && <TransformationComponent tabId={activeTabId} />
            )}
          </div>

          <StatusBar />
        </div>

        {showSettings && <Settings onClose={closeSettings} />}
        {showAbout && <About onClose={closeAbout} />}
      </CRTEffect>

      <UpdateNotification
        ref={updateNotificationRef}
        show={showUpdateNotification}
        onClose={() => setShowUpdateNotification(false)}
      />
    </div>
  )
}

export default App
