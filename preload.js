// Preload script
const { contextBridge, ipcRenderer } = require('electron');

// Override console.log to also send logs to the main process
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = (...args) => {
  originalConsoleLog(...args);
  ipcRenderer.send('console-log', ...args);
};

console.error = (...args) => {
  originalConsoleError(...args);
  ipcRenderer.send('console-error', ...args);
};

// Keep track of subscriptions
const subscriptions = new Map();

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, listener) => {
      // Create a unique key for this listener
      const key = `${channel}-${listener.toString()}`;

      // If we already have a subscription for this listener, remove it
      if (subscriptions.has(key)) {
        ipcRenderer.removeListener(channel, subscriptions.get(key));
      }

      // Create a new subscription function
      const subscription = (_event, ...args) => {
        if (channel === 'transform') {
          console.log(`Transform event with type: ${args[0]}`);
        }
        listener(_event, ...args);
      };

      // Store the subscription
      subscriptions.set(key, subscription);

      // Register the listener
      ipcRenderer.on(channel, subscription);

      // Return a function to remove the listener
      return () => {
        ipcRenderer.removeListener(channel, subscription);
        subscriptions.delete(key);
      };
    },
    removeListener: (channel, listener) => {
      // Create a unique key for this listener
      const key = `${channel}-${listener.toString()}`;

      // If we have a subscription for this listener, remove it
      if (subscriptions.has(key)) {
        ipcRenderer.removeListener(channel, subscriptions.get(key));
        subscriptions.delete(key);
      }
    },
    send: (channel, ...args) => ipcRenderer.send(channel, ...args)
  }
});
