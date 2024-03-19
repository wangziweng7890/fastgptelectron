import { BrowserWindow, Menu, app, globalShortcut } from 'electron'
import { checkUpdate, showVersion } from './appVersion'
import { isMac } from './help'

const copyKey = isMac ? 'Cmd+C' : 'Ctrl+C'
const pasteKey = isMac ? 'Cmd+V' : 'Ctrl+V'
const cutKey = isMac ? 'Cmd+X' : 'Ctrl+X'
const allKey = isMac ? 'Cmd+A' : 'Ctrl+A'
const devKey = isMac ? 'Cmd+Shift+D' : 'Ctrl+Shift+D'

export const myGlobalShortcut = (mainWindow: BrowserWindow) => {
  // 开发者工具
  globalShortcut.register(devKey, () => {
    const isOpened = mainWindow.webContents.isDevToolsOpened()
    isOpened ? mainWindow.webContents.closeDevTools() : mainWindow.webContents.openDevTools()
  })
}

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
          click: () => { app.exit() },
          label: '退出',
        },
      ],
    },
    {
      label: `窗口`,
      submenu: [
        {
          click: () => mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop()),
          label: `固定窗口`,
          type: 'checkbox',
          checked: mainWindow.isAlwaysOnTop(),
        },
      ]
    },
    {
      label: '快捷键',
      submenu: [
        { label: '复制', accelerator: copyKey, role: 'copy' },
        { label: '粘贴', accelerator: pasteKey, role: 'paste' },
        { label: '剪切', accelerator: cutKey, role: 'cut' },
        { label: '全选', accelerator: allKey, role: 'selectAll' },
      ],
    },
  ])

  Menu.setApplicationMenu(menu)
}
