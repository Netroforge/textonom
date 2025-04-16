// Type definitions for Electron IPC in the renderer process
interface ElectronAPI {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    on: (channel: string, listener: (...args: any[]) => void) => (() => void);
    removeListener: (channel: string, listener: (...args: any[]) => void) => void;
    send: (channel: string, ...args: any[]) => void;
  };
}

// Extend the Window interface
interface Window {
  electron: ElectronAPI;
  monaco: any;
  applyEditorTransformation: (newContent: string) => boolean;
}
