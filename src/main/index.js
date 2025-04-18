import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/e55776f0-9aff-49ea-ba3c-7c796e1a98cf.png?asset'
import fs from 'fs'
import path from 'path'
import { autoUpdater } from 'electron-updater'

// Store the last directory used for file operations
let lastDirectory = app.getPath('documents')

// Configure auto updater
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

// Store main window reference
let mainWindow

function createWindow() {
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
    mainWindow.show()
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
  ipcMain.handle('open-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['*'] }],
      defaultPath: lastDirectory
    })

    if (!canceled && filePaths.length > 0) {
      const filePath = filePaths[0]
      lastDirectory = path.dirname(filePath)

      try {
        const content = fs.readFileSync(filePath, 'utf8')
        return {
          success: true,
          filePath,
          content
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    }

    return { success: false, canceled: true }
  })

  ipcMain.handle('save-file', async (_, { filePath, content }) => {
    let savePath = filePath

    if (!savePath) {
      const { canceled, filePath: selectedPath } = await dialog.showSaveDialog({
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
        defaultPath: path.join(lastDirectory, 'untitled.txt')
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
        filePath: savePath
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  })

  ipcMain.handle('save-file-as', async (_, { content, currentPath }) => {
    const defaultPath = currentPath || path.join(lastDirectory, 'untitled.txt')
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
        filePath
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  })

  // Auto-update IPC handlers
  ipcMain.handle('check-for-updates', async () => {
    if (is.dev) {
      return { updateAvailable: false, version: app.getVersion(), isDev: true }
    }

    try {
      const checkResult = await autoUpdater.checkForUpdates()
      const updateAvailable = checkResult && checkResult.updateInfo.version !== app.getVersion()

      return {
        updateAvailable,
        version: updateAvailable ? checkResult.updateInfo.version : app.getVersion(),
        releaseNotes: updateAvailable ? checkResult.updateInfo.releaseNotes : null
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
      return { error: error.message, updateAvailable: false, version: app.getVersion() }
    }
  })

  ipcMain.handle('download-update', async () => {
    if (is.dev) {
      return { success: false, isDev: true }
    }

    try {
      autoUpdater.downloadUpdate()
      return { success: true }
    } catch (error) {
      console.error('Error downloading update:', error)
      return { success: false, error: error.message }
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

  // Set up auto-updater events
  autoUpdater.on('update-available', (info) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-available', info)
    }
  })

  autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded', info)
    }
  })

  autoUpdater.on('error', (err) => {
    console.error('AutoUpdater error:', err)
    if (mainWindow) {
      mainWindow.webContents.send('update-error', err.message)
    }
  })

  // Check for updates on startup (if not in dev mode)
  if (!is.dev) {
    // Wait a bit before checking for updates to ensure the app is fully loaded
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch((err) => {
        console.error('Error checking for updates on startup:', err)
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
