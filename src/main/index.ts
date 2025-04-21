import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import path, { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/e55776f0-9aff-49ea-ba3c-7c796e1a98cf.png?asset'
import fs from 'fs'
import { autoUpdater, UpdateCheckResult } from 'electron-updater'
import electronLog from 'electron-log'

// Default directory for file operations
let lastDirectory = app.getPath('home')

// Path for app state file
const appStateFilePath = path.join(app.getPath('userData'), 'app-state.json')

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

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
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

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
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

  // File operations IPC handlers
  ipcMain.handle('open-file', async (_, { lastDirectory: userLastDirectory } = {}) => {
    const dialogDefaultPath = userLastDirectory || lastDirectory

    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['*'] }],
      defaultPath: dialogDefaultPath
    })

    if (!canceled && filePaths.length > 0) {
      const filePath = filePaths[0]
      lastDirectory = path.dirname(filePath)

      try {
        const content = fs.readFileSync(filePath, 'utf8')
        return {
          success: true,
          filePath,
          content,
          lastDirectory
        }
      } catch (error) {
        const err = error as Error
        return {
          success: false,
          error: err.message
        }
      }
    }

    return { success: false, canceled: true }
  })

  ipcMain.handle(
    'save-file',
    async (
      _,
      {
        filePath,
        content,
        lastDirectory: userLastDirectory
      }: {
        filePath?: string
        content: string
        lastDirectory?: string
      }
    ) => {
      let savePath = filePath
      const dialogDefaultPath = userLastDirectory || lastDirectory

      if (!savePath) {
        const { canceled, filePath: selectedPath } = await dialog.showSaveDialog({
          filters: [{ name: 'Text Files', extensions: ['txt'] }],
          defaultPath: path.join(dialogDefaultPath, 'untitled.txt')
        })

        if (canceled || !selectedPath) {
          return { success: false, canceled: true }
        }

        savePath = selectedPath
        lastDirectory = path.dirname(savePath)
      }

      try {
        fs.writeFileSync(savePath, content, 'utf8')
        return {
          success: true,
          filePath: savePath,
          lastDirectory
        }
      } catch (error) {
        const err = error as Error
        return {
          success: false,
          error: err.message
        }
      }
    }
  )

  ipcMain.handle(
    'save-file-as',
    async (
      _,
      {
        content,
        currentPath,
        lastDirectory: userLastDirectory
      }: {
        content: string
        currentPath?: string
        lastDirectory?: string
      }
    ) => {
      const dialogDefaultPath = userLastDirectory || lastDirectory
      const defaultPath = currentPath || path.join(dialogDefaultPath, 'untitled.txt')
      const defaultExtension = path.extname(defaultPath).slice(1) || 'txt'

      const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [
          { name: 'Current Type', extensions: [defaultExtension] },
          { name: 'All Files', extensions: ['*'] }
        ],
        defaultPath
      })

      if (canceled || !filePath) {
        return { success: false, canceled: true }
      }

      lastDirectory = path.dirname(filePath)

      try {
        fs.writeFileSync(filePath, content, 'utf8')
        return {
          success: true,
          filePath,
          lastDirectory
        }
      } catch (error) {
        const err = error as Error
        return {
          success: false,
          error: err.message
        }
      }
    }
  )

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

  // Set the last directory from renderer
  ipcMain.handle('set-last-directory', (_, directory: string) => {
    if (directory && typeof directory === 'string') {
      lastDirectory = directory
      return true
    }
    return false
  })

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
        const state = fs.readFileSync(appStateFilePath, 'utf8')
        return { success: true, state }
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
