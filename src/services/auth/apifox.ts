import type { AxiosRequestConfig } from 'axios'
import http from '../http'

import {
    GetWikiRestApiSearchQuery,
    GetWikiRestApiSearchRes,
    PostSmartWritingWenquWhaleSaveRecommendationHistoryRes
} from './interface'


/** 第三方登录请求 */
export function AuthBinding(
    params: GetWikiRestApiSearchQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetWikiRestApiSearchRes> {
    return http.get(`/auth/binding/${params}`, {
        params,
        ...axiosConfig,
    })
}

/** 登录 */
export function AuthLogin(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<PostSmartWritingWenquWhaleSaveRecommendationHistoryRes> {
    return http.post(
        '/auth/login',
        params,
        axiosConfig,
    )
}
