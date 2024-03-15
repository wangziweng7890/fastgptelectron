export interface GetFrontAppGetQuery {
    /**  example: undefined */
    appId: string
}

export type GetFrontAppGetRes = any

export interface GetFrontAppIntimacyQuery {
    /**  example: undefined */
    appId: string
}

export type GetFrontAppIntimacyRes = any

export interface GetFrontChatCompletionsListQuery {
    /**  example: undefined */
    chatId: string
}

export type GetFrontChatCompletionsListRes = any

export interface GetFrontChatCompletionsDeleteQuery {
    /** 消息id example: undefined */
    id: string
}

export type GetFrontChatCompletionsDeleteRes = any

export interface PostFrontChatstepStepQuery {
    /** 消息ID example: undefined */
    chatDetailId: string
    /** 类型 1:赞  2：踩  3: 复制 example: undefined */
    type: number
    /** 踩的原因 example: undefined */
    reason: string
}

export type PostFrontChatstepStepReq = any

export type PostFrontChatstepStepRes = any

export interface GetFrontChatstepStepcancelQuery {
    /**  example: undefined */
    chatDetailId: string
}

export type GetFrontChatstepStepcancelRes = any

export interface PostFrontChatstepStepcancelQuery {
    /**  example: undefined */
    chatDetailId: string
}

export type PostFrontChatstepStepcancelReq = any

export type PostFrontChatstepStepcancelRes = any

export interface GetFrontChatstepStepQuery {
    /** 消息ID example: undefined */
    chatDetailId: string
    /** 类型 1:赞  2：踩  3: 复制 example: undefined */
    type: number
    /** 踩的原因 example: undefined */
    reason: string
}

export type GetFrontChatstepStepRes = any

export interface GetFrontChatCompletionsHistoryQuery {
    /**  example: undefined */
    appId: string
    /** 起始页 example: undefined */
    pageNumber: number
    /** 每页数量  默认为10 example: undefined */
    pageSize: number
}

export type GetFrontChatCompletionsHistoryRes = any

export interface GetFrontChatCompletionsDeleteByChatIdQuery {
    /**  example: undefined */
    chatId: string
}

export type GetFrontChatCompletionsDeleteByChatIdRes = any
