
export interface GetWikiRestApiSearchQuery {
    /** 关键字  */
    cql: string
}
export interface GetWikiRestApiSearchRes {
    /** 搜索关键字  */
    cqlQuery: string
    /** 显示数据  */
    limit: number
    /** 数据  */
    results: string[]
    /** 搜索间隔  */
    searchDuration: number
    /** 当页数量  */
    size: number
    /** 数据索引  */
    start: number
    /** 总数量  */
    totalSize: number
}

export interface GetWikiContentByIdQuery {
    /** 内容id  */
    id: string
}

export interface GetWikiContentByIdRes {

}
