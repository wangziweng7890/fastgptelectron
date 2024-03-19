import path from 'path'
import { BrowserWindow, Menu, Tray, app } from 'electron'
import { isMac } from './help'

export const setTray = (win: BrowserWindow) => {
  const tray = new Tray(path.join(__dirname, isMac ? 'favicon.icns' : 'favicon.ico'))
  tray.on('click', () => {
    win.show()
  })

  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        app.exit()
      },
    },
  ])

  tray.on('right-click', () => {
    tray.popUpContextMenu(trayContextMenu)
  })
}
