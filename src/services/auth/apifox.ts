import type { AxiosRequestConfig } from 'axios'
import http from '../http'

import {
    AuthBindingQuery,
    AuthBindingRes,
    AuthLoginRes
} from './interface'


/** 第三方登录请求 */
export function AuthBinding(
    params: AuthBindingQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<AuthBindingRes> {
    return http.get(`/auth/binding/${params}`, {
        params,
        ...axiosConfig,
    })
}

/** 登录 */
export function AuthLogin(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<AuthLoginRes> {
    return http.post(
        '/auth/login',
        params,
        axiosConfig,
    )
}
