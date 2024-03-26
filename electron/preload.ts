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
  reload: () => {
    ipcRenderer.send('reloadWin')
  },
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close'),
  affixWindow: (flag: boolean) => ipcRenderer.invoke('affix-window', flag),
  exit: () => ipcRenderer.send('exit'),
  checkUpdate: () => ipcRenderer.send('check-update'),
  onUpdateAvailable: func => ipcRenderer.on('update-available', () => {
    func()
  }),
  onDownloadProgress: func => ipcRenderer.on('download-progress', (_event, progress) => {
    func(progress)
  }),
  onUpdateDownloaded: func => ipcRenderer.on('update-downloaded', () => {
    func()
  }),
  onAppVersion: func => ipcRenderer.on('app-version', (_event, version) => {
    func(version)
  }),
  refresh: () => ipcRenderer.send('refresh'),
})
