/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable vue/no-irregular-whitespace */
/* eslint-disable sort-imports */
import type { AxiosRequestConfig } from 'axios'
import http from '../../../http'
import { PostAuthLogoutReq, PostAuthLogoutRes } from './interface'

/** axios 退出登录 */
export function PostAuthLogout(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<PostAuthLogoutRes> {
    return http.post('/auth/logout', params, axiosConfig)
}
