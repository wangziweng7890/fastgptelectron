import { BrowserWindow, app, ipcMain, screen } from 'electron'
import { handleFileOpen, handleSetTitle, onOpenURL } from './help'
import { checkUpdate } from './appVersion'
export const mainOnRender = () => {
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
    console.log('check-update')
    const win = BrowserWindow.getFocusedWindow()
    win && checkUpdate(win)
  })
  ipcMain.on('refresh', () => {
    console.log('refresh')
    const win = BrowserWindow.getFocusedWindow()
    win?.loadFile('dist-electron/index.html')
  })
  // 固定窗口
  ipcMain.handle('affix-window', (event, flag: boolean) => {
    console.log('affix-window')
    const win = BrowserWindow.getFocusedWindow()
    win?.setAlwaysOnTop(flag)
    return win?.isAlwaysOnTop()
  })

  let previousBounds

  // 大小窗口
  ipcMain.handle('setIsFullScreen', (event, flag: boolean) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!flag) {
      console.log('leave')
      win.setBounds(previousBounds)
    }
    else {
      console.log('full')
      previousBounds = win.getBounds()
      const { width, height } = screen.getPrimaryDisplay().workAreaSize
      win.setBounds({
        x: 0,
        y: 0,
        width,
        height,
      })
    }
  })
  ipcMain.handle('getIsFullScreen', () => {
    const win = BrowserWindow.getFocusedWindow()
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    return win?.getBounds().width === width && win?.getBounds().height === height
  })

  ipcMain.handle('ping', () => 'pong2222')
  ipcMain.handle('dialog:openFile', handleFileOpen)
}

