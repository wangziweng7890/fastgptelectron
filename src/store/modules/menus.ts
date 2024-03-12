import { defineStore } from 'pinia'

export const useMenusStore = defineStore('menus', {
  state: () => {
    return {
      menuData: [],
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  actions: {
    updateMenus(menus) {
      this.menuData = [...menus]
    },
  },
})
