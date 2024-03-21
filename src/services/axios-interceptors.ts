import type { AxiosError, AxiosRequestConfig } from 'axios'
import Axios from 'axios'
import { ElMessage } from 'element-plus'
import { NeedLoginCode, NoErrorResponseCode } from './types'
import type { Middleware, ResponseError } from './types'
import router from '@/router'

function login() {
  localStorage.clear()
  router.push({
    path: '/login',
  })
}

// 如果不想通过拦截器统一弹出axios的error message, 在axios的config中加入key是 HideAxiosErrorToastKey ，value：true的选项
// config = {[HideAxiosErrorToastKey]:true}
export const HideAxiosErrorToastKey = '_hide_axios_error_toast_key_'
export const resCodeInterceptor = async (res) => {
  const resData = res.data ?? {}
  const code = resData.code

  // 没有access_token，且不在登录页，则跳转登录
  const access_token = localStorage.getItem('access_token')
  if (!access_token && !location.href.includes('/login')) {
    login()
  }

  // 特殊url直接返回数据
  if (['/rest/api', '/wiki/rest'].some(t => res.config?.url.includes(t))) {
    return resData
  }

  // 文件流时不判断res.data.code,此时res.data的类型为Blob
  if (Object.prototype.toString.call(resData) === '[object Blob]')
    return resData

  if (code in NoErrorResponseCode)
    return resData.data

  const hideAxiosErrorToast = res.config?.[HideAxiosErrorToastKey]
  let errorMessage = resData.message || resData.msg

  if (NeedLoginCode.includes(code)) {
    login()
    errorMessage = '登录失效, 请重新登陆'
  }

  if (errorMessage.includes('timeout')) {
    errorMessage = '请求超时'
  }
  else if (errorMessage.includes('Network')) {
    errorMessage = '网络错误'
  }

  if (errorMessage && !hideAxiosErrorToast) {
    ElMessage.error(errorMessage)
  }

  return Promise.reject(resData)
}

export const resErrorInterceptor = (error: AxiosError<ResponseError>) => {
  if (['/rest/api', '/wiki/rest'].some(t => error!.config?.url?.includes(t))) {
    return Promise.reject(error)
  }
  if (NeedLoginCode.includes(error.response?.status || 0)) {
    login()
  }
  const hideAxiosErrorToast = error.config?.[HideAxiosErrorToastKey]

  // 优先用后端的提示而不是axios的提示
  const data = error.response?.data
  let message = ''
  if (Array.isArray(data?.invalid_fields)) {
    message = data?.invalid_fields.map(item => item.error).join('，') || ''
  }
  error.message = message || data?.message || error.message

  // if (error && error.response) {
  //   switch (error.response.status) {
  //   case 400: message = '参数错误'; break
  //   case 401: message = '登录失效，请重新登录'; break
  //   case 403: message = '您没有权限操作'; break
  //   case 404: message = '请求地址出错'; break
  //   case 408: message = '请求超时'; break
  //   case 500: message = '服务器内部错误'; break
  //   case 501: message = '服务未实现'; break
  //   case 502: message = '网关错误'; break
  //   case 503: message = '服务不可用！'; break
  //   case 504: message = '服务暂时无法访问，请稍后再试'; break
  //   case 505: message = 'HTTP版本不受支持'; break
  //   }
  // }
  // if (error.message.includes('timeout')) {
  //   message = '请求超时'
  // }
  // else if (error.message.includes('Network')) {
  //   message = '网络错误'
  // }
  const errMsg = '网络被妖怪抓走啦'
  error.message = errMsg

  if (error.message && !hideAxiosErrorToast && !Axios.isCancel(error)) {
    ElMessage.error(errMsg)
  }

  if (error.response?.data)
    return Promise.reject(error.response.data)
  return Promise.reject(errMsg)
}

/**
 * 需要加bolb 的url列表
 */
const BolbUrls = ['/pm/detail-list-export']

export const reqBolbInterceptor: Middleware = (config: AxiosRequestConfig) => {
  const url = config?.url?.split('?')[0] || ''
  if (BolbUrls.includes(url)) {
    config = {
      ...config,
      responseType: 'blob',
    }
  }
  return config
}
