import React, { useState, forwardRef, useImperativeHandle } from 'react'
import './UpdateNotification.css'

interface UpdateNotificationProps {
  show: boolean
  onClose: () => void
}

export interface UpdateNotificationRef {
  manualCheckUpdateStarted: () => void
  manualCheckUpdateCompletedUpdateNotAvailable: () => void
}

const UpdateNotification = forwardRef<UpdateNotificationRef, UpdateNotificationProps>(
  ({ show, onClose }, ref) => {
    // State for different notification types
    const [showManualCheckUpdateStartedNotification, setShowManualCheckUpdateStartedNotification] =
      useState(false)
    const [
      showManualCheckUpdateCompletedUpdateNotAvailableNotification,
      setShowManualCheckUpdateCompletedUpdateNotAvailableNotification
    ] = useState(false)
    const [showUpdateAvailableNotification, setShowUpdateAvailableNotification] = useState(false)

    const [updateInfo, setUpdateInfo] = useState<{
      version: string
      releaseNotes?: string
    } | null>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isInstalling, setIsInstalling] = useState(false)
    const [downloadButtonText, setDownloadButtonText] = useState('Download Update')
    const [updateReadyToInstall, setUpdateReadyToInstall] = useState(false)

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      manualCheckUpdateStarted: (): void => {
        setShowManualCheckUpdateStartedNotification(true)
        setShowManualCheckUpdateCompletedUpdateNotAvailableNotification(false)
        setShowUpdateAvailableNotification(false)
        onClose() // Close the main notification if it's open
      },
      manualCheckUpdateCompletedUpdateNotAvailable: (): void => {
        setShowManualCheckUpdateStartedNotification(false)
        setShowManualCheckUpdateCompletedUpdateNotAvailableNotification(true)
        setShowUpdateAvailableNotification(false)
      }
    }))

    // Close all notifications
    const closeNotification = (): void => {
      setShowManualCheckUpdateStartedNotification(false)
      setShowManualCheckUpdateCompletedUpdateNotAvailableNotification(false)
      setShowUpdateAvailableNotification(false)
      onClose()
    }

    // Check for updates
    const checkForUpdates = async (): Promise<void> => {
      try {
        const result = await window.api.checkForUpdates()

        if (result.updateAvailable) {
          setUpdateInfo({
            version: result.version,
            releaseNotes: result.releaseNotes
          })
          setShowManualCheckUpdateStartedNotification(false)
          setShowUpdateAvailableNotification(true)
        } else {
          setUpdateInfo(null)
          setShowManualCheckUpdateStartedNotification(false)
          setShowManualCheckUpdateCompletedUpdateNotAvailableNotification(true)
        }
      } catch (error) {
        console.error('Failed to check for updates:', error)
        setShowManualCheckUpdateStartedNotification(false)
        alert('Failed to check for updates. Please try again later.')
      }
    }

    // Download update
    const downloadUpdate = async (): Promise<void> => {
      try {
        setIsDownloading(true)
        setDownloadButtonText('Downloading (0%)...')
        await window.api.downloadUpdate()
      } catch (error) {
        console.error('Failed to download update:', error)
        setIsDownloading(false)
        setDownloadButtonText('Download Update')
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

    // Set up event listeners for update events
    React.useEffect(() => {
      const handleUpdateAvailable = (
        _: unknown,
        info: { version: string; releaseNotes?: string }
      ): void => {
        setUpdateInfo(info)
        setShowManualCheckUpdateStartedNotification(false)
        setShowUpdateAvailableNotification(true)
      }

      const handleDownloadProgress = (_: unknown, progress: { percent: number }): void => {
        const percentTrunc = Math.trunc(progress.percent)
        setDownloadButtonText(`Downloading (${percentTrunc}%)...`)
      }

      const handleUpdateDownloaded = (
        _: unknown,
        info: { version: string; releaseNotes?: string }
      ): void => {
        setUpdateInfo(info)
        setIsDownloading(false)
        setUpdateReadyToInstall(true)
      }

      const handleUpdateError = (_: unknown, error: string): void => {
        if (isDownloading) {
          alert(`Update error: ${error}`)
          setIsDownloading(false)
          setUpdateReadyToInstall(false)
          setDownloadButtonText('Download Update')
        }
      }

      // Add event listeners
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer.on('update-available', handleUpdateAvailable)
        window.electron.ipcRenderer.on('download-progress', handleDownloadProgress)
        window.electron.ipcRenderer.on('update-downloaded', handleUpdateDownloaded)
        window.electron.ipcRenderer.on('update-error', handleUpdateError)
      }

      // No need to clean up event listeners as the off method is not available
      // in the current implementation
    }, [isDownloading])

    // Render different notification types
    if (showManualCheckUpdateStartedNotification) {
      return (
        <div className="update-notification">
          <div className="update-notification-content">
            <div className="update-notification-header">
              <h3>Checking for updates</h3>
              <button className="close-button" onClick={closeNotification}>
                ✕
              </button>
            </div>
            <div className="update-notification-body">
              <p>In progress...</p>
            </div>
          </div>
        </div>
      )
    }

    if (showManualCheckUpdateCompletedUpdateNotAvailableNotification) {
      return (
        <div className="update-notification">
          <div className="update-notification-content">
            <div className="update-notification-header">
              <h3>Updates check completed</h3>
              <button className="close-button" onClick={closeNotification}>
                ✕
              </button>
            </div>
            <div className="update-notification-body">
              <p>You are using latest version</p>
            </div>
          </div>
        </div>
      )
    }

    if (showUpdateAvailableNotification) {
      return (
        <div className="update-notification">
          <div className="update-notification-content">
            <div className="update-notification-header">
              <h3>Update Available</h3>
              <button className="close-button" onClick={closeNotification}>
                ✕
              </button>
            </div>
            <div className="update-notification-body">
              <p>A new version ({updateInfo?.version}) is available.</p>

              {updateInfo?.releaseNotes && (
                <p
                  className="release-notes"
                  dangerouslySetInnerHTML={{ __html: updateInfo.releaseNotes }}
                />
              )}

              <div className="update-notification-actions">
                {!updateReadyToInstall ? (
                  <button disabled={isDownloading} onClick={downloadUpdate}>
                    {downloadButtonText}
                  </button>
                ) : (
                  <button onClick={installUpdate}>Install</button>
                )}
                <button onClick={closeNotification}>Remind Me Later</button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Main notification when show prop is true
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
)

UpdateNotification.displayName = 'UpdateNotification'

export default UpdateNotification
