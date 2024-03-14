import path from 'path'
import { BrowserWindow, Menu, app, dialog, ipcMain } from 'electron'
import { getWindowByEvent, handleFileOpen, handleSetTitle } from './utils/help'
import { checkUpdate } from './utils/appVersion'

const isMac = process.platform === 'darwin'

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
          click: () => checkUpdate(win),
          // click: async () => {
          //   console.log('sdasdfasdf')
          //   const { shell } = require('electron')
          //   await shell.openExternal('https://electronjs.org')
          // },
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
    console.log('.....', process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  }
  else {
    // Load your file
    win.loadFile('dist-electron/index.html')
    win.webContents.openDevTools()
  }
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
