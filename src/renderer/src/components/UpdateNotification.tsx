import React, { useState } from 'react'
import './UpdateNotification.css'

interface UpdateNotificationProps {
  show: boolean
  onClose: () => void
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ show, onClose }) => {
  const [updateInfo, setUpdateInfo] = useState<{
    version: string
    releaseNotes?: string
  } | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  // Check for updates
  const checkForUpdates = async (): Promise<void> => {
    try {
      const result = await window.api.checkForUpdates()

      if (result.updateAvailable) {
        setUpdateInfo({
          version: result.version,
          releaseNotes: result.releaseNotes
        })
      } else {
        setUpdateInfo(null)
        alert('No updates available. You are using the latest version.')
      }
    } catch (error) {
      console.error('Failed to check for updates:', error)
      alert('Failed to check for updates. Please try again later.')
    }
  }

  // Download update
  const downloadUpdate = async (): Promise<void> => {
    try {
      setIsDownloading(true)
      await window.api.downloadUpdate()
      setIsDownloading(false)
    } catch (error) {
      console.error('Failed to download update:', error)
      setIsDownloading(false)
      alert('Failed to download update. Please try again later.')
    }
  }

  // Install update
  const installUpdate = async (): Promise<void> => {
    try {
      setIsInstalling(true)
      const result = await window.api.installUpdate()

      if (result.success) {
        // The app will restart automatically
      } else if (result.isDev) {
        alert('Update installation skipped in development mode.')
        setIsInstalling(false)
      } else {
        alert('Failed to install update. Please try again later.')
        setIsInstalling(false)
      }
    } catch (error) {
      console.error('Failed to install update:', error)
      setIsInstalling(false)
      alert('Failed to install update. Please try again later.')
    }
  }

  if (!show) return null

  return (
    <div className="update-notification">
      <div className="update-notification-content">
        <div className="update-notification-header">
          <h2>Software Update</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="update-notification-body">
          {updateInfo ? (
            <>
              <p>A new version is available: v{updateInfo.version}</p>

              {updateInfo.releaseNotes && (
                <div className="release-notes">
                  <h3>Release Notes:</h3>
                  <div dangerouslySetInnerHTML={{ __html: updateInfo.releaseNotes }}></div>
                </div>
              )}

              <div className="update-actions">
                <button
                  className="action-button"
                  onClick={downloadUpdate}
                  disabled={isDownloading || isInstalling}
                >
                  {isDownloading ? 'Downloading...' : 'Download Update'}
                </button>

                <button
                  className="action-button install-button"
                  onClick={installUpdate}
                  disabled={isDownloading || isInstalling}
                >
                  {isInstalling ? 'Installing...' : 'Install Update'}
                </button>
              </div>
            </>
          ) : (
            <div className="check-update">
              <p>Check for available updates</p>
              <button className="action-button" onClick={checkForUpdates}>
                Check for Updates
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpdateNotification
