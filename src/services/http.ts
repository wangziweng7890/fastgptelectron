/**
 * 取代原来的request.ts, get请求请使用swrv.ts定义的useSWRGet方法
 * 详情请参考example-api.ts
 */
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import Axios from 'axios'
import Qs from 'qs'
import type { Middleware } from './types'
import { reqBolbInterceptor, resCodeInterceptor, resErrorInterceptor } from './axios-interceptors'

export interface HttpRespData {
  data: any
  code: number
  message: string
}

const composeMiddlewares = (middlewares: Middleware[]) => {
  const total = middlewares.length
  return (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    const dispatch = async (i: number): Promise<AxiosRequestConfig> => {
      if (i === total)
        return config

      const fn = middlewares[i]
      config = await fn(config)

      return dispatch(i + 1)
    }

    return dispatch(0)
  }
}

const setTokenMiddleware: Middleware = (config: any) => {
  const authorization = localStorage.getItem('dwp-token')
  const access_token = localStorage.getItem('access_token')
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`
  }
  if (authorization)
    config.headers.Token = config.headers.Token || authorization
  config.headers.App = 'galaxy-admin'
  return config
}

export const createRequest = (
  config: AxiosRequestConfig = {},
  middlewares: Middleware[] = [],
): AxiosInstance => {
  const request = Axios.create({
    baseURL: config.baseURL || import.meta.env.VITE_APP_API_BASEURL || '/api',
    timeout: 30 * 1000, // 超时限制 30秒,
    // adapter,
    paramsSerializer: (params) => {
      return Qs.stringify(params, { arrayFormat: 'indices' })
    },
    ...config,
  })

  request.interceptors.request.use(composeMiddlewares([setTokenMiddleware, reqBolbInterceptor, ...middlewares]))
  request.interceptors.response.use(resCodeInterceptor, resErrorInterceptor)
  return request
}

const http = createRequest()

export default http
