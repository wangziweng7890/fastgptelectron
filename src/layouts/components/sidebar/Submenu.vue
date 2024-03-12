<script setup lang="ts" name="Submenu">
const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
})
const onlyOneChild = computed(() => {
  let _res = null
  let showingChildren = []
  if (props.menu.children) {
    showingChildren = props.menu.children.filter((item) => {
      if (!item.is_show) {
        return false
      }
      else {
        _res = item
        return true
      }
    })
  }
  if (showingChildren.length === 1) {
    return _res
  }
  if (showingChildren.length === 0) {
    return {
      ...props.menu,
    }
  }
})
</script>

<template>
  <div v-if="menu.is_show && menu.isGroupMenu">
    <template v-if="onlyOneChild && !menu.show_parent">
      <el-menu-item v-if="onlyOneChild.meta" :index="onlyOneChild.path">
        <el-icon v-if="onlyOneChild.meta.icon">
          <i class="iconfont" :class="[onlyOneChild.meta.icon]" />
        </el-icon>
        <template #title>
          <!-- <router-link :to="onlyOneChild.path">
                        <span>{{ onlyOneChild.name }}</span>
                    </router-link> -->
          <span>{{ onlyOneChild.name }}</span>
        </template>
      </el-menu-item>
    </template>
    <el-sub-menu v-else :index="menu.path">
      <template #title>
        <el-icon v-if="menu.meta.icon">
          <i class="iconfont" :class="[menu.meta.icon]" />
        </el-icon>
        <span>{{ menu.name }}</span>
      </template>
      <submenu
        v-for="submenu in menu.children"
        :key="submenu.path"
        :is-nest="true"
        :menu="submenu"
      />
    </el-sub-menu>
  </div>
</template>
