<script setup lang="ts" name="menus">
import { ProgressInfo } from 'electron-updater'
// import { isMac } from '@/utils/help'

const appVersion = ref('')

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
</style>
