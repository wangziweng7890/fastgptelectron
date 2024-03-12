<script setup lang="ts">
// 检查是否有发布更新
import Axios from 'axios'

interface AppContentMap {
    app: string
    content: string
}
const appNeedUpdate = [{
  entry: '/index.html',
  name: 'dwp',
}]
function getHtmlContent() {
  return Promise.all(appNeedUpdate.map((item) => {
    const url = item.entry.includes('http') ? item.entry : `${location.origin}${item.entry}`
    return Axios.get(url).then((res) => {
      return {
        app: item.name,
        content: res.data,
      }
    })
  }))
}
let htmlContentMap: AppContentMap[]
const hasUpdate = ref(false)
onMounted(async () => {
  if (import.meta.env.VITE_APP_ENV === 'dev') {
    return
  }
  htmlContentMap = await getHtmlContent()
  const timer = setInterval(async () => {
    const newHtmlContentMap = await getHtmlContent()
    hasUpdate.value = htmlContentMap.some((item) => {
      const newContent = newHtmlContentMap?.find(newItem => newItem.app === item.app)?.content
      if (item.content !== newContent && ![newContent, item.content].includes('')) {
        return true
      }
      return false
    })
    hasUpdate.value && clearInterval(timer)
  }, 30 * 1000)
})
</script>

<template>
  <el-alert v-if="hasUpdate" title="系统有更新，请保存好数据后刷新页面" show-icon center type="warning" class="h-40px" />
</template>
