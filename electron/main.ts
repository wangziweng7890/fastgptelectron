import path from 'path'
import { BrowserWindow, app, dialog, ipcMain } from 'electron'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 900,
    webPreferences: {
      contextIsolation: true, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // ipcMain.on('set-title', (event, title) => {
  //   const webContents = event.sender
  //   const win = BrowserWindow.fromWebContents(webContents)
  //   win?.setTitle(title)
  // })

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

function handleSetTitle(event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win?.setTitle(title)
}
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: '对话框',
  })
  if (!canceled) {
    return filePaths[0]
  }
}

app.whenReady().then(() => {
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
