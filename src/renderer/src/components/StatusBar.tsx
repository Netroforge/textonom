import React, { useState, useEffect, useCallback } from 'react'
import { useTabsStore } from '../stores/tabsStore'

const StatusBarTailwind: React.FC = () => {
  const [appVersion, setAppVersion] = useState<string>('')

  // Get state from Zustand stores
  const { activeTabId, tabs, showHomePage } = useTabsStore()

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
    <div className="flex justify-between items-center h-6 py-1 bg-[#1a1a2e] border-t border-[#ff00ff] px-2 text-xs text-[#00ffff]">
      <div className="px-2 truncate">{getCurrentTabName()}</div>
      <div className="px-2 flex-shrink-0">v{appVersion}</div>
    </div>
  )
}

export default StatusBarTailwind
