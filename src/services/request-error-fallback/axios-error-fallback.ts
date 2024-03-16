/*
 * @FilePath: /vue3-admin-template/src/services/request-error-fallback/axios-error-fallback.ts
 * @Description:
 */
import type { AxiosError, AxiosInstance } from 'axios'
import { NeedLoginCode, NoErrorResponseCode } from '../types'
import type { ResponseError } from '../types'
import { install } from './error-fallback'
import { axiosErrorHandler } from './axios-error-handler'
import router from '@/router'

function login() {
  console.log('跳转登录')
  localStorage.clear()
  router.push({
    path: '/login',
  })
}
export function installAxiosErrorFallback(
  instance: AxiosInstance,
  errorHandler = axiosErrorHandler,
) {
  const { uninstall, makeErrorFallbackable } = install<AxiosError<ResponseError>>(
    errorHandler,
    instance,
  )
  instance.interceptors.response.use(
    async (res) => {
      const code = res.data?.code
      // 文件流时不判断res.data.code,此时res.data的类型为Blob
      if (Object.prototype.toString.call(res.data) === '[object Blob]')
        return res.data

      if (code in NoErrorResponseCode)
        return res.data

      if (NeedLoginCode.includes(code)) {
        login()
        return Promise.reject(makeErrorFallbackable(new Error('登录失效, 请重新登陆') as AxiosError))
      }
      return Promise.reject(makeErrorFallbackable(new Error(res.data.message || res.data.msg) as AxiosError))
    },
    (error: AxiosError<ResponseError>) => {
      if (NeedLoginCode.includes(error.response?.status || 0)) {
        login()
      }
      // 优先用后端的提示而不是axios的提示
      const data = error?.response?.data
      let message = ''
      if (Array.isArray(data?.invalid_fields)) {
        message = data?.invalid_fields.map(item => item.error).join('，') || ''
      }
      error.message = message || data?.message || error.message
      makeErrorFallbackable(error)
      throw error
    },
  )

  return uninstall
}
