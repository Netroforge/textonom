// Event manager to prevent duplicate event listeners
const registeredEvents = {};

export const registerIpcEvent = (ipcRenderer, channel, handler) => {
  // Create a unique key for this channel and handler
  const key = `${channel}-${handler.toString()}`;
  
  // If this event is already registered, remove it first
  if (registeredEvents[key]) {
    ipcRenderer.removeListener(channel, registeredEvents[key]);
  }
  
  // Register the event listener
  ipcRenderer.on(channel, handler);
  
  // Store the handler for future reference
  registeredEvents[key] = handler;
  
  // Return a function to remove the listener
  return () => {
    ipcRenderer.removeListener(channel, handler);
    delete registeredEvents[key];
  };
};

export const registerWindowEvent = (eventName, handler) => {
  // Create a unique key for this event and handler
  const key = `window-${eventName}-${handler.toString()}`;
  
  // If this event is already registered, remove it first
  if (registeredEvents[key]) {
    window.removeEventListener(eventName, registeredEvents[key]);
  }
  
  // Register the event listener
  window.addEventListener(eventName, handler);
  
  // Store the handler for future reference
  registeredEvents[key] = handler;
  
  // Return a function to remove the listener
  return () => {
    window.removeEventListener(eventName, handler);
    delete registeredEvents[key];
  };
};
