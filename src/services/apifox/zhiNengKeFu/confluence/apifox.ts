/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable vue/no-irregular-whitespace */
/* eslint-disable sort-imports */
import qs from 'qs'
import type { AxiosRequestConfig } from 'axios'
import http from '../../../http'
import {
    GetFrontConfluenceAccountQuery,
    GetFrontConfluenceAccountRes,
    PostFrontConfluenceAccountAddQuery,
    PostFrontConfluenceAccountAddRes,
} from './interface'

/** 获取Confluence账号 */
export function GetFrontConfluenceAccount(
    params: GetFrontConfluenceAccountQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontConfluenceAccountRes> {
    return http.get('/front/confluence/account', {
        params,
        ...axiosConfig,
    })
}

/** 添加Confluence账号 */
export function PostFrontConfluenceAccountAdd(
    params: PostFrontConfluenceAccountAddQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<PostFrontConfluenceAccountAddRes> {
    return http.post(`/front/confluence/account/add?${qs.stringify(params)}`, {
        params,
        ...axiosConfig,
    })
}
