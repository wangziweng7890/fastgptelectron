<route>
  {
    meta: {
      title: "模版",
      constant: false,
      layout: 'blank'
    }
  }
</route>

<script setup lang="ts" name="tempalte">
const setPageTitle = () => {
  window.electronAPI.setTitle('手动设置的标题')
}
const filePath = ref('')
const openFile = async () => {
  const selectedFilePath = await window.electronAPI.openFile()
  filePath.value = selectedFilePath
}
</script>

<template>
  <div>
    模版页4
    <ul>
      <li>
        <router-link to="/">
          链接跳转home页
        </router-link>
      </li>
    </ul>
    <div>
      <p>文件路径：{{ filePath }}</p>
    </div>
    <div>
      <el-button @click="setPageTitle">
        设置标题
      </el-button>
      <el-button @click="openFile">
        打开文件
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tempalte-content {
  width: 100%;
  height: 100%;
}
</style>
