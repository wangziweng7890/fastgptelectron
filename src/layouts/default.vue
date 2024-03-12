<!--
 * @FilePath: /Document-System/src/layouts/default.vue
 * @Description: 通用包裹页面
-->
<script setup lang="ts" name="layout">
import Head from './components/Head.vue'
import Menus from './components/sidebar/Menus.vue'
const collapse = ref<boolean>(false)
const route = useRoute()
// 路由白名单，在次名单中的路由的RouterView组件会被添加key
const whitePath = ['/allDocument/autoGenerate']
function changeCollapse() {
  collapse.value = !collapse.value
}
</script>

<template>
  <el-scrollbar max-height="100vh">
    <main class="main">
      <Head :collapse="collapse" />
      <div class="flex-1 flex flex-col overflow-hidden">
        <UpdateTips />
        <div class="content flex-1">
          <div class="menu-nav" :class="collapse ? 'collapse-close' : 'collapse'">
            <Menus class="menu" :collapse="collapse" />
            <div class="toggle-slider" @click="changeCollapse">
              <i
                class="iconfont"
                :class="
                  collapse ? 'icon-icon_open1' : 'icon-icon_fold1'
                "
              />
            </div>
          </div>
          <RouterView v-if="whitePath.includes(route.path)" :key="route.fullPath" class="view" />
          <RouterView v-else class="view" />
        </div>
      </div>
    </main>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.main {
  width: 100vw;
  min-width: 1520px;
  overflow: hidden;
  height: 100vh;
  display: flex;
  flex-flow: column;
  background-color: #f2f6fa;

  .content {
    width: 100%;
    flex: 1;
    display: flex;
    overflow: hidden;

    .menu-nav {
      display: flex;
      flex-flow: column;
      background: #fff;
      transition: all ease-in-out 200ms;
      overflow: hidden;
      position: relative;
      z-index: 3;

      .menu {
        width: 100%;
        flex: 1;
        overflow-y: auto;
        border: none;
        :deep(.el-sub-menu__title),
        :deep(.el-menu-item) {
          height: var(--menu-item-height);
          line-height: var(--menu-item-height);
          margin: 6px 0;
          i.iconfont {
            color: #909399;
            font-size: 24px;
          }
          &.is-active {
            i.iconfont {
              color: inherit;
            }
          }
          & > a,
          & > span {
            color: #909399;
          }
          &:hover {
            background-color: var(--el-menu-hover-bg-color);
            i.iconfont,
            & > a,
            & > span {
              color: var(--el-menu-text-color);
            }
          }
        }
        :deep(.is-active) {
          color: var(--active-color);
          background-color: rgba(20 83 255 / 5%);
          & > a,
          & > span {
            color: var(--active-color);
          }
          &::after {
            content: "";
            width: 4px;
            height: 40px;
            position: absolute;
            top: 0;
            right: 0;
            background-color: $hk-compel-color4;
          }
          .el-sub-menu__title {
            i,
            span {
              color: var(--el-menu-text-color);
            }
          }
        }

        :deep(.is-active[aria-expanded="false"]) {
          color: var(--active-color);
          background-color: rgba(20 83 255 / 5%);
          position: relative;
          &::after {
            content: "";
            width: 4px;
            height: 40px;
            position: absolute;
            top: 0;
            right: 0;
            background-color: $hk-compel-color4;
          }
        }

        :deep(.is-opened) {
          color: var(--active-color);
          background-color: #fff;

          &::after {
            content: "";
            height: 0;
          }
        }
        :deep(.el-menu.el-menu--inline .el-menu-item),
        :deep(.el-menu.el-menu--inline .el-sub-menu__title) {
          padding-left: calc(30px + var(--el-menu-level) * var(--el-menu-level-padding));
        }
        :deep(.el-menu--collapse) {
          width: 56px;
          overflow-x: hidden;
        }
        :deep(.el-tooltip__trigger) {
          width: 56px;
          overflow-x: hidden;
          & > span {
            display: none;
          }
          .el-sub-menu__icon-arrow {
            display: none;
          }
        }

        .el-icon {
          .iconfont {
            font-size: 22px;
            line-height: 40px;
          }
        }
      }

      .toggle-slider {
        height: 40px;
        margin: 12px 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        background-color: #fff;
        cursor: pointer;
        padding-right: $hk-base-space1;

        .iconfont {
          font-size: 20px;
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgb(20 18 34 / 4%);
          border-radius: 8px;
          color: rgb(20 18 34 / 40%);
        }

        &:hover {
          .iconfont {
            color: $hk-compel-color4;
          }
        }
      }
    }

    .collapse {
      width: 180px;
    }

    .collapse-close {
      width: 56px;
    }

    .view {
      overflow: hidden;
    }
  }
}

.link {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.view {
  flex: 1;
}
</style>

<style lang="scss">
.el-menu--popup-container {
  li.el-menu-item {
    height: var(--menu-item-height);
  }
}
</style>

