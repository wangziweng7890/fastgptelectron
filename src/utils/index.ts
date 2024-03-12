import { ElLoading, ElMessage } from 'element-plus'
import { digitPrompt } from '@/common/constants'

/**
 * @description: 待办中心提醒时间（相对时间集合）转换
 * @return {*}
 */
export const reminderRelativeTime = (list) => {
  return list.filter(item => typeof item !== 'string').map((v) => { return v.value })
}

/**
 * @description: 将标签数据每一项添加type
 * @param {*} list
 * @return {*}
 */
export const tagAddToType = (list) => {
  const obj = {
    '#edf2ff': '',
    '#edfbff': 'success',
    '#ecfbf6': 'info',
    '#fff3ef': 'warning',
  }

  return list.map((item) => {
    return { ...item, type: obj[item?.color] || '' }
  })
}

/**
 * @description: 判断strings[] 与objects[]的label 是否相同
 * @param {*} strings strings[]
 * @param {*} objects objects[]
 * @return {*} 返回不相同的strings[]
 */
export const isNotIncluded = (strings, objects) => {
  return strings.filter(str => !objects.value.some(obj => obj.label === str))
}

/**
 * @description: 判断是否为图片
 */
export const isImageType = (str: string) => {
  // toLowerCase() 将字符串转换为小写，返回一个新的字符串
  return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff'].includes(str.toLowerCase())
}

/**
 * @description:  根据文件url获取后缀名，不带小数点
 * @param {string} fileUrl 文件地址
 */
export const getSuffixName = (fileUrl: string) => {
  const queryIndex = fileUrl.indexOf('?') // 获取链接是否包含?参数
  fileUrl = queryIndex > 0 ? fileUrl.substring(0, queryIndex) : fileUrl // 如果包含?，去除?后面的参数
  const startIndex = fileUrl.lastIndexOf('.') + 1
  const fileType = fileUrl.substring(startIndex, fileUrl.length)
  return fileType.toLowerCase()
}

/**
 * @description:  根据文件url获取文件名，不带后缀名
 * @param {string} fileUrl 文件地址
 */
export const getPrefixName = (fileUrl: string) => {
  const queryIndex = fileUrl.indexOf('?') // 获取链接是否包含?参数
  fileUrl = queryIndex > 0 ? fileUrl.substring(0, queryIndex) : fileUrl // 如果包含?，去除?后面的参数
  const startIndex = fileUrl.lastIndexOf('/') + 1
  const endIndex = fileUrl.lastIndexOf('.')
  const fileName = fileUrl.substring(startIndex, endIndex)
  return fileName
}

/**
 * @description:  根据文件url完整的文件名，带后缀
 * @param {string} fileUrl 文件地址
 */
export const getFileName = (fileUrl: string) => {
  return `${getPrefixName(fileUrl)}.${getSuffixName(fileUrl)}`
}

/**
 * @description:  根据文件地址下载文件
 * @param {string} fileData 请求的文件地址或接口地址
 * @param {string} fileName 文件名，包含后缀名
 */
export const downloadFile = async (fileData: string | Blob, fileName?: string) => {
  const loading = ElLoading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    let blob: Blob
    if (typeof fileData === 'string') {
      const response = await fetch(fileData)
      blob = await response.blob()
    }
    else {
      blob = fileData
    }
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(blob)
    if (fileName) {
      a.download = `${fileName}`
    }
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(a.href) // 释放临时文件的内存
    loading.close()
  }
  catch (error) {
    console.log(error)
    ElMessage.error(error)
    loading.close()
  }
}

/**
 * @description 导出文件
 * @author Jeff.Guo
 * @param { data } 接口请求过来的二进制文件或者文件资料路径
 * @param { fileName } 自定义下载保存的文件名
 * @example exportData(url, filename)
 */
export const exportData = (data: BlobPart | string, fileName: string) => {
  const link = document.createElement('a')
  link.download = fileName
  link.style.display = 'none'
  const blob = new Blob([data])
  link.href = URL.createObjectURL(blob)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * @description:  根据url新窗口预览图片
 * @param {string} fileUrl 文件地址
 */
export const previewImg = async (fileUrl: string) => {
  const response = await fetch(fileUrl)
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob) // 生成临时文件
  window.open(url)
  window.URL.revokeObjectURL(url) // 释放临时文件的内存
}

