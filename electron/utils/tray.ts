import { BrowserWindow, Menu, Tray, app } from "electron"
import path from "path"



export const setTray = (win: BrowserWindow) => {
  const tray = new Tray(path.join(__dirname, './favicon.ico'))
  tray.on('click', () => {
    win.show()
  })

  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        app.exit()
      }
    }
  ])

  tray.on('right-click', () => {
    tray.popUpContextMenu(trayContextMenu)
  })
}