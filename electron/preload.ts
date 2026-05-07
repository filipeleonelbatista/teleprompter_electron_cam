import { contextBridge, ipcRenderer } from 'electron'

console.log('[Preload] Loading electronAPI...')

// Expose protected methods for renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls with logging
  minimize: () => {
    console.log('[Preload] calling window:minimize')
    return ipcRenderer.invoke('window:minimize')
  },
  maximize: () => {
    console.log('[Preload] calling window:maximize')
    return ipcRenderer.invoke('window:maximize')
  },
  close: () => {
    console.log('[Preload] calling window:close')
    return ipcRenderer.invoke('window:close')
  },
  setAlwaysOnTop: (flag: boolean) => {
    console.log('[Preload] calling window:setAlwaysOnTop', flag)
    return ipcRenderer.invoke('window:setAlwaysOnTop', flag)
  },
  setOpacity: (opacity: number) => {
    console.log('[Preload] calling window:setOpacity', opacity)
    return ipcRenderer.invoke('window:setOpacity', opacity)
  }
})

console.log('[Preload] electronAPI loaded successfully')