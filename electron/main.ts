import path from 'path'
import { BrowserWindow, app } from 'electron'
import { isMac } from './utils/help'
import { checkUpdate } from './utils/appVersion'
import { myLocalShortcut, setMenu } from './utils/menu'
import { setTray } from './utils/tray'
import { mainOnRender } from './utils/ipc'

let mainWindow: BrowserWindow
let updateInterval
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: process.env.VITE_DEV_SERVER_URL ? 1000 : 600,
    height: 800,
    icon: path.join(__dirname, isMac ? 'favicon.icns' : 'favicon.ico'),
    webPreferences: {
      contextIsolation: true, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
    },
    title: '银河数字助理',
    frame: false,
  })

  setMenu(mainWindow)
  // Menu.setApplicationMenu(null)

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`1111
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    console.log('location:.....', process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  }
  else {
    mainWindow.loadFile('dist-electron/index.html')
  }
  !isMac && checkUpdate(mainWindow, updateInterval)
  updateInterval = setInterval(() => {
    !isMac && checkUpdate(mainWindow, updateInterval)
  }, 1000 * 60 * 60 * 2)

  return mainWindow
}

app.whenReady().then(() => {
  console.log('whenReady')

  if (!mainWindow) {
    createWindow()
  }
  myLocalShortcut(mainWindow)
  // 设置托盘
  !isMac && setTray(mainWindow)
  app.on('activate', () => {
    console.log('app activate')
    if (BrowserWindow.getAllWindows().length === 0) {
      console.log('0 createWindow')
      createWindow()
      myLocalShortcut(mainWindow)
    }
  })

  mainWindow.on('close', (e) => {
    if (!isMac) {
      e.preventDefault()
      mainWindow.hide()
    }
  })
  // ipc通信
  mainOnRender(mainWindow)
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.exit()
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

app.on('before-quit', () => {
  console.log('before-quit')
  clearInterval(updateInterval)
  app.exit()
})

app.on('quit', () => {
  console.log('quit')
  app.exit()
})

app.on('window-all-closed', () => {
  console.log('window-all-closed')
  if (!isMac) {
    app.quit()
  }
})

app.on('web-contents-created', () => {
  console.log('web-contents-created')
  const win = BrowserWindow.getFocusedWindow()
  win?.webContents?.send('app-version', app.getVersion())
})

