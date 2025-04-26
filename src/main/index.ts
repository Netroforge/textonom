import { app, BrowserWindow, ipcMain, shell, Rectangle, screen } from 'electron'
import path, { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/e55776f0-9aff-49ea-ba3c-7c796e1a98cf.png?asset'
import fs from 'fs'
import { autoUpdater, UpdateCheckResult } from 'electron-updater'
import electronLog from 'electron-log'

// Path for app state file
const appStateFilePath = path.join(app.getPath('userData'), 'app-state.json')

// Interface for window state
interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
  isFullScreen: boolean
  displayId?: string // Identifier for the display/monitor
}

// Interface for app state
interface AppState {
  tabs?: Array<{
    id: string
    title: string
    transformationId: string
  }>
  activeTabId?: string | null
  showHomePage?: boolean
  version?: string
  windowState?: WindowState
  [key: string]: unknown
}

// Logger
const log = electronLog
if (is.dev) {
  // Useful for some dev/debugging tasks, but download cannot be validated because the dev app is not signed
  log.transports.file.level = 'debug'
} else {
  log.transports.file.level = 'info'
}

// Configure auto updater
autoUpdater.logger = log
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.forceDevUpdateConfig = is.dev
if (is.dev) {
  // Workaround for dev mode auto updater
  // Inspired by https://github.com/electron-userland/electron-builder/issues/3167#issuecomment-627696277
  process.env.APPIMAGE = path.join(__dirname, 'dist', `textonom-${app.getVersion()}.AppImage`)
}

// Store main window reference
let mainWindow: BrowserWindow | null = null

// Default window state
const defaultWindowState: WindowState = {
  width: 1200,
  height: 800,
  isMaximized: false,
  isFullScreen: false
}

// Check if the window is on a visible display
function isVisibleOnAnyDisplay(x: number, y: number, width: number, height: number): boolean {
  const displays = screen.getAllDisplays()

  // Check if the window rectangle intersects with any display
  return displays.some((display) => {
    return isVisibleOnDisplay(x, y, width, height, display)
  })
}

// Check if the window is visible on a specific display
function isVisibleOnDisplay(
  x: number,
  y: number,
  width: number,
  height: number,
  display: Electron.Display
): boolean {
  const windowRect = { x, y, width, height }
  const displayBounds = display.bounds

  // Check for intersection between window and display
  return !(
    windowRect.x > displayBounds.x + displayBounds.width ||
    windowRect.x + windowRect.width < displayBounds.x ||
    windowRect.y > displayBounds.y + displayBounds.height ||
    windowRect.y + windowRect.height < displayBounds.y
  )
}

// Get saved window state from the app state file
// Note: We read directly from the file instead of using the app store because:
// 1. The main process needs the window state at startup before the renderer process is loaded
// 2. The app store is defined in the renderer process and isn't directly accessible from the main process
// 3. This maintains a clean separation of concerns between the main and renderer processes
function getSavedWindowState(): WindowState {
  try {
    if (fs.existsSync(appStateFilePath)) {
      const data = fs.readFileSync(appStateFilePath, 'utf8')

      // Check if the file has content
      if (data && data.trim()) {
        try {
          const state = JSON.parse(data) as AppState

          // If window state exists in the saved state, return it
          if (state.windowState) {
            const windowState = state.windowState

            // Check if the window position is on a visible display
            if (
              windowState.x !== undefined &&
              windowState.y !== undefined &&
              !isVisibleOnAnyDisplay(
                windowState.x,
                windowState.y,
                windowState.width,
                windowState.height
              )
            ) {
              // If not visible, remove position information to use default positioning
              delete windowState.x
              delete windowState.y
            }

            log.info('Loaded window state:', windowState)
            return windowState
          }
        } catch (parseError) {
          log.error('Failed to parse app state file:', parseError)
        }
      }
    }
  } catch (error) {
    log.error('Failed to get saved window state:', error)
  }

  // Return default window state if no saved state exists
  log.info('Using default window state')
  return defaultWindowState
}

