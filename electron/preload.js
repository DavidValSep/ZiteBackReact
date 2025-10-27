const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  downloadSite: (url, flags) => ipcRenderer.invoke('download-site', { url, flags }),
  cleanupTemp: () => ipcRenderer.invoke('cleanup-temp'),
  onLogMessage: (callback) => ipcRenderer.on('log-message', (event, log) => callback(log)),
  removeLogListener: () => ipcRenderer.removeAllListeners('log-message')
});
