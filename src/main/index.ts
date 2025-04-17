import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    autoHideMenuBar: false,
    title: 'Textonom',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
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

  // IPC handlers for file operations
  ipcMain.handle('file:open', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['*'] }],
      defaultPath: app.getPath('documents')
    })

    if (canceled || filePaths.length === 0) {
      return undefined
    }

    const filePath = filePaths[0]
    const content = fs.readFileSync(filePath, 'utf8')

    return { filePath, content }
  })

  ipcMain.handle('file:save', async (_, { content, defaultPath }) => {
    if (!defaultPath) {
      return ipcMain.emit('file:saveAs', _, { content })
    }

    fs.writeFileSync(defaultPath, content, 'utf8')
    return defaultPath
  })

  ipcMain.handle('file:saveAs', async (_, { content, defaultPath }) => {
    // Determine default extension
    let defaultExtension = 'txt'
    let defaultName = 'untitled'

    if (defaultPath) {
      const pathParts = defaultPath.split('/')
      const fileName = pathParts[pathParts.length - 1]
      if (fileName.includes('.')) {
        const parts = fileName.split('.')
        defaultExtension = parts[parts.length - 1]
        defaultName = parts.slice(0, -1).join('.')
      } else {
        defaultName = fileName
      }
    }

    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: defaultPath || `${app.getPath('documents')}/${defaultName}.${defaultExtension}`,
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'JavaScript', extensions: ['js'] },
        { name: 'TypeScript', extensions: ['ts'] },
        { name: 'JSON', extensions: ['json'] },
        { name: 'XML', extensions: ['xml'] },
        { name: 'HTML', extensions: ['html', 'htm'] },
        { name: 'CSS', extensions: ['css'] },
        { name: 'YAML', extensions: ['yaml', 'yml'] },
        { name: 'Properties', extensions: ['properties'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (canceled || !filePath) {
      return undefined
    }

    fs.writeFileSync(filePath, content, 'utf8')
    return filePath
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

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
