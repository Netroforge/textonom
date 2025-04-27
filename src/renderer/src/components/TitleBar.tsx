import React, { useState, useEffect, useCallback } from 'react'
import { useTabsStore } from '../stores/tabsStore'
import './TitleBar.css'

const TitleBar: React.FC = (): React.ReactElement => {
  const [isMaximized, setIsMaximized] = useState(false)

  // Get state from the tabs store
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

  // Check if window is maximized on mount and when it changes
  useEffect(() => {
    const checkMaximizedState = async (): Promise<void> => {
      try {
        const maximized = await window.api.isWindowMaximized()
        setIsMaximized(maximized)
      } catch (error) {
        console.error('Failed to check if window is maximized:', error)
      }
    }

    // Check initially
    checkMaximizedState()

    // Listen for window resize to update the maximized state
    window.addEventListener('resize', checkMaximizedState)

    // Set the initial window title
    window.api.setWindowTitle(appTitle())

    return (): void => {
      window.removeEventListener('resize', checkMaximizedState)
    }
  }, [appTitle])

  // Update window title when active tab changes
  useEffect(() => {
    window.api.setWindowTitle(appTitle())
  }, [activeTabId, showHomePage, appTitle])

  // Window control functions
  const minimizeWindow = (): void => {
    window.api.minimizeWindow()
  }

  const toggleMaximize = async (): Promise<void> => {
    const maximized = await window.api.maximizeWindow()
    setIsMaximized(maximized)
  }

  const closeWindow = (): void => {
    window.api.closeWindow()
  }

  return (
    <div className="title-bar">
      <div className="title-bar-drag-area">
        <div className="app-title">{appTitle()}</div>
      </div>
      <div className="window-controls">
        <button className="window-control minimize" onClick={minimizeWindow}>
          <svg width="10" height="1" viewBox="0 0 10 1">
            <path d="M0 0h10v1H0z" fill="currentColor" />
          </svg>
        </button>
        <button className="window-control maximize" onClick={toggleMaximize}>
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
        <button className="window-control close" onClick={closeWindow}>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TitleBar
