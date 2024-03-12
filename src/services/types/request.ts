import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export type OnError = (err: AxiosError) => void

export interface RpcOptions {
  params?: any
  config?: AxiosRequestConfig
  onError?: OnError
  cancelId?: any
}

export type Middleware = (
  config: AxiosRequestConfig,
) => Promise<AxiosRequestConfig> | AxiosRequestConfig

export type Rpc = <T>(options?: RpcOptions) => Promise<AxiosResponse<T>>

export type CreateApi = <T extends Record<string, string>>(val: T) => Record<keyof T, Rpc>

export interface Request extends AxiosInstance {
  createApi: CreateApi
}

export interface Pagination {
  size: number
  num: number
  total: number
  hasNextPage?: boolean
  hasPrePage?: boolean
}

export interface InvalidFields {
  field: string
  error: string
}

export interface ResponseError {
  code: string
  message: string
  invalid_fields?: InvalidFields[]
}

export enum NoErrorResponseCode {
  Success = 200,
}

export const NeedLoginCode = [401]
