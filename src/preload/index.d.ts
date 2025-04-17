import { ElectronAPI } from '@electron-toolkit/preload'

interface FileAPI {
  openFile: () => Promise<{ filePath: string; content: string } | undefined>
  saveFile: (content: string, defaultPath?: string) => Promise<string | undefined>
  saveFileAs: (content: string, defaultPath?: string) => Promise<string | undefined>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      file: FileAPI
    }
  }
}
