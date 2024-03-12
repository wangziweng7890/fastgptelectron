<!--
 * @FilePath: /vue3-admin-template/src/layouts/components/User.vue
 * @Description:
-->
<script setup lang="ts">
import useUserStore from '@/store/modules/user'
// const { proxy }: any = getCurrentInstance()

const userStore = useUserStore()
const router = useRouter()
// 用户下拉选项切换
function userCommand(command) {
  const handler = {
    logout: () => {
      userStore.logout().then(() => {
        // proxy.$SA.logout()
        router.push({
          name: 'login',
        })
      })
    },
  }
  Object.keys(handler).includes(command) && handler[command]()
}
</script>

<template>
  <div class="user-head">
    <el-dropdown class="user-container" size="default" trigger="click" @command="userCommand">
      <div class="user-wrapper">
        <div class="avatar">
          <i class="iconfont icon-icon_avatar" />
        </div>
        <div class="user-name">
          {{ userStore.account.name }}
        </div>
        <div class="down">
          <i class="iconfont icon-nav_down" />
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="user-dropdown">
          <el-dropdown-item command="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.user-head {
  min-width: 174px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 20px;
  padding-left: 24px;

  :deep(.el-dropdown) {
    color: $hk-main-text-color;
    font-weight: 500;
    font-size: 14px;
  }

  .user-wrapper {
    display: flex;
    line-height: 24px;

    .avatar {
      width: 24px;
      height: 24px;
      text-align: center;
      border-radius: 12px;
      overflow: hidden;
      background-color: rgb(20 83 255 / 8%);

      i {
        color: $hk-main-color;
        font-size: 14px;
      }
    }

    .user-name {
      margin: 0 16px 0 8px;
      font-size: 14px;
      color: #0b1d30;
    }

    .down {
      i {
        font-size: 12px;
        color: $hk-main-text-color;
      }
    }
  }
}
</style>
