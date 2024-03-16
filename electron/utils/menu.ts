import { BrowserWindow, Menu, app } from 'electron'
import { checkUpdate, showVersion } from './appVersion'
import { isMac } from './help'

const refreshKey = isMac ? 'Cmd+R' : 'Ctrl+R'
const copyKey = isMac ? 'Cmd+C' : 'Ctrl+C'
const pasteKey = isMac ? 'Cmd+V' : 'Ctrl+V'
const cutKey = isMac ? 'Cmd+X' : 'Ctrl+X'
const allKey = isMac ? 'Cmd+A' : 'Ctrl+A'

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
          click: () => mainWindow.webContents.openDevTools(),
          label: '开发者',
        },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
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
