import path from 'path'
import { BrowserWindow, app, ipcMain } from 'electron'
import { handleFileOpen, handleSetTitle, isMac, onOpenURL } from './utils/help'
import { checkUpdate } from './utils/appVersion'
import { setMenu } from './utils/menu'

let mainWindow: BrowserWindow
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 900,
    icon: path.join(__dirname, isMac ? 'favicon.icns' : 'favicon.ico'),
    webPreferences: {
      contextIsolation: true, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
    },
    title: '银河数字助理',
  })

  setMenu(mainWindow)

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`1111
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    console.log('location:.....', process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  }
  else {
    mainWindow.loadFile('dist-electron/index.html')
  }
  !isMac && checkUpdate(mainWindow)
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong2222')
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.on('open-url', onOpenURL)
  console.log('whenReady')
  if (!mainWindow) {
    createWindow()
  }

  app.on('activate', () => {
    console.log('app activate')
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}
else {
  app.on('second-instance', () => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized())
        mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })
}

// app.on('before-quit', () => {
//   clearInterval(updateInterval)
// })

app.on('window-all-closed', () => {
  console.log('window-all-closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
