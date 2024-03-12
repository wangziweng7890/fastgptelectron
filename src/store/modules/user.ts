/*
 * @FilePath: /vue3-admin-template/src/store/modules/user.ts
 * @Description:
 */
// import { API, writingApi } from '~/services'
// import type { Menus } from '~/services/types/menus'
// import type { GetUcMenuGroupMenuGroupInfoResItem } from '@/services/apifox/yongHuZhongXin/caiDanFenZu/interface'

/**
 * 递归地根据提供的页面ID修改菜单项。
 *
 * @param {Expand<IMenus>[]} menu - 菜单项的数组。
 * @param {number[]} pageIds - 页面ID的数组。
 * @param {boolean} isAll - 可选。确定是否将修改应用于所有菜单项。
 * @return {Expand<IMenus>[]} 修改后的菜单项的数组。
 */
const menuRecursion = (menu: Expand<IMenus>[], pageIds: number[], isAll = false, parent: false | IMenus = false): Expand<IMenus>[] => {
  menu.map((item: Expand<IMenus>) => {
    item.isGroupMenu = isAll ? 1 : (pageIds.includes(item.id) ? 1 : 0)
    if (parent && item.isGroupMenu === 1) {
      parent.isGroupMenu = 1
    }
    if (item.children && item.children.length) {
      return menuRecursion(item.children, pageIds, isAll, item)
    }
    return item
  })
  return menu
}
const useUserStore = defineStore(
  'user',
  {
    state: (): Expand<IUserState<Expand<any>>> => ({
      // 用户名
      account: localStorage.user ? JSON.parse(localStorage.user) : {},
      //  token
      token: localStorage.token || '',
      // 故障时间
      failure_time: +localStorage.failure_time || 0,
      // 菜单
      menus: [],
      // 菜单分组
      menuGroups: [],
      currentGroupId: 0,
      // 按钮
      buttons: {},
      user: localStorage.user,
    }),
    // 依赖 类似computer计算属性
    getters: {
      isLogin: (state) => {
        let retn = false
        if (state.token) {
          if (new Date().getTime() < state.failure_time * 1000)
            retn = true
        }
        return retn
      },
      // TODO: menus拿到时带了最外层包裹，需要做下转换去掉最外层数据结构，同时将工作台顺序提前，此处为临时的权限菜单设计，后续产品更改也要配合修改
      // 暂时递归找到第三层的数据结构
      allMenus: ({ menus, currentGroupId, menuGroups }) => {
        const res: Expand<IMenus>[] = reactive([])
        menus.forEach((item) => {
          if (item.children && item.children.length) {
            item.children.forEach((val) => {
              res.push(val)
            })
          }
        })
        if (currentGroupId) {
          const currentGroups = menuGroups.find(item => item.id === currentGroupId)
          const newRes = menuRecursion(res, currentGroups?.pages_id || [])
          return newRes
        }
        const newRes = menuRecursion(res, [], true)
        console.log('newRes', newRes)
        return newRes
      },
    },
    actions: {
      updateCurrentGroupId(id: number) {
        this.currentGroupId = id
      },
      async login(data: any) {
        console.log('login: ', data)
        // const res: any = await API.login({
        //     params: data,
        // })
        // this.saveData(res.data)
      },
      /**
       * @description 获取用户菜单
      */
      async getUserNavMenu() {
        // const res: Partial<ApiResponse<Menus>> = await API.getCurrentUserNav()
        // this.buttons = res.data?.buttons || {}
        // let menus = res.data?.menus || []
        // if (!menus.length) {
        //     menus = [{
        //         id: 68,
        //         is_show: 1,
        //         meta: { title: '工作台', icon: '' },
        //         name: '工作台',
        //         path: '/workbench_top',
        //         pid: 49,
        //         sort: 100,
        //         children: [
        //             {
        //                 id: 51,
        //                 is_show: 1,
        //                 meta: { title: '工作台', icon: 'icon-sidebar_gongzuotai' },
        //                 name: '工作台',
        //                 path: '/workbench',
        //                 pid: 68,
        //                 sort: 100,
        //             },
        //         ],
        //     }]
        // }
        // this.menus = menus
        // await this.getMenuGroups()
        // console.log('this.menuGroups', this.menuGroups, this.menus)
      },
      /**
       * @description 退出登录
      */
      logout() {
        return new Promise((resolve) => {
          localStorage.removeItem('account')
          localStorage.removeItem('token')
          localStorage.removeItem('dwp-token')
          localStorage.removeItem('failure_time')
          // localStorage.clear()
          this.account = ''
          this.token = ''
          this.failure_time = ''
          this.menus = []
          resolve('')
        })
      },
      saveData({ crm_token, token, expired, user }) {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('dwp-token', token)
        localStorage.setItem('token', crm_token)
        localStorage.setItem('failure_time', expired)
        this.account = user
        this.token = token
        this.failure_time = expired
      },
    },
  },
)

export default useUserStore
