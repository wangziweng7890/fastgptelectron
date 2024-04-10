export interface PostFrontConfluenceAccountModifyQuery {
    /**  example: undefined */
    username: string
    /**  example: undefined */
    password: string
}

export type PostFrontConfluenceAccountModifyReq = any

export type PostFrontConfluenceAccountModifyRes = any

export interface PostFrontConfluenceAccountAddQuery {
    /** confluence的帐号 example: undefined */
    username: string
    /** confluence的密码(前端加密传输) example: undefined */
    password: string
}

export type PostFrontConfluenceAccountAddReq = any

export type PostFrontConfluenceAccountAddRes = any

export type GetFrontConfluenceAccountRes = any

export type GetFrontConfluenceGetUserSearchHistoryRes = any

export type GetFrontConfluenceGetHotSearchRes = any

export interface PostFrontConfluenceSaveUserSearchHistoryQuery {
    /**  example: undefined */
    searchKey: string
}

export type PostFrontConfluenceSaveUserSearchHistoryReq = any

export type PostFrontConfluenceSaveUserSearchHistoryRes = any

export interface DeleteFrontConfluenceRemoveUserSearchHistoryQuery {
    /**  example: undefined */
    searchKey: string
}

export type DeleteFrontConfluenceRemoveUserSearchHistoryReq = any

export type DeleteFrontConfluenceRemoveUserSearchHistoryRes = any
