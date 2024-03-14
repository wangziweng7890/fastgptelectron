import path from 'path'
import { BrowserWindow, Menu, app, ipcMain } from 'electron'
import { handleFileOpen, handleSetTitle } from './utils/help'
import { checkUpdate, showVersion } from './utils/appVersion'

const isMac = process.platform === 'darwin'
let updateInterval
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 900,
    icon: path.join(__dirname, 'favicon.svg'),
    webPreferences: {
      contextIsolation: true, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  // mac
  if (isMac) {
    // app.dock.setIcon(path.join(__dirname, './favicon.svg'))
  }

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => showVersion(),
          label: `当前版本：V${app.getVersion()}`,
        },
        {
          click: () => checkUpdate(win),
          label: '检查版本更新',
        },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
  ])
  Menu.setApplicationMenu(menu)

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`1111
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    console.log('location:.....', process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  }
  else {
    // Load your file
    win.loadFile('dist-electron/index.html')
    win.webContents.openDevTools()
  }
  console.log('info...', app.name, app.getVersion())
  checkUpdate(win)
  updateInterval = setInterval(() => {
    checkUpdate(win)
  }, 1000 * 60 * 15)
}

app.whenReady().then(() => {
  // ipcMain.handle('check-update', (e: any) => {
  //   // 获取发送通知的渲染进程窗口
  //   const currentWin = getWindowByEvent(e)
  //   // 升级校验
  //   checkUpdate(currentWin as BrowserWindow)
  // })
  ipcMain.handle('ping', () => 'pong2222')
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('before-quit', () => {
  clearInterval(updateInterval)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
