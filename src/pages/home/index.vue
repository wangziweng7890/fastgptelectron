<!--
 * @FilePath: /vue3-admin-template/src/pages/template/index.vue
 * @Description: 工作台首页
-->
<route>
  {
    meta: {
      title: "首页",
      constant: false,
      layout: 'blank'
    }
  }
</route>

<script setup lang="ts" name="tempalte">
// const versions = versions || {}
console.log('versions', window.electronAPI.chromeVersion())
// console.log('ping()', window.electronAPI.ping())
const testAsync = async () => {
  console.log('testAsync', await window.electronAPI.ping())
}
testAsync()
const versionInfo = `本应用正在使用 Chrome (v${window.electronAPI.chromeVersion()}), Node.js (v${window.electronAPI.nodeVersion()}), 和 Electron (v${window.electronAPI.electronVersion()})`
// const versionInfo = 'version info'
// console.log('process.env.VITE_DEV_SERVER_URL', process.env.VITE_DEV_SERVER_URL)
</script>

<template>
  <div style="color: red;">
    首页7 version 1
    <ul>
      <li>
        <a href="">
          <router-link to="/template">
            链接跳转template页
          </router-link>
        </a>
      </li>
    </ul>
    <p>
      {{ versionInfo }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.tempalte-content {
  width: 100%;
  height: 90%;
}
</style>
