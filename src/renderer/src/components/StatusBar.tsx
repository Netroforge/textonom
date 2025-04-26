import React, { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import './StatusBar.css'

const StatusBar: React.FC = () => {
  const [appVersion, setAppVersion] = useState<string>('')

  // Get state from the app store
  const { activeTabId, tabs, showHomePage } = useAppStore()

  // Get app version on mount
  useEffect(() => {
    const getVersion = async (): Promise<void> => {
      try {
        const version = await window.api.getAppVersion()
        setAppVersion(version)
      } catch (error) {
        console.error('Failed to get app version:', error)
        setAppVersion('Unknown')
      }
    }

    getVersion()
  }, [])

  // Get the current tab name or show Home if home page is active
  const getCurrentTabName = useCallback((): string => {
    if (showHomePage) {
      return 'Home'
    }

    const activeTab = tabs.find((tab) => tab.id === activeTabId)
    if (!activeTab) {
      return 'Ready'
    }

    return activeTab.title
  }, [activeTabId, showHomePage, tabs])

  return (
    <div className="status-bar">
      <div className="status-item">{getCurrentTabName()}</div>
      <div className="status-item">v{appVersion}</div>
    </div>
  )
}

export default StatusBar
