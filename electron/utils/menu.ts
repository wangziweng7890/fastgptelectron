import { BrowserWindow, Menu, app } from 'electron'
import { checkUpdate, showVersion } from './appVersion'
import { isMac } from './help'

export const setMenu = (mainWindow: BrowserWindow) => {
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
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
  ])

  Menu.setApplicationMenu(menu)
}
