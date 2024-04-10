/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable vue/no-irregular-whitespace */
/* eslint-disable sort-imports */
import qs from 'qs'
import type { IConfig } from '@galaxy/swrv'
import type { AxiosRequestConfig } from 'axios'
import http from '../../../http'
import { useMutation, useSWRGet } from '../../../swrv'
import {
    PostFrontConfluenceAccountModifyQuery,
    PostFrontConfluenceAccountModifyReq,
    PostFrontConfluenceAccountModifyRes,
    PostFrontConfluenceAccountAddQuery,
    PostFrontConfluenceAccountAddReq,
    PostFrontConfluenceAccountAddRes,
    GetFrontConfluenceAccountRes,
    GetFrontConfluenceGetUserSearchHistoryRes,
    GetFrontConfluenceGetHotSearchRes,
    PostFrontConfluenceSaveUserSearchHistoryQuery,
    PostFrontConfluenceSaveUserSearchHistoryReq,
    PostFrontConfluenceSaveUserSearchHistoryRes,
    DeleteFrontConfluenceRemoveUserSearchHistoryQuery,
    DeleteFrontConfluenceRemoveUserSearchHistoryReq,
    DeleteFrontConfluenceRemoveUserSearchHistoryRes,
} from './interface'

/** axios 修改confluence帐号 */
export function PostFrontConfluenceAccountModify(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<PostFrontConfluenceAccountModifyRes> {
    return http.post('/front/confluence/account/modify', params, axiosConfig)
}

/** axios 增加confluence帐号 */
export function PostFrontConfluenceAccountAdd(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<PostFrontConfluenceAccountAddRes> {
    return http.post('/front/confluence/account/add', params, axiosConfig)
}

/** axios 获取当前用户的confluence帐号 */
export function GetFrontConfluenceAccount(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontConfluenceAccountRes> {
    return http.get('/front/confluence/account', {
        params,
        ...axiosConfig,
    })
}

/** axios 获取用户搜索历史记录 */
export function GetFrontConfluenceGetUserSearchHistory(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontConfluenceGetUserSearchHistoryRes> {
    return http.get('/front/confluence/getUserSearchHistory', {
        params,
        ...axiosConfig,
    })
}

/** axios 获取热搜 */
export function GetFrontConfluenceGetHotSearch(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontConfluenceGetHotSearchRes> {
    return http.get('/front/confluence/getHotSearch', {
        params,
        ...axiosConfig,
    })
}

/** axios 保存用户搜索的历史记录 */
export function PostFrontConfluenceSaveUserSearchHistory(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<PostFrontConfluenceSaveUserSearchHistoryRes> {
    return http.post(
        `/front/confluence/saveUserSearchHistory?${qs.stringify(params)}`,
        params,
        axiosConfig,
    )
}

/** axios 删除用户搜索的历史记录 */
export function DeleteFrontConfluenceRemoveUserSearchHistory(
    params: DeleteFrontConfluenceRemoveUserSearchHistoryQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<DeleteFrontConfluenceRemoveUserSearchHistoryRes> {
    return http.delete('/front/confluence/removeUserSearchHistory', {
        params,
        ...axiosConfig,
    })
}
