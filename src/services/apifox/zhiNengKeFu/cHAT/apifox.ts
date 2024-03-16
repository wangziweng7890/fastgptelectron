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
    GetFrontAppGetQuery,
    GetFrontAppGetRes,
    GetFrontAppIntimacyQuery,
    GetFrontAppIntimacyRes,
    GetFrontChatCompletionsListQuery,
    GetFrontChatCompletionsListRes,
    GetFrontChatCompletionsDeleteQuery,
    GetFrontChatCompletionsDeleteRes,
    GetFrontChatstepStepQuery,
    GetFrontChatstepStepRes,
    GetFrontChatstepStepcancelQuery,
    GetFrontChatstepStepcancelRes,
    GetFrontChatCompletionsHistoryQuery,
    GetFrontChatCompletionsHistoryRes,
    GetFrontChatCompletionsDeleteByChatIdQuery,
    GetFrontChatCompletionsDeleteByChatIdRes,
    PostFrontChatstepStepQuery,
    PostFrontChatstepStepReq,
    PostFrontChatstepStepRes,
} from './interface'

/** axios 根据appId获取机器人信息 */
export function GetFrontAppGet(
    params: GetFrontAppGetQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontAppGetRes> {
    return http.get('/front/app/get', {
        params,
        ...axiosConfig,
    })
}

/** axios 获取亲密度 */
export function GetFrontAppIntimacy(
    params: GetFrontAppIntimacyQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontAppIntimacyRes> {
    return http.get('/front/app/intimacy', {
        params,
        ...axiosConfig,
    })
}

/** axios 对话查询--根据chatId查询 */
export function GetFrontChatCompletionsList(
    params: GetFrontChatCompletionsListQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontChatCompletionsListRes> {
    return http.get('/front/chat/completions/list', {
        params,
        ...axiosConfig,
    })
}

/** axios 删除一次聊天消息 */
export function GetFrontChatCompletionsDelete(
    params: GetFrontChatCompletionsDeleteQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontChatCompletionsDeleteRes> {
    return http.get('/front/chat/completions/delete', {
        params,
        ...axiosConfig,
    })
}

/** axios 点赞(点踩)-取消 */
export function GetFrontChatstepStepcancel(
    params: GetFrontChatstepStepcancelQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontChatstepStepcancelRes> {
    return http.get('/front/chatstep/stepcancel', {
        params,
        ...axiosConfig,
    })
}

/** axios 查询地址 */
export function GetFrontChatCompletionsHistory(
    params: GetFrontChatCompletionsHistoryQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontChatCompletionsHistoryRes> {
    return http.get('/front/chat/completions/history', {
        params,
        ...axiosConfig,
    })
}

/** axios 删除多轮根据chatId聊天消息 */
export function GetFrontChatCompletionsDeleteByChatId(
    params: GetFrontChatCompletionsDeleteByChatIdQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetFrontChatCompletionsDeleteByChatIdRes> {
    return http.get('/front/chat/completions/deleteByChatId', {
        params,
        ...axiosConfig,
    })
}

/** axios 点赞(踩) */
export function PostFrontChatstepStep(
    params: any = {},
    axiosConfig: AxiosRequestConfig = {},
): Promise<PostFrontChatstepStepRes> {
    return http.post('/front/chatstep/step', params, axiosConfig)
}
