// 自动下载iconfont
import path from 'path'
import fse from 'fs-extra'
import axios from 'axios'
import { zip } from 'compressing'

const config = {
  cookie: 'cna=Xl2hHHeH5GYCAXFZYa3NFmsI; EGG_SESS_ICONFONT=U9fbDOeaopkgF8Nw-zVwcgoQJNiGBLVo9e4m0Azk-Cw_Qo7u53eQH6b3oo1pOEgt8eSlAsgJPC5zN7anUpHmnuuZbltZUnIJP69xPZCv-pz8RY86EODkr3Nf2zat7rt3XZ3D1T-wzQ7leAV41ukKo-iZTlTStPlm8K2zHhxRUCm06QqgK9kqMRsrjqekTSOMOc9iDKlUW6Ks02ekylUO5BgeY0lH0NBwXTby8Cxf34UlVG0eQUOWuRhsB89tt5fD; locale=zh-cn; xlly_s=1; ctoken=_zwmQdUWzsOAfXp5NIykDT4K; u=5509081; u.sig=DQk-Ka_8iGU9qoHZrfIxUajSHTJndoXdJHQwxO4hdjk; isg=BJOTxA9Y8xSNb7-kLS6wgXS0Ihe9SCcKu-96j0WwY7LpxLBmzBp6W8lS_jSq5H8C',
  pid: '4011647',
  ctoken: '_zwmQdUWzsOAfXp5NIykDT4K',
  targetPath: 'src/assets/icon',
  include: [
    'iconfont.css',
    'iconfont.ttf',
    'iconfont.woff',
    'iconfont.woff2',
  ],
}

async function init() {
  try {
    const res = await downLoadZip(config) // 下载iconfont
    const tempPath = path.join(process.cwd(), 'tempDownLoadPath')
    await zip.uncompress(res.data, tempPath) // 解压文件到指定目录并返回目录名
    const zipPath = await listDir(tempPath)
    await moveFile(
      path.join(tempPath, zipPath[0]),
      config.targetPath,
      config,
    )
    await fse.emptyDirSync(tempPath) // 清空临时目录
    console.log('%c下载iconfont成功', 'color: green;')
  }
  catch (error) {
    console.error(
      `%c请检查cookie， ctoken, pid是否正确: ${error}`,
      'color: red;',
    )
  }
}

// 到阿里图标下载图标
async function downLoadZip(config) {
  const DOWNLOAD_URL = 'https://www.iconfont.cn/api/project/download.zip'
  return axios.get(DOWNLOAD_URL, {
    responseType: 'stream',
    headers: {
      cookie: config.cookie,
    },
    params: {
      pid: config.pid,
      ctoken: config.ctoken,
    },
  })
}

function listDir(path) {
  return new Promise((resolve, reject) => {
    fse.readdir(path, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      // 把mac系统下的临时文件去掉
      if (data && data.length > 0 && data[0] === '.DS_Store') {
        data.splice(0, 1)
      }
      resolve(data)
    })
  })
}

// 移动文件到指定目录
async function moveFile(srcFolder, targetPath, options) {
  const files = await listDir(srcFolder)
  for (let index = 0; index < files.length; index++) {
    const fileName = files[index]
    const srcFile = path.join(srcFolder, fileName)
    const destFile = path.join(targetPath, fileName)
    if (options.include && options.include.includes(fileName)) {
      // 过滤掉不需要的文件
      await fse.moveSync(srcFile, destFile, {
        // 从临时目录移动到目的地址
        overwrite: true,
      })
    }
  }
}

init()
