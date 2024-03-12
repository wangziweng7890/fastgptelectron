<script setup lang="ts">
import Submenu from './Submenu.vue'
// import { menusData } from '@/constants/menusData.ts'
import { useMenusStore } from '@/store/modules/menus.ts'
// import useUserStore from '@/store/modules/user'

defineProps({
  collapse: {
    type: Boolean,
    default: false,
  },
})

const menusStore = useMenusStore()
const route = useRoute()
/**
 * 导航栏高亮
 * eg:
 *  导航栏
 *  <el-menu-item index="/a">
 *  <el-menu-item index="/b">
 *  <el-menu-item index="/c">
 *  当前url: /a/b/c
 *  高亮：el-menu-item中index='/a'
 */

// 扁平化菜单数据
const flattenTree = (tree) => {
  return tree.reduce((flatArray, node) => {
    const { children, ...newItem } = node;
    +newItem.is_show && flatArray.push(newItem) // 将当前节点添加到flatArray中
    if (Array.isArray(children)) {
      // 如果当前节点有子节点，则递归调用flattenTree函数
      flatArray = flatArray.concat(flattenTree(children))
    }
    return flatArray
  }, [])
}

const activeMenu = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  // 取出扁平化之后的树状菜单数据
  const flattenMenus = flattenTree(menusStore.$state?.menuData || [])
  //   const flattenMenus = [
  //     { path: '/template', pid: 1 },
  //   ]
  // 匹配当前路由在菜单中以菜单path开头的选项，并按照pid倒叙
  const pathFilter = flattenMenus
    .filter(item => path.toLowerCase().startsWith(item.path.toLowerCase()))
    .sort((a, b) => b.pid - a.pid)
  if (pathFilter.length) {
    return pathFilter[0].path
  }
  return path
})
</script>

<template>
  <el-scrollbar class="scroll">
    <el-menu
      class="menu"
      mode="vertical"
      :unique-opened="true"
      :default-active="activeMenu"
      :router="true"
      :collapse="collapse"
      popper-effect="light"
    >
      <Submenu
        v-for="menu of menusStore.$state?.menuData"
        :key="menu.path"
        :menu="menu"
      />
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.scroll {
  height: auto;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  .menu {
    border: none;
  }
}
</style>
