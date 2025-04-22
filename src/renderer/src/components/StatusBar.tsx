import React, { useState, useEffect } from 'react'
import './StatusBar.css'

const StatusBar: React.FC = () => {
  const [appVersion, setAppVersion] = useState<string>('')

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

  return (
    <div className="status-bar">
      <div className="status-item">Ready</div>
      <div className="status-item version">v{appVersion}</div>
    </div>
  )
}

export default StatusBar
