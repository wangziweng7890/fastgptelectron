/*
 * @FilePath: \Document-System\run.js
 * @Description: 测试环境发布脚本
 * @config: {servicesPath， servicesName} 服务配置,有新增的服务需要在此配置
 * @config: {newContent} 如果有针对不同服务的环境变量，可在newContent内新增
 */
const fs = require('fs')
const { spawn } = require('child_process')
const { prompt } = require('inquirer')
const shellFile = './publish.sh'
const isOnlyPublish = process.argv[2] === 'publish'
const isOnlyBuild = process.argv[2] === 'build'
const servicesPath = {
  dwp: {
    ip: '192.168.11.175',
    dir: '/www/wwwroot/web/dwp/main',
    user: 'www', // password: kdcaEde3#ADFAD
    url: 'https://test.dwp.galaxy-immi.com',
    crmUrl: 'https://test.crm.galaxy-immi.com',
    mode: 'test',
  },
  dwpdev: {
    ip: '192.168.11.169',
    dir: '/var/www/web/dev/dwp/main',
    user: 'www-data', // password: kdcaEde3#ADFAD
    url: 'http://middle-platform.galaxy-immi.com:8080',
    crmUrl: 'http://middle-platform.galaxy-immi.com:8180',
    mode: 'dwpdev',
  },
  test1: {
    ip: '192.168.11.169',
    dir: '/var/www/web/test-1/dwp/main',
    user: 'www-data', // password: kdcaEde3#ADFAD
    url: 'http://middle-platform.galaxy-immi.com:8081',
    crmUrl: 'http://middle-platform.galaxy-immi.com:8181',
    mode: 'dwptest1',
  },
  test2: {
    ip: '192.168.11.169',
    dir: '/var/www/web/test-2/dwp/main',
    user: 'www-data', // password: kdcaEde3#ADFAD
    url: 'http://middle-platform.galaxy-immi.com:8082',
    crmUrl: 'http://middle-platform.galaxy-immi.com:8182',
    mode: 'dwptest2',
  },
  test3: {
    ip: '192.168.11.169',
    dir: '/var/www/web/test-3/dwp/main',
    user: 'www-data', // password: kdcaEde3#ADFAD
    url: 'http://middle-platform.galaxy-immi.com:8083',
    crmUrl: 'http://middle-platform.galaxy-immi.com:8183',
    mode: 'dwptest3',
  },
}
const servicesName = [
  { name: servicesPath.dwp.url, value: 'dwp' },
  { name: servicesPath.dwpdev.url, value: 'dwpdev' },
  { name: servicesPath.test1.url, value: 'test1' },
  { name: servicesPath.test2.url, value: 'test2' },
  { name: servicesPath.test3.url, value: 'test3' },
]
/**
 * 根据对应的部署环境修改env.test文件
 * @param {string} serveObj - 所要发布的环境的配置信息。
 * @return {void} 此函数不返回任何值。
 */
function fixEnv(serveObj) {
  const envFilePath = './.env.test'
  // 将匹配行之后的内容替换为新的文本内容
  const newContent = `VITE_CRM_URL = ${serveObj.crmUrl || serveObj.url}\n`
    + `VITE_APP_USER_INFO_BASEURL = ${serveObj.url}/subapp/userInfo\n`

  // 读取文件
  fs.readFile(envFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    // 使用正则表达式匹配以 "# TIPS:" 开头的行以及之后的所有内容
    const regex = /(# TIPS：[\s\S]*)/
    const replacedData = data.replace(regex, (match) => {
      // 获取匹配到的文本
      const matchedText = match

      // 获取匹配行之后的内容
      const content = matchedText.split('\n').slice(1).join('\n')

      // 拼接替换后的文本
      return matchedText.replace(content, newContent)
    })

    // 将替换后的内容写回到文件中
    fs.writeFile(envFilePath, replacedData, 'utf8', (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('env.test文件已更新!')
    })
  })
}
/**
 * 选择需要部署发版的服务器
 * @return {Promise<void>} 该函数没有返回值。
 */
const choicesService = async () => {
  const { services } = await prompt([
    {
      type: 'rawlist',
      name: 'services',
      message: '请选择要发布的服务地址:',
      default: 0,
      choices: servicesName,
    },
  ])
  if (isOnlyPublish) {
    runShell(services)
  }
  else {
    runBuild(services)
  }
}

// 执行本地编译操作
function runBuild(services) {
  fixEnv(servicesPath[services])
  // 执行shell脚本
  const scriptProcess = spawn('npx vite build --mode test', [], { shell: true })
  // 实时输出脚本的执行日志
  scriptProcess.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  // 输出脚本的错误日志
  scriptProcess.stderr.on('data', (data) => {
    console.error(data.toString())
  })

  // 检查脚本的退出码
  scriptProcess.on('close', (code) => {
    if (code === 0) {
      console.log(isOnlyBuild ? '本地编译完成' : `本地编译完成，等待部署到服务器:${services}`)
      if (isOnlyBuild) {
        return
      }
      runShell(services)
    }
    else {
      console.log('本地编译失败，请检查代码')
    }
  })
}

// 执行部署操作
function runShell(services) {
  const publishProcess = spawn(`sh ${shellFile} ${servicesPath[services].ip} ${servicesPath[services].dir} ${servicesPath[services].user} ${servicesPath[services].url}`, [], { shell: true })
  publishProcess.stdout.on('data', (data) => {
    console.log(data.toString())
  })
  publishProcess.stderr.on('data', (data) => {
    console.error(data.toString())
  })
  publishProcess.on('close', (shellCode) => {
    console.log(shellCode === 0 ? `发布成功!请前往浏览器访问：${servicesPath[services].url}` : '发布失败!请执行“pnpm publish:test”重新发布！')
  })
}
const isCicd
    = process.argv[3] && Object.keys(servicesPath).includes(process.argv[3])

if (isCicd) {
  const servicesName = process.argv[3]
  runBuild(servicesName)
}
else {
  choicesService()
}

