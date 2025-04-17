interface TauriAPI {
  invoke: (command: string, args?: any) => Promise<any>;
}

declare interface Window {
  Tauri?: TauriAPI;
}
