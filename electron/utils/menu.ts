import { BrowserWindow, Menu, app, globalShortcut } from 'electron'
import electronLocalshortcut from 'electron-localshortcut'
import { checkUpdate, showVersion } from './appVersion'
import { isMac } from './help'

const devKey = isMac ? 'Cmd+F12' : 'Ctrl+F12'
const copyKey = isMac ? 'Cmd+C' : 'Ctrl+C'
const pasteKey = isMac ? 'Cmd+V' : 'Ctrl+V'
const allKey = isMac ? 'Cmd+A' : 'Ctrl+A'
const cutKey = isMac ? 'Cmd+X' : 'Ctrl+X'
const undoKey = isMac ? 'Cmd+Z' : 'Ctrl+Z'

export const myLocalShortcut = (win: BrowserWindow) => {
  // const focusedWindow = BrowserWindow.getFocusedWindow()
  // 打开控制台
  globalShortcut.register(devKey, () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools()
    }
  })
  if (isMac) {
    electronLocalshortcut.register(win, copyKey, () => {
      win?.webContents?.copy()
    })
    electronLocalshortcut.register(win, pasteKey, () => {
      win?.webContents?.paste()
    })
    electronLocalshortcut.register(win, cutKey, () => {
      win?.webContents?.cut()
    })
    electronLocalshortcut.register(win, allKey, () => {
      win?.webContents?.selectAll()
    })
    electronLocalshortcut.register(win, undoKey, () => {
      win?.webContents?.undo()
    })
  }
  // focusedWindow?.on('blur', () => {
  //   globalShortcut.unregisterAll()
  // })
}

// 改用web自定义菜单UI
export const setMenu = (mainWindow: BrowserWindow) => {
  const menu = Menu.buildFromTemplate([
    {
      label: '数字助理',
      submenu: [
        {
          click: () => {
            mainWindow.loadFile('dist-electron/index.html')
          },
          label: '刷新',
        },
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
    // {
    //   label: '窗口',
    //   submenu: [
    //     {
    //       click: () => mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop()),
    //       label: '固定窗口',
    //       type: 'checkbox',
    //       checked: mainWindow.isAlwaysOnTop(),
    //     },
    //   ],
    // },
  ])

  Menu.setApplicationMenu(menu)
}
