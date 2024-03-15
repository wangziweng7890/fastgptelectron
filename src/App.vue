<!--
 * @FilePath: /Document-System/src/App.vue
 * @Description:
-->
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

window.addEventListener('unhandledrejection', (error) => {
  console.log('unhandledrejection:', error)
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <main class="h-100%">
      <router-view />
    </main>
  </el-config-provider>
</template>

<style lang="scss">
.el-dropdown__list {
  min-width: 96px;
  min-height: 48px;
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
