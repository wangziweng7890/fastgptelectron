<script setup lang="ts">
import Logo from './Logo.vue'
import User from './User.vue'
import { useMenusStore } from '@/store/modules/menus'

interface IProps {
  boardShow?: boolean // 顶部导航是否展示
  collapse?: boolean // 侧边栏是否收起
}

const props = defineProps<IProps>()
const menu = useMenusStore()
const defaultActiveIndex = '0'
const menuParams = ref({
  id: undefined,
})
const boardData = ref([])
const menuList = ref([])
// （模拟）获取看板列表数据
const getBoardData = async () => {
  const res = await fetch('/boardData.json')
  const jsonData = await res.json()
  return jsonData?.data
}
// （模拟）根据menuParams.id，获取左侧菜单数据
const getMenuData = async () => {
  const res = await fetch('/menuData.json')
  const jsonData = await res.json()
  return jsonData?.menus
}

const handleChange = async (id: number) => {
  menuParams.value.id = id
  await getMenuData()
  menu.updateMenus(menuList.value)
}

onMounted(async () => {
  boardData.value = await getBoardData()
  menuParams.value.id = boardData.value[0]?.id
  menuList.value = await getMenuData()
  menu.updateMenus(menuList.value)
})
</script>

<template>
  <div class="head" main-bg-1 main-text-2>
    <div :class="{ hide: props.collapse }">
      <Logo />
    </div>
    <div class="head-content">
      <div class="head-right">
        <User />
        <el-menu
          v-if="boardShow"
          :default-active="defaultActiveIndex"
          mode="horizontal"
          class="el-menu-horizontal"
          :ellipsis="false"
        >
          <el-menu-item v-for="(m, key) in boardData" :key="key" :index="String(key)" @click="() => handleChange(m?.id)">
            {{ m?.name }}
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.head {
  width: 100%;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $hk-compel-color10;
  :deep(.el-dropdown) {
    color: #fff;
  }
}
.head-content {
  flex: 1;
  display: flex;
  .page-name {
    text-indent: 20px;
    flex: 1;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 18px;
  }
  .head-right {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    padding: 0 55px;
    // justify-content: flex-end;
    .el-menu-horizontal {
      flex: 1;
    }
  }
}
:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: var(--el-dropdown-menuItem-hover-fill);
  color: var(--el-dropdown-menuItem-hover-color);
}
</style>
