import { BrowserWindow, IpcMainEvent, dialog, shell } from 'electron'

/**
 * 通过窗口事件获取发送者的窗口
 * @param event ipc发送窗口事件
 */
export function getWindowByEvent(event: IpcMainEvent): BrowserWindow | null {
  const webContentsId = event.sender.id
  for (const currentWin of BrowserWindow.getAllWindows()) {
    if (currentWin.webContents.id === webContentsId) {
      return currentWin
    }
  }
  return null
}

export function handleSetTitle(event, title: string) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win?.setTitle(title)
}
export async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: '对话框',
  })
  if (!canceled) {
    return filePaths[0]
  }
}

export const isMac = process.platform === 'darwin'

export const onOpenURL = (event, url: string) => {
  shell.openExternal(url)
}
