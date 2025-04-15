const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Store settings in user's home directory
const userDataPath = path.join(os.homedir(), '.textonom');
const settingsPath = path.join(userDataPath, 'settings.json');

// Ensure the directory exists
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

// Default settings
const defaultSettings = {
  theme: 'light',
  font: {
    family: 'Consolas, monospace',
    size: 14
  },
  tabSize: 2,
  useTabs: false,
  showLineNumbers: true,
  wordWrap: true,
  wrapColumn: 80,
  autoSave: false,
  autoSaveInterval: 60000 // 1 minute
};

// Load settings or create default ones
let settings;
try {
  if (fs.existsSync(settingsPath)) {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } else {
    settings = defaultSettings;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  }
} catch (error) {
  console.error('Error loading settings:', error);
  settings = defaultSettings;
}

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'Textonom',
    icon: path.join(__dirname, 'public/textonom-icon.png')
  });

  // Load the app
  if (app.isPackaged) {
    // Production mode - load from built files
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    // Development mode - load from built files
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    // Open DevTools
    mainWindow.webContents.openDevTools();
  }

  // Create application menu
  createMenu();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create the application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu-new-tab')
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFile()
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu-save')
        },
        {
          label: 'Save As',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('menu-save-as')
        },
        { type: 'separator' },
        {
          label: 'Settings',
          click: () => mainWindow.webContents.send('menu-settings')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'Transformations',
      submenu: [
        {
          label: 'Base64',
          submenu: [
            {
              label: 'Encode',
              click: () => {
                console.log('Sending transform event: base64-encode');
                mainWindow.webContents.send('transform', 'base64-encode');
              }
            },
            {
              label: 'Decode',
              click: () => mainWindow.webContents.send('transform', 'base64-decode')
            }
          ]
        },
        {
          label: 'JSON',
          submenu: [
            {
              label: 'Prettify',
              click: () => mainWindow.webContents.send('transform', 'json-prettify')
            },
            {
              label: 'Compact',
              click: () => mainWindow.webContents.send('transform', 'json-compact')
            }
          ]
        },
        {
          label: 'URL',
          submenu: [
            {
              label: 'Encode',
              click: () => mainWindow.webContents.send('transform', 'url-encode')
            },
            {
              label: 'Decode',
              click: () => mainWindow.webContents.send('transform', 'url-decode')
            }
          ]
        },
        {
          label: 'Case',
          submenu: [
            {
              label: 'UPPERCASE',
              click: () => {
                console.log('Sending transform event: case-upper');
                mainWindow.webContents.send('transform', 'case-upper');
              }
            },
            {
              label: 'lowercase',
              click: () => mainWindow.webContents.send('transform', 'case-lower')
            },
            {
              label: 'Title Case',
              click: () => mainWindow.webContents.send('transform', 'case-title')
            }
          ]
        },
        {
          label: 'XML',
          submenu: [
            {
              label: 'Prettify',
              click: () => mainWindow.webContents.send('transform', 'xml-prettify')
            },
            {
              label: 'Compact',
              click: () => mainWindow.webContents.send('transform', 'xml-compact')
            }
          ]
        },
        {
          label: 'Lines',
          submenu: [
            {
              label: 'Sort',
              click: () => mainWindow.webContents.send('transform', 'lines-sort')
            },
            {
              label: 'Remove Duplicates',
              click: () => mainWindow.webContents.send('transform', 'lines-deduplicate')
            },
            {
              label: 'Reverse',
              click: () => mainWindow.webContents.send('transform', 'lines-reverse')
            }
          ]
        },
        {
          label: 'HTML',
          submenu: [
            {
              label: 'Encode',
              click: () => mainWindow.webContents.send('transform', 'html-encode')
            },
            {
              label: 'Decode',
              click: () => mainWindow.webContents.send('transform', 'html-decode')
            }
          ]
        },
        {
          label: 'Hash',
          submenu: [
            {
              label: 'MD5',
              click: () => mainWindow.webContents.send('transform', 'hash-md5')
            },
            {
              label: 'SHA-1',
              click: () => mainWindow.webContents.send('transform', 'hash-sha1')
            },
            {
              label: 'SHA-256',
              click: () => mainWindow.webContents.send('transform', 'hash-sha256')
            }
          ]
        },
        {
          label: 'Unicode',
          submenu: [
            {
              label: 'Escape',
              click: () => mainWindow.webContents.send('transform', 'unicode-escape')
            },
            {
              label: 'Unescape',
              click: () => mainWindow.webContents.send('transform', 'unicode-unescape')
            }
          ]
        },
        {
          label: 'Format Conversion',
          submenu: [
            {
              label: 'JSON to YAML',
              click: () => mainWindow.webContents.send('transform', 'json-to-yaml')
            },
            {
              label: 'YAML to JSON',
              click: () => mainWindow.webContents.send('transform', 'yaml-to-json')
            }
          ]
        },
        {
          label: 'Spring Boot',
          submenu: [
            {
              label: 'Properties to YAML',
              click: () => mainWindow.webContents.send('transform', 'properties-to-yaml')
            },
            {
              label: 'YAML to Properties',
              click: () => mainWindow.webContents.send('transform', 'yaml-to-properties')
            }
          ]
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              title: 'About Textonom',
              message: 'Textonom',
              detail: 'Version 1.0.0\nA text editor that performs popular routine transformations of text on your local machine.\n\nDeveloped by Netroforge',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Open file dialog
async function openFile() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ],
    defaultPath: app.getPath('documents')
  });

  if (!canceled && filePaths.length > 0) {
    const filePath = filePaths[0];
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      mainWindow.webContents.send('file-opened', { filePath, content });
    } catch (error) {
      dialog.showErrorBox('Error', `Failed to open file: ${error.message}`);
    }
  }
}

// Save file dialog
async function saveFileAs(content, suggestedFilePath = null) {
  // Determine default extension based on the file that was opened
  let defaultExtension = 'txt';
  let defaultPath = app.getPath('documents');

  if (suggestedFilePath) {
    defaultPath = suggestedFilePath;
    const ext = path.extname(suggestedFilePath).slice(1);
    if (ext) {
      defaultExtension = ext;
    }
  }

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Text Files', extensions: ['txt'] }
    ],
    defaultPath: defaultPath
  });

  if (!canceled && filePath) {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      return filePath;
    } catch (error) {
      dialog.showErrorBox('Error', `Failed to save file: ${error.message}`);
      return null;
    }
  }
  return null;
}

// Save file with known path
function saveFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    dialog.showErrorBox('Error', `Failed to save file: ${error.message}`);
    return false;
  }
}

// IPC handlers
ipcMain.handle('open-file-dialog', openFile);

ipcMain.handle('save-file-as', (event, { content, filePath }) => {
  return saveFileAs(content, filePath);
});

ipcMain.handle('save-file', (event, { filePath, content }) => {
  return saveFile(filePath, content);
});

ipcMain.handle('get-settings', () => {
  return settings;
});

ipcMain.handle('save-settings', (event, newSettings) => {
  settings = { ...settings, ...newSettings };
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
});

ipcMain.handle('show-error', (event, { title, message }) => {
  console.error(`Error: ${title} - ${message}`);
  dialog.showErrorBox(title, message);
  return true;
});



// Listen for console logs from the renderer process
ipcMain.on('console-log', (event, ...args) => {
  console.log('Renderer log:', ...args);
});

ipcMain.on('console-error', (event, ...args) => {
  console.error('Renderer error:', ...args);
});

// App lifecycle events
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});