/**
 * 获取文字宽度
 * @param text 文字
 * @param font 字体
 * @returns 文字宽度
 */
export function getTextWidth(text, font) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  context.font = font
  return context.measureText(text).width
  // const div = document.createElement('div')
  // div.innerText = text
  // const style = {
  //     font,
  //     overflowX: 'scroll',
  //     width: 0,
  //     wordBreak: 'keep-all',
  // }
  // Object.assign(div.style, style)
  // document.body.appendChild(div)
  // const width = div.scrollWidth
  // document.body.removeChild(div)
  // return width
}

/**
 * 获取文字行数
 * @param text 文字
 * @param font 字体
 * @returns 行数
 */
export function getLine(text, font, width) {
  const div = document.createElement('div')
  div.innerText = '1是'
  const style = {
    font,
    width: `${width}px`,
    wordBreak: 'break-all',
  }
  Object.assign(div.style, style)
  document.body.appendChild(div)
  const oneHeight = div.scrollHeight
  div.innerText = text
  const actualHeight = div.scrollHeight
  const line = Math.floor(actualHeight / oneHeight)
  document.body.removeChild(div)
  return line
}

/**
 * 复制
 * @param content string
 * @returns boolean
 */
export function copy(content) {
  const textarea = document.createElement('textarea')
  textarea.readOnly = true
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  // 将要 copy 的值赋给 textarea 标签的 value 属性
  textarea.value = content
  // 将 textarea 插入到 body 中
  document.body.appendChild(textarea)
  // 选中值并复制
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
  const result = document.execCommand('copy')
  document.body.removeChild(textarea)
  return result
}

