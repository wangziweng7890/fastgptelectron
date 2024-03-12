/*
 * @FilePath: /vue3-admin-template/src/main.ts
 * @Description:
 */
// import '@/mock/index'
import { createApp } from 'vue'
import { debounce } from 'lodash-es'
import App from './App.vue'
import router from './router'
import { initSentry } from '@/utils/sentry'

// tailwind 样式必须放在前面，否则会覆盖饿了么和组件库的样式
import '@unocss/reset/tailwind.css'
import 'element-plus/theme-chalk/src/index.scss'
import '@galaxy-fe/galaxy-ui/dist/es/style.css'
import './styles/index.scss'
// import 'uno.css'
import 'virtual:iconfont'
import directive from '@/directives/index'

const instance = createApp(App)

const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16)
    super(callback)
  }
}
instance.use(router)
const moduleType: any = Object.values(import.meta.globEager('./modules/*.ts'))
moduleType.forEach(i => i.install?.(instance))
directive(instance)

if (import.meta.env.VITE_APP_ENV === 'production') {
  initSentry(instance, router)
}

instance.mount('#app-main')

