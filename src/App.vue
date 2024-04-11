<!--
 * @FilePath: /Document-System/src/App.vue
 * @Description:
-->
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Menus from '@/layouts/components/Menus.vue'
import useUserSetting from '@/store/modules/settings'
const userSettingStore = useUserSetting()

const router = useRouter()
if (!localStorage.getItem('access_token')) {
  router.push({
    path: '/login',
  })
}

import.meta.env.VITE_APP_ENV !== 'dev' && setInterval(async () => {
  const flag = await window.electronAPI.getIsFullScreen()
  //   console.log('窗口变化', flag)
  userSettingStore.setIsFullScreen(flag)
}, 300)
</script>

<template>
  <el-config-provider :locale="zhCn">
    <main class="h-100%">
      <Menus />
      <div class="container-all">
        <router-view />
      </div>
    </main>
  </el-config-provider>
</template>

<style lang="scss">
.el-dropdown__list {
  min-width: 96px;
  min-height: 48px;
}
.container-all {
  padding-top: 54px;
  height: 100vh;
}
html {
  height: 100%;

  body {
    height: 100%;

    #app-main {
      height: 100%;
    }
  }
}
</style>
