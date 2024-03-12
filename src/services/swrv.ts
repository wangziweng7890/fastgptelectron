/*
 * @FilePath: /vue3-admin-template/src/services/swrv.ts
 * @Description:
 */
import useSWRV from '@galaxy/swrv'
import type { IConfig, IKey, IResponse } from '@galaxy/swrv/dist/types'
import type { AxiosRequestConfig } from 'axios'
import http from './http'

/** useSWRV 的默认配置 */
const SWRDefaultConfig: IConfig = {
  refreshInterval: 0, // 大于0时，开启定时器功能，0：不开启定时器
  ttl: 0, // 缓存的时间，0表示一直缓存
  dedupingInterval: 2000, // 多长时间内不重新验证同一个key
  revalidateOnFocus: false, // true：当浏览器窗口获得焦点时自动重新验证
  revalidateDebounce: 0,
  shouldRetryOnError: false, // true：错误时重试
  errorRetryInterval: 5000, // 错误时重试时间间隔
  errorRetryCount: 5, // 错误时重试次数
  autoFetch: false, // 是否基于依赖值变化自动发送请求
}

type GetKeyWithConfig = [string, AxiosRequestConfig<any>]

export const HttpGet = <ResData>(...params: GetKeyWithConfig) => {
  return http.get<any, ResData>(params[0], { ...(params[1] || {}) })
}

export const useSWRGet = <ResData>(key: IKey | GetKeyWithConfig, customConfig?: IConfig): IResponse<ResData> => {
  const swrvConfig = { ...SWRDefaultConfig, ...customConfig }
  return useSWRV<ResData, any>(key, http.get, swrvConfig)
  /** 以下支持传axiosConfig作为第二个参数，但是拿不到最新的返回值 */
  // return useSWRV<ResData, any>(key, HttpGet, swrvConfig)
}

export const useSWRGet2 = <ResData>(key: IKey | GetKeyWithConfig, customConfig?: IConfig): IResponse<ResData> => {
  const swrvConfig = { ...SWRDefaultConfig, ...customConfig }
  return useSWRV<ResData, any>(key, http.get, swrvConfig)
  /** 以下支持传axiosConfig作为第二个参数，但是拿不到最新的返回值 */
  // return useSWRV<ResData, any>(key, HttpGet, swrvConfig)
}

/**
 * 用于post、put、delete等请求
 * @param fun
 * @returns
 */
export const useMutation = <Res, RequestBody = undefined>(fun: (params?: RequestBody, axiosConfig?: AxiosRequestConfig) => Promise<Res>, axiosConfig?: AxiosRequestConfig) => {
  const loading = ref(false)
  const error = ref(undefined)
  const data = ref<Res>()
  const trigger = async (params?: RequestBody) => {
    loading.value = true
    try {
      const res = await fun(params, axiosConfig)
      loading.value = false
      data.value = res
      return res
    }
    catch (err: any) {
      error.value = err
      loading.value = false
      throw err
      // return undefined
    }
  }
  return {
    trigger,
    loading,
    error,
    data,
  }
}
