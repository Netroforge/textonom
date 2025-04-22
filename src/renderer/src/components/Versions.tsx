import React, { useState, useEffect } from 'react'
import './Versions.css'

const Versions: React.FC = () => {
  const [versions, setVersions] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get versions from electron
    const getVersions = async (): Promise<void> => {
      try {
        const appVersion = await window.api.getAppVersion()
        setVersions({
          app: appVersion,
          electron: process.versions.electron || '',
          chrome: process.versions.chrome || '',
          node: process.versions.node || ''
        })
      } catch (error) {
        console.error('Failed to get versions:', error)
      }
    }

    getVersions()
  }, [])

  return (
    <div className="versions">
      <div className="version-item">
        <span className="version-label">App:</span>
        <span className="version-value">{versions.app}</span>
      </div>
      <div className="version-item">
        <span className="version-label">Electron:</span>
        <span className="version-value">{versions.electron}</span>
      </div>
      <div className="version-item">
        <span className="version-label">Chrome:</span>
        <span className="version-value">{versions.chrome}</span>
      </div>
      <div className="version-item">
        <span className="version-label">Node:</span>
        <span className="version-value">{versions.node}</span>
      </div>
    </div>
  )
}

export default Versions
