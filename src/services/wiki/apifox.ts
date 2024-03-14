/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable vue/no-irregular-whitespace */
/* eslint-disable sort-imports */
import qs from 'qs'
import type { IConfig } from '@galaxy/swrv'
import type { AxiosRequestConfig } from 'axios'
import { createRequest } from '../http'

let http
const createHttp = (config: AxiosRequestConfig = {}) => {
    http = createRequest(config)
}

import { useMutation, useSWRGet } from '../swrv'
import {
    GetWikiRestApiSearchQuery,
    GetWikiContentByIdQuery,
    GetWikiRestApiSearchRes,
    GetWikiContentByIdRes
} from './interface'


export const useGetTodoCenterCusFollowTodoList = (params: GetWikiRestApiSearchQuery | Ref<GetWikiRestApiSearchQuery>, swrvConfig: IConfig = {}) => {
    const computedParams = computed(() => qs.stringify(unref(params)))
    return useSWRGet<GetWikiRestApiSearchRes>(() => computedParams.value && `/wiki/rest/api/search?${computedParams.value}`, swrvConfig)
}

/** 根据关键字搜索所有内容 */
export function GetWikiRestApiSearch(
    params: GetWikiRestApiSearchQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetWikiRestApiSearchRes> {
    createHttp(axiosConfig)
    return http.get('/wiki/rest/api/search', {
        params,
        ...axiosConfig,
    })
}

/** 根据关键字搜索所有内容 */
export function GetWikiContentById(
    params: GetWikiContentByIdQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetWikiContentByIdRes> {
    return http.get(`/wiki/rest/api/content/${params}`, {
        params,
        ...axiosConfig,
    })
}


export function GetWikiSpaceAuth(
    params: GetWikiContentByIdQuery,
    axiosConfig: AxiosRequestConfig = {},
): Promise<GetWikiContentByIdRes> {
    createHttp(axiosConfig)
    return http.get(`/wiki/rest/api/space`, {
        params,
        ...axiosConfig,
    })
}
