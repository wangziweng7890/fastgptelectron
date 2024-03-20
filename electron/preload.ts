import os from 'os'
import { contextBridge, ipcRenderer } from 'electron'

console.log('platform2', os.platform())

contextBridge.exposeInMainWorld('electronAPI', {
  nodeVersion: () => process.versions.node,
  chromeVersion: () => process.versions.chrome,
  electronVersion: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  setTitle: title => ipcRenderer.send('set-title', title),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openURL: url => ipcRenderer.send('open-url', url),
  logout: (func) => {
    ipcRenderer.on('logout', () => {
      func()
    })
  },
  reload: (func) => {
    ipcRenderer.on('reload', () => {
      func()
    })
  },
})
