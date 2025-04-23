import React, { useState, useEffect, useCallback } from 'react'
import { useTabsStore } from '../stores/tabsStore'

const TitleBarTailwind: React.FC = (): React.ReactElement => {
  const [isMaximized, setIsMaximized] = useState(false)

  // Get state from Zustand stores
  const { activeTabId, tabs, showHomePage } = useTabsStore()

  // Compute the app title based on the active tab
  const appTitle = useCallback((): string => {
    // If the home page is active, show "Home" in the title
    if (showHomePage) {
      return 'Textonom - Home'
    }

    const activeTab = tabs.find((tab) => tab.id === activeTabId)
    if (!activeTab) {
      return 'Textonom'
    }

    // Show the transformation name
    return `Textonom - ${activeTab.title}`
  }, [activeTabId, showHomePage, tabs])

  // Check if window is maximized on mount and when window state changes
  useEffect(() => {
    const checkMaximized = async (): Promise<void> => {
      try {
        const maximized = await window.api.isWindowMaximized()
        setIsMaximized(maximized)
      } catch (error) {
        console.error('Failed to check if window is maximized:', error)
      }
    }

    // Check initially
    checkMaximized()

    // Listen for maximize and unmaximize events
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('window-maximized', () => {
        setIsMaximized(true)
      })

      window.electron.ipcRenderer.on('window-unmaximized', () => {
        setIsMaximized(false)
      })
    }

    // No need to clean up event listeners as the off method is not available
    // in the current implementation
  }, [])

  // Window control handlers
  const minimizeWindow = (): void => {
    window.api.minimizeWindow()
  }

  const toggleMaximize = (): void => {
    // The maximizeWindow function in the main process actually toggles between
    // maximized and unmaximized states, so we can just call it directly
    window.api.maximizeWindow()
  }

  const closeWindow = (): void => {
    window.close()
  }

  return (
    <div className="h-title-bar-height bg-[#0a0a16] flex justify-between items-center [-webkit-app-region:drag] select-none">
      <div className="flex-1 flex items-center pl-2.5">
        <div className="text-xs text-[#00ffff]">{appTitle()}</div>
      </div>
      <div className="flex [-webkit-app-region:no-drag]">
        <button
          className="w-[46px] h-title-bar-height flex justify-center items-center bg-transparent border-none outline-none text-[#00ffff] cursor-pointer hover:bg-[#1a1a2e]"
          onClick={minimizeWindow}
        >
          <svg width="10" height="1" viewBox="0 0 10 1">
            <path d="M0 0h10v1H0z" fill="currentColor" />
          </svg>
        </button>
        <button
          className="w-[46px] h-title-bar-height flex justify-center items-center bg-transparent border-none outline-none text-[#00ffff] cursor-pointer hover:bg-[#1a1a2e]"
          onClick={toggleMaximize}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button
          className="w-[46px] h-title-bar-height flex justify-center items-center bg-transparent border-none outline-none text-[#00ffff] cursor-pointer hover:bg-[#ff0055]"
          onClick={closeWindow}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M6.01 5l3.78 3.78a.71.71 0 1 1-1.01 1.01L5 6.01 1.22 9.79A.71.71 0 1 1 .21 8.78L3.99 5 .21 1.22A.71.71 0 0 1 1.22.21L5 3.99 8.78.21a.71.71 0 0 1 1.01 1.01L6.01 5z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TitleBarTailwind
