<script setup lang="ts" name="menus">
import { ProgressInfo } from 'electron-updater'
// import { isMac } from '@/utils/help'
import prodBuildInfo from '../../../electron-builder.prod.json'
import testBuildInfo from '../../../electron-builder.test.json'
import router from '~/router'
import { PostAuthLogout } from '@/services/apifox/tongYong/renZheng/apifox'
const appVersion = ref('')
const menus = ref([
  {
    label: '数字助理',
    submenu: [
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
    ],
  },
])

const progressDialogVisible = ref(false)
const progressPercentage = ref(0)
onMounted(() => {
  window.electronAPI.onUpdateAvailable(() => {
    progressDialogVisible.value = true
  })
  window.electronAPI.onDownloadProgress((progress: ProgressInfo) => {
    if (progress.transferred > 0) {
      progressDialogVisible.value = true
    }
    progressPercentage.value = Math.ceil(progress.transferred / progress.total * 100)
  })
  window.electronAPI.onUpdateDownloaded(() => {
    progressDialogVisible.value = false
    progressPercentage.value = 0
  })
  window.electronAPI.onAppVersion((version) => {
    console.log('appVersion', version)
    appVersion.value = version
  })
})
</script>

<template>
  <div class="Menus">
    <el-dropdown v-for="menu in menus" :key="menu.label" size="small">
      <span class="menu-item-text el-dropdown-link">
        {{ menu.label }}
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in menu.submenu" :key="item.label" :disabled="item?.disabled" @click="item?.click">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <el-dialog
    v-model="progressDialogVisible"
    title="下载进度"
    width="80%"
    align-center
    :close-on-click-modal="false"
  >
    <div>
      <el-progress
        :percentage="progressPercentage"
        :stroke-width="15"
        :text-inside="true"
        status="success"
        striped
        striped-flow
        :duration="10"
      />
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.Menus {
  width: 100%;
  position: fixed;
  top: 34px;
  .menu-item-text {
    line-height: 24px;
    padding: 0 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #f5f5f5;
    }
    &:active {
      background-color: #e6e6e6;
      border: none;
    }
  }
}
</style>
