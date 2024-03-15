/* eslint-disable sort-imports */
import qs from 'qs'
import type { AxiosRequestConfig } from 'axios'
import http from '../http'

import {
  GetWikiRestApiSearchQuery,
  GetWikiContentByIdQuery,
  GetWikiRestApiSearchRes,
  GetWikiContentByIdRes,
} from './interface'

/** 根据关键字搜索所有内容 */
export function GetWikiRestApiSearch(
  params: GetWikiRestApiSearchQuery,
  axiosConfig: AxiosRequestConfig = {},
): Promise<GetWikiRestApiSearchRes> {
  return http.get(`http://wiki.galaxy-immi.com/rest/api/search?${qs.stringify(params)}`, axiosConfig)
}

export function GetWikiSpaceAuth(
  params: GetWikiContentByIdQuery,
  axiosConfig: AxiosRequestConfig = {},
): Promise<GetWikiContentByIdRes> {
  return http.get(`http://wiki.galaxy-immi.com/rest/api/space?${qs.stringify(params)}`, axiosConfig)
}
