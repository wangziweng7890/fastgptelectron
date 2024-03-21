/* eslint-disable sort-imports */
import qs from 'qs'
import type { AxiosRequestConfig } from 'axios'
import http from '../http'

import {
  GetWikiRestApiSearchQuery,
  GetWikiRestApiSearchRes,
  GetDoLoginQuery,
  GetDoLoginRes
} from './interface'

/** 根据关键字搜索所有内容 */
export function GetWikiRestApiSearch(
  params: GetWikiRestApiSearchQuery,
  axiosConfig: AxiosRequestConfig = {},
): Promise<GetWikiRestApiSearchRes> {
  return http.get(`http://kf-wiki.galaxy-immi.com/rest/api/search?${qs.stringify(params)}`, axiosConfig)
}

export function PostDoLogin(
  params: GetDoLoginQuery,
  axiosConfig: AxiosRequestConfig = {},
): Promise<GetDoLoginRes> {
  return http.post(`http://kf-wiki.galaxy-immi.com/dologin.action`, qs.stringify(params), {
    ...axiosConfig,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    }
  })
}
