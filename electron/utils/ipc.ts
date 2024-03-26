import { BrowserWindow, app, ipcMain } from 'electron'
import { handleFileOpen, handleSetTitle, onOpenURL } from './help'
import { checkUpdate } from './appVersion'

export const mainOnRender = (mainWin: BrowserWindow) => {
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.on('open-url', onOpenURL)
  ipcMain.on('minimize', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
  })
  ipcMain.on('close', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.close()
  })
  ipcMain.on('exit', () => {
    app.exit()
  })
  ipcMain.on('check-update', () => {
    const win = BrowserWindow.getFocusedWindow()
    win && checkUpdate(win)
  })
  ipcMain.on('refresh', () => {
    mainWin?.loadFile('dist-electron/index.html')
    // win?.reload()
  })
  // 固定窗口
  ipcMain.handle('affix-window', (event, flag: boolean) => {
    const win = BrowserWindow.getFocusedWindow()
    win?.setAlwaysOnTop(flag)
    return win?.isAlwaysOnTop()
  })

  ipcMain.handle('ping', () => 'pong2222')
  ipcMain.handle('dialog:openFile', handleFileOpen)
}

