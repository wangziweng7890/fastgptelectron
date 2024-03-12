import { defineClientConfig } from '@vuepress/client';
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

import '@unocss/reset/tailwind.css'

import '@/styles/index.scss'
// import 'uno.css'
import '@/assets/icon/iconfont.css'

// 创建pinia实例
const pinia = createPinia()
// 使用pinia插件
pinia.use(persist)

export default defineClientConfig({
  enhance({ app }) {
    // 注册组件
    app.use(pinia)
  }
});
