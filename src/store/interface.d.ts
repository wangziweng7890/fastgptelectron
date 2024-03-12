/*
 * @FilePath: /vue3-admin-template/src/store/interface.d.ts
 * @Description:
 */
interface IMenus {
  id: number
  is_show: 0 | 1
  meta: {
    title: string
    icon: string
  }
  name: string
  path: string
  pid: number
  show_parent: 0 | 1
  sort: number
  children?: IMenus[]
  isGroupMenu?: 0 | 1
}

interface IUserState<T> {
  account: {
    [key: string]: any
  }
  token: string
  failure_time: number
  menus: Expand<IMenus>[]
  menuGroups: T[]
  currentGroupId: number
  buttons: {
    [key: string]: string[]
  }
  user: {
    account: {
      id: number
    }
  }
}
