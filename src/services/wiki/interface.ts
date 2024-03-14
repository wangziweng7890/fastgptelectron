
export interface GetWikiRestApiSearchQuery {
    /** 主申人姓名  example:  */
    application_name?: string
    /** 合同号  example:  */
    order_sn?: string
    /** 订单号  example:  */
    order_id?: number
    /** 签约时间  example:  */
    sign_time?: string[]
    /** 服务专家  example:  */
    service_butler?: number
    /** 页码 example: 1 */
    page: number
    /** 一页条数 example: 20 */
    page_size: number
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
