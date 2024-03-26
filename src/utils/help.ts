// 判断是否是mac电脑环境
export const isMac = (() => {
  return /macintosh|mac os x/i.test(navigator.userAgent)
})()
