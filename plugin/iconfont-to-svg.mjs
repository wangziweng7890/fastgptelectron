// 将iconfont转成svg
import path from 'path'
import fse from 'fs-extra'
import axios from 'axios'

const config = {
  cookie: 'cna=Xl2hHHeH5GYCAXFZYa3NFmsI; EGG_SESS_ICONFONT=U9fbDOeaopkgF8Nw-zVwcgoQJNiGBLVo9e4m0Azk-Cw_Qo7u53eQH6b3oo1pOEgt8eSlAsgJPC5zN7anUpHmnuuZbltZUnIJP69xPZCv-pz8RY86EODkr3Nf2zat7rt3XZ3D1T-wzQ7leAV41ukKo-iZTlTStPlm8K2zHhxRUCm06QqgK9kqMRsrjqekTSOMOc9iDKlUW6Ks02ekylUO5BgeY0lH0NBwXTby8Cxf34UlVG0eQUOWuRhsB89tt5fD; locale=zh-cn; xlly_s=1; ctoken=_zwmQdUWzsOAfXp5NIykDT4K; u=5509081; u.sig=DQk-Ka_8iGU9qoHZrfIxUajSHTJndoXdJHQwxO4hdjk; isg=BJOTxA9Y8xSNb7-kLS6wgXS0Ihe9SCcKu-96j0WwY7LpxLBmzBp6W8lS_jSq5H8C',
  pid: '4011647',
  ctoken: '_zwmQdUWzsOAfXp5NIykDT4K',
  targetPath: 'src/assets/iconfontSvg',
  excludes: [], // 不需要生成的
}

async function init() {
  try {
    const res = await downLoadZip(config) // 下载iconfont
    const excludes = (
      await listDir(path.join(process.cwd(), config.targetPath))
    ).map(item => item.split('.svg')[0])
    excludes.concat(config.excludes)
    const arr = []
    await Promise.allSettled(
      res.data.data.icons
        .filter(item => !excludes.includes(item.name))
        .map(async (item) => {
          await fse.outputFileSync(
            path.join(
              process.cwd(),
              config.targetPath,
              `${item.name}.svg`,
            ),
            item.show_svg
              .replace(/fill="#[\w\d]+"/g, 'fill="currentColor"')
              .replace(/style="[^"]*"/g, ''),
          )
          arr.push(item.name)
        }),
    )
    console.log(`%c已为您生成以下svg: ${arr.toString()}`, 'color: green;')
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
  const DOWNLOAD_URL = 'https://www.iconfont.cn/api/project/detail.json'
  return axios.get(DOWNLOAD_URL, {
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

init()
