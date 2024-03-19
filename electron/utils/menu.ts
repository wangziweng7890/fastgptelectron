import { BrowserWindow, Menu, app, ipcRenderer } from 'electron'
import { checkUpdate, showVersion } from './appVersion'
import { isMac } from './help'

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
        isMac ? { role: 'close', label: '结束' } : { role: 'quit', label: '结束' },
      ],
    },
  ])

  Menu.setApplicationMenu(menu)
}
