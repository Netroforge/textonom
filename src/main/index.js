import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'

// Store the last directory used for file operations
let lastDirectory = app.getPath('documents')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: false,
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
