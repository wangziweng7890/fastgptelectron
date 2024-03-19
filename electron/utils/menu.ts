import { BrowserWindow, Menu, app, globalShortcut } from 'electron'
import { checkUpdate, showVersion } from './appVersion'
import { isMac } from './help'

const copyKey = isMac ? 'Cmd+C' : 'Ctrl+C'
const pasteKey = isMac ? 'Cmd+V' : 'Ctrl+V'
const cutKey = isMac ? 'Cmd+X' : 'Ctrl+X'
const allKey = isMac ? 'Cmd+A' : 'Ctrl+A'
const devKey = isMac ? 'Cmd+F12' : 'Ctrl+F12'

export const myGlobalShortcut = () => {
  // 开发者工具
  globalShortcut.register(devKey, () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools()
    }
  })
}
app
export const setMenu = (mainWindow: BrowserWindow) => {
  const menu = Menu.buildFromTemplate([
    {
      label: '数字助理',
      submenu: [
        {
          click: () => showVersion(),
          label: `当前版本：V${app.getVersion()}`,
        },
        {
          click: () => checkUpdate(mainWindow),
          label: '检查版本更新',
        },
        {
          click: () => {
            mainWindow.webContents.send('logout', 'Hello, Renderer Process!')
          },
          label: '切换账号',
        },
        {
          click: () => { app.exit() },
          label: '退出',
        },
      ],
    },
    {
      label: '窗口',
      submenu: [
        {
          click: () => mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop()),
          label: '固定窗口',
          type: 'checkbox',
          checked: mainWindow.isAlwaysOnTop(),
        },
      ],
    },
  ])

  Menu.setApplicationMenu(menu)
}