// 判断是否是链接
export function isLink(str) {
  if (!str.trim()) {
    return false
  }
  // 包含 http、https、ftp 等协议的链接
  const linkReg = /^(http|https|ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/
  // 包含 www 开头的链接
  const wwwLinkReg = /^www\.[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/
  // 包含协议名的链接
  const protocolLinkReg = /^[\w\-_]+:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/

  return linkReg.test(str) || wwwLinkReg.test(str) || protocolLinkReg.test(str)
}

/**
 *
 * @param list Obj 筛选json
 * @param str 要匹配的字符串
 * @returns 替换后的字符串
 */
export const replaceContent = (list, str: string): string => {
  str = str.replace(/<div>|<\/div>/g, '')
  str = str.replace(/\[(\w+)\]/g, (match, key) => {
    return list[key] || ''
  })
  return str
}

/**
 * 转换配置对象，方便通过value值访问配置项
 * 新对象key = value的值
 */
export function transformConfig<Config extends Record<string, {
  value: number
  [key: string]: any
}>>(config: Config) {
  return Object.values(config).reduce((prev, cur) => {
    prev[cur.value] = cur
    return prev
  }, {})
}

/**
 * @description: 秒转化为分钟，不足一分钟向上取整
 * @param {*} seconds 秒
 * @return {*}
 */
export const formatTime = (seconds) => {
  if (seconds === null) {
    return '-'
  }

  const minutes = Math.ceil(seconds / 60)
  return `${minutes}分钟`
}

/**
 * 获取给定菜单树中所有叶子节点的ID数组。
 * @param {Expand<IMenus>[]} menuTree - 要遍历的菜单树。
 * @returns {number[]} 叶子节点的ID数组。
 */
export const getAllPagesId = (menuTree: Expand<IMenus>[]): number[] => {
  const leafNodeIds: number[] = []
  /**
     * 遍历给定的节点，并递归地对每个子节点执行特定的操作。
     * @param {object} node - 要遍历的节点。
     */
  function traverse(node) {
    if (!node.children || node.children.length === 0) {
      leafNodeIds.push(node.id)
    }
    else {
      for (const child of node.children) {
        traverse(child)
      }
    }
  }

  for (const node of menuTree) {
    traverse(node)
  }

  return leafNodeIds
}

/**
 * 在菜单树中查找指定属性的值。
 * @param {Array} menuTree - 要搜索的菜单树。
 * @param {*} value - 要搜索的值。
 * @param {string} property - 要匹配的属性。
 * @param {string} returnProperty - 通过property匹配到的值，返回returnProperty的值。
 * @return {*} 匹配属性的值，如果未找到则返回 null。
 */
export function findMenuProperty(menuTree, value, property, returnProperty) {
  for (const menu of menuTree) {
    if (menu[property] === value) {
      return menu[returnProperty]
    }
    if (menu.children && menu.children.length > 0) {
      const result = findMenuProperty(menu.children, value, property, returnProperty)
      if (result) {
        return result
      }
    }
  }
  return null
}

/**
 * @description: 处理人（英-中）fullName
 * @param {*} list userList
 * @return {*}
 */
export const userFullNameList = (list) => {
  return list?.map((item) => {
    const { english_name, name } = item
    item.fullName = english_name ? (name ? `${english_name} - ${name}` : english_name) : name
    return item
  })
}

/**
 * @description: 匹配一个字符串中所有被两个#号包裹的内容，替换后返回一下新的字符串
 * @param {*} str 传入的字符串
 * @return {*} 新的字符串
 */
export const getPushContent = (str: string): String => {
  const regex = /#([^#]+)#/g
  str = str.replace(regex, (match, key) => {
    return `<span style="color: #1453ff;">#${key}#</span>`
  })
  return str
}

/**
 * 检查给定的 DOM 元素中的文本是否溢出其容器。
 *
 * @param {HTMLElement} dom - 要检查文本溢出的 DOM 元素。
 * @return {boolean} 如果文本溢出则返回 true，否则返回 false。
 */
export const textIsOverflow = (dom: HTMLElement) => {
  if (dom instanceof HTMLElement) {
    return dom.scrollWidth > dom.clientWidth || dom.scrollHeight > dom.clientHeight
  }
  else {
    return false
  }
}

/**
 * @description: 高亮关键词
 * @param {string} text 要高亮的文本
 * @param {string} keyword 关键词
 * @param {string} color 默认颜色 #E0252B
 * @return {*}
 */
export const highlightKeywords = (text: string, keyword: string, color = '#E0252B'): string => {
  const regex = new RegExp(`(${keyword})`, 'g')
  const replacedText = text.replace(regex, `<span style="color: ${color}">$1</span>`)
  return replacedText
}

/**
 * @description: 数据分组函数
 * @param {*} arr 需要分组的原数组
 * @param {*} generateKey 按xxx分组 可以为字符串或者是函数
 * @return {*} 返回的分组结果
 * @example console.log('按性别分组',groupBy(people, item => item.sex))
 * console.log('按年龄分组', groupBy(people, 'age'))
 * console.log('按 年龄-性别 分组',groupBy(people, item => `${item.age}-${item.sex}`))
 * console.log('按 奇偶数 分组',groupBy(arr, item => (item % 2 === 0 ? '偶' : '奇')))
 */
export const groupBy = (arr: any[], generateKey: (item: any) => string) => {
  if (typeof generateKey === 'string') {
    const propName = generateKey
    generateKey = item => item[propName]
  }

  return arr.reduce((result, item) => {
    const key = generateKey(item)
    result[key] = result[key] || []
    result[key].push(item)
    return result
  }, {})
}

/**
 * @description: 过滤对象中的某些属性
 * @param {any} obj
 * @param {string} fields 需要过滤的属性
 * @return {*}
 */
export const filterObject = (obj: any, fields: string[]) => {
  const filteredObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (fields.includes(key)) {
      filteredObj[key] = value
    }
  }
  return filteredObj
}

/**
 * @description: 移出千分位分隔符
 * @param {number} val
 * @return {*}
 */
export const removeThousandsSeparator = (val: number | string) => {
  return Number(String(val).replace(/[^0-9.-]+/g, ''))
}

/**
 * @description: 获取数字提示符（百-千亿）
 * @param {number} num
 * @return {*}
 */
export const getDigitPrompt = (num: number) => {
  const numLength = String(num).length
  return digitPrompt[numLength - 3] || ''
}

export const getMonthAndWeek = (dateStr: string) => {
  const date = new Date(dateStr)
  // 月份
  const month = date.getMonth() + 1
  // 周数
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // 周一为 0，周日为 6
  const dayOfMonth = date.getDate()
  const week = Math.ceil((dayOfMonth + firstDayOfWeek) / 7)
  console.log(month, week)

  return { month, week }
}

