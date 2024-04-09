<script setup lang="ts" name="headbar">
import { Aim, Close, FullScreen, Minus, Setting } from '@element-plus/icons-vue'
import prodBuildInfo from '../../../electron-builder.prod.json'
import testBuildInfo from '../../../electron-builder.test.json'
import useUserSetting from '@/store/modules/settings'
import router from '~/router'
import { PostAuthLogout } from '@/services/apifox/tongYong/renZheng/apifox'

const userSettingStore = useUserSetting()

const onMini = () => {
  console.log('点击了最小化')
  window.electronAPI.minimize()
}
const onClose = () => {
  console.log('点击了关闭')
  window.electronAPI.close()
}
const onAffixWindow = async () => {
  userSettingStore.setIsAffixedWindow(!userSettingStore.isAffixedWindow)
  console.log('点击了锁定', userSettingStore.isAffixedWindow)
  await window.electronAPI.affixWindow(userSettingStore.isAffixedWindow)
}

const onFullScreen = () => {
  userSettingStore.setIsFullScreen(!userSettingStore.isFullScreen)
  console.log('点击了全屏', userSettingStore.isFullScreen)
  window.electronAPI.setIsFullScreen(userSettingStore.isFullScreen)
}

const submenu = [
  {
    click: () => {
      console.log('刷新')
      if (import.meta.env.VITE_APP_ENV === 'dev') {
        window.location.reload()
      }
      else {
        window.electronAPI.refresh()
      }
    },
    label: '刷新',
  },
  {
    label: `当前版本：V${import.meta.env.VITE_APP_ENV === 'production' ? prodBuildInfo?.extraMetadata?.version : testBuildInfo?.extraMetadata?.version}`,
    disabled: true,
  },
  {
    click: () => {
      console.log('点击了检查版本更新')
      window.electronAPI.checkUpdate()
    },
    label: '检查版本更新',
    // disabled: isMac,
  },
  {
    click: async () => {
      await PostAuthLogout()
      localStorage.clear()
      router.push({
        path: '/login',
      })
    },
    label: '切换账号',
  },
  {
    click: async () => {
      await PostAuthLogout()
      localStorage.clear()
      window.electronAPI.exit()
    },
    label: '退出',
  },
]
</script>

<template>
  <div class="HeadBar">
    <div class="w-230px pl-16px no-region">
      <slot />
    </div>
    <div class="title">
      {{ userSettingStore.app.title }}
    </div>
    <div class="btns w-230px v-middle">
      <el-space :size="0">
        <el-dropdown size="small">
          <span class="menu-item-text el-dropdown-link">
            <el-icon class="mr-14px" size="16">
              <Setting />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in submenu" :key="item.label" :disabled="item?.disabled" @click="item?.click">
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
      <el-space :size="0">
        <el-icon v-if="userSettingStore.isAffixedWindow" @click="onAffixWindow">
          <img class="png-icon" src="~@/assets/images/affix.png" alt="">
        </el-icon>
        <el-icon v-else @click="onAffixWindow">
          <img class="png-icon" src="~@/assets/images/unAffix.png" alt="">
        </el-icon>
        <el-icon @click="onMini">
          <Minus />
        </el-icon>
        <el-icon v-if="!userSettingStore.isFullScreen" @click="onFullScreen">
          <FullScreen />
        </el-icon>
        <el-icon v-else>
          <Aim @click="onFullScreen" />
        </el-icon>
        <el-icon @click="onClose">
          <Close />
        </el-icon>
      </el-space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.HeadBar {
  width: 100%;
  position: fixed;
  top: 0;
  height: 56px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  .no-region {
    -webkit-app-region: none;
  }
  .title {
    font-weight: 500;
    font-size: 16px;
    color: #0F1214;
  }
  .btns {
    -webkit-app-region: no-drag;
    text-align: right;

    :deep(.el-space__item) {
      align-items: stretch;
      cursor: pointer;
      &:hover {
        // background: #e4e7e9;
      }
      & .el-icon {
        height: 34px;
        width: 34px;
        color: #999;
      }
    }
    & .png-icon {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