// Update window state and notify renderer
function updateWindowState(): void {
  // Check if mainWindow exists and is not destroyed
  if (!mainWindow || mainWindow.isDestroyed()) return

  try {
    // Get current window state
    const isMaximized = mainWindow.isMaximized()
    const isFullScreen = mainWindow.isFullScreen()

    // Only get bounds if not maximized or fullscreen
    let bounds: Rectangle | undefined
    if (!isMaximized && !isFullScreen) {
      bounds = mainWindow.getBounds()
    }

    // Get the display where the window is currently located
    let displayId: string | undefined
    try {
      const windowBounds = mainWindow.getBounds()
      const display = screen.getDisplayNearestPoint({
        x: windowBounds.x + windowBounds.width / 2,
        y: windowBounds.y + windowBounds.height / 2
      })

      // Use a unique identifier for the display
      // We use a combination of the display's bounds and id to create a unique identifier
      // This ensures that even if the display id changes between sessions, we can still identify the same physical display
      displayId = `${display.id}-${display.bounds.x}-${display.bounds.y}-${display.bounds.width}-${display.bounds.height}`
      log.info('Window is on display:', displayId)
    } catch (displayError) {
      log.error('Failed to get display information:', displayError)
    }

    // Create a window state object
    const windowState: WindowState = {
      ...(bounds ? { x: bounds.x, y: bounds.y } : {}),
      width: bounds ? bounds.width : defaultWindowState.width,
      height: bounds ? bounds.height : defaultWindowState.height,
      isMaximized,
      isFullScreen,
      displayId
    }

    // Send window state to renderer process
    // The renderer will handle saving it to the app state
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-state-updated', windowState)
      log.info('Window state updated and sent to renderer')
    }
  } catch (error) {
    log.error('Failed to update window state:', error)
  }
}

