import { UpdateInfo, autoUpdater } from 'electron-updater'
import { BrowserWindow, app, dialog } from 'electron'
import { isMac } from './help'

const updateUrl = 'https://public-resuorces.oss-cn-shenzhen.aliyuncs.com/galaxy-digital-helper/auto'

export const showVersion = () => {
  dialog.showMessageBox({
    type: 'info',
    message: `当前版本：V${app.getVersion()}`,
  })
}

/** 检测更新 */
export const checkUpdate = (win: BrowserWindow) => {
  console.log('开始检测版本')

  // 设置更新检测的资源路径，会检测对应路径下的 last.yaml文件中的版本信息 上线后确保该文件能正常访问
  if (isMac) {
    autoUpdater.setFeedURL(`${updateUrl}/mac`)
  }
  else {
    autoUpdater.setFeedURL(`${updateUrl}/win`)
  }
  console.log('autoUpdater')
  // 检测更新
  autoUpdater.checkForUpdates()

  // 监听'error'事件
  autoUpdater.on('error', (err) => {
    console.log(`出错拉${err}`)
    dialog.showErrorBox('更新出错拉！', err.message)
  })

  // 监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    dialog.showMessageBox({
      message: `发现新版本(v${info.version})，正在下载安装包`,
    })
  })

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      message: '当前已经是最新版本',
    })
  })

  // 更新包下载百分比回调
  autoUpdater.on('download-progress', (progressObj) => {
    if (win) {
      win.setProgressBar(progressObj.transferred / progressObj.total)
      // win.webContents.send('download-progress', progressObj)
    }
  })

  // 默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
  autoUpdater.autoDownload = true

  // 监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: '应用更新',
        message: '需要退出程序才能安装新版本，是否安装？',
        buttons: ['是', '否'],
      })
      .then((buttonIndex) => {
        if (buttonIndex.response === 0) {
          // 选择是，则退出程序，安装新版本
          win.webContents.send('quit')
          autoUpdater.quitAndInstall(true, true)
          if (win && win.destroy) {
            win.destroy()
          }
          app.quit()
        }
      })
  })
}