function createWindow(): void {
  // Get saved window state
  const windowState = getSavedWindowState()

  // Find the correct display if we have a displayId
  let targetDisplay = screen.getPrimaryDisplay()
  if (windowState.displayId) {
    try {
      // Try to find the display that matches our saved displayId
      const allDisplays = screen.getAllDisplays()
      const matchingDisplay = allDisplays.find((display) => {
        const currentDisplayId = `${display.id}-${display.bounds.x}-${display.bounds.y}-${display.bounds.width}-${display.bounds.height}`
        return currentDisplayId === windowState.displayId
      })

      if (matchingDisplay) {
        log.info('Found matching display:', windowState.displayId)
        targetDisplay = matchingDisplay
      } else {
        log.info('No matching display found for:', windowState.displayId)
      }
    } catch (displayError) {
      log.error('Error finding display:', displayError)
    }
  }

  // Adjust window position to be on the target display if needed
  let adjustedX = windowState.x
  let adjustedY = windowState.y

  // If we have a target display and position coordinates, ensure the window is on that display
  if (windowState.x !== undefined && windowState.y !== undefined) {
    // Check if the window would be visible on the target display
    const isVisible = isVisibleOnDisplay(
      windowState.x,
      windowState.y,
      windowState.width,
      windowState.height,
      targetDisplay
    )

    // If not visible on the target display, center the window on that display
    if (!isVisible) {
      adjustedX = targetDisplay.bounds.x + (targetDisplay.bounds.width - windowState.width) / 2
      adjustedY = targetDisplay.bounds.y + (targetDisplay.bounds.height - windowState.height) / 2
      log.info('Adjusted window position to be on target display:', { adjustedX, adjustedY })
    }
  } else {
    // If no position is saved, center on the target display
    adjustedX = targetDisplay.bounds.x + (targetDisplay.bounds.width - windowState.width) / 2
    adjustedY = targetDisplay.bounds.y + (targetDisplay.bounds.height - windowState.height) / 2
    log.info('Centered window on target display:', { adjustedX, adjustedY })
  }

  // Create the browser window with saved dimensions
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    ...(adjustedX !== undefined && adjustedY !== undefined ? { x: adjustedX, y: adjustedY } : {}),
    show: false,
    autoHideMenuBar: false,
    frame: false, // Remove default frame for custom title bar
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Restore maximized or fullscreen state
  if (windowState.isFullScreen) {
    mainWindow.setFullScreen(true)
  } else if (windowState.isMaximized) {
    mainWindow.maximize()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // Save window state when a window is moved or resized
  mainWindow.on('moved', updateWindowState)
  mainWindow.on('resized', updateWindowState)
  mainWindow.on('maximize', updateWindowState)
  mainWindow.on('unmaximize', updateWindowState)
  mainWindow.on('enter-full-screen', updateWindowState)
  mainWindow.on('leave-full-screen', updateWindowState)

  // Save window state before the window is closed
  mainWindow.on('close', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      updateWindowState()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Only open DevTools in development mode
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Window control IPC handlers
  ipcMain.handle('window-minimize', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) window.minimize()
    return true
  })

  ipcMain.handle('window-maximize', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
        return false
      } else {
        window.maximize()
        return true
      }
    }
    return false
  })

  ipcMain.handle('window-close', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) window.close()
    return true
  })

  ipcMain.handle('window-is-maximized', () => {
    const window = BrowserWindow.getFocusedWindow()
    return window ? window.isMaximized() : false
  })

  // File operations IPC handlers have been removed

  // Auto-update IPC handlers
  ipcMain.handle('check-for-updates', async () => {
    try {
      const checkResult = (await autoUpdater.checkForUpdates()) as UpdateCheckResult
      const updateAvailable = checkResult && checkResult.updateInfo.version !== app.getVersion()
      return {
        updateAvailable,
        version: updateAvailable ? checkResult.updateInfo.version : app.getVersion(),
        releaseNotes: updateAvailable ? checkResult.updateInfo.releaseNotes : null
      }
    } catch (error) {
      const err = error as Error
      log.error('Error checking for updates:', error)
      return { error: err.message, updateAvailable: false, version: app.getVersion() }
    }
  })

  ipcMain.handle('download-update', async () => {
    try {
      await autoUpdater.downloadUpdate()
    } catch (error) {
      log.error('Error downloading update:', error)
    }
  })

  ipcMain.handle('install-update', () => {
    if (is.dev) {
      return { success: false, isDev: true }
    }

    autoUpdater.quitAndInstall()
    return { success: true }
  })

  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  // Last directory handler has been removed

  // Set the window title
  ipcMain.handle('set-window-title', (_, title: string) => {
    if (mainWindow) {
      mainWindow.setTitle(title)
      return true
    }
    return false
  })

  // App state persistence handlers
  ipcMain.handle('save-app-state', (_, { state }: { state: string }) => {
    try {
      // Validate that the state is valid JSON and conforms to our AppState interface
      try {
        log.info('Saving app state')
        JSON.parse(state) as AppState
      } catch (parseError) {
        log.error('Invalid app state JSON:', parseError)
        return { success: false, error: 'Invalid app state format' }
      }

      fs.writeFileSync(appStateFilePath, state, 'utf8')
      return { success: true }
    } catch (error) {
      const err = error as Error
      log.error('Error saving app state:', error)
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('load-app-state', () => {
    try {
      if (fs.existsSync(appStateFilePath)) {
        const stateData = fs.readFileSync(appStateFilePath, 'utf8')
        // Validate that the state is valid JSON
        try {
          log.info('Loading app state')
          JSON.parse(stateData) as AppState
        } catch (parseError) {
          log.error('Invalid app state JSON:', parseError)
          return { success: false, error: 'Invalid app state format' }
        }
        return { success: true, state: stateData }
      }
      return { success: false, error: 'App state file does not exist' }
    } catch (error) {
      const err = error as Error
      log.error('Error loading app state:', error)
      return { success: false, error: err.message }
    }
  })

  // Set up auto-updater events
  autoUpdater.on('update-available', (info) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-available', info)
    }
  })

  autoUpdater.on('download-progress', (progress) => {
    if (mainWindow) {
      mainWindow.webContents.send('download-progress', progress)
    }
  })

  autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded', info)
    }
  })

  autoUpdater.on('error', (err) => {
    log.error('AutoUpdater error:', err)
    if (mainWindow) {
      mainWindow.webContents.send('update-error', err.message)
    }
  })

  // Check for updates on startup (if not in dev mode)
  if (!is.dev) {
    // Wait a bit before checking for updates to ensure the app is fully loaded
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch((err) => {
        log.error('Error checking for updates on startup:', err)
      })
    }, 3000)
  }

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Save window state before quitting
app.on('before-quit', () => {
  // Only save window state if mainWindow exists and is not destroyed
  if (mainWindow && !mainWindow.isDestroyed()) {
    updateWindowState()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
