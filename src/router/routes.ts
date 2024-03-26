/*
 * @FilePath: /vue3-admin-template/src/router/routes.ts
 * @Description:
 */
import generatedRoutes from 'virtual:generated-pages'
import pinia from '@/store'
import useSettingsStore from '@/store/modules/settings'

// 固定路由（非文件路由）
const systemRoutes: any = [
  {
    path: '/',
    name: 'index',
    meta: {
      title: '首页',
    },
    redirect: '/chat',
    component: () => import('/src/layouts/blank.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/pages/chat/index.vue'),
    meta: {
      title: '银河数字助理',
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/pages/chat/index.vue'),
    meta: {
      title: '银河数字助理',
    },
  },
]

const modules = import.meta.glob('~/layouts/*.vue')
export function setupLayouts(routes) {
  return routes.map((route) => {
    const componentPath = `/src/layouts/${route.meta?.layout || 'blank'
    }.vue`
    return {
      path: route.path,
      component: modules[componentPath],
      children: [{ ...route, path: '' }],
    }
  })
}
/**
 * 生成式路由（异步路由、根据 pages 文件夹自动生成，可以根据权限动态addRoute）
 * 动态路由如 'user/:id'，文件夹应该建为：
 * src/pages/
 *    └── user/
 *      └── [id].vue
 */
// eslint-disable-next-line import/no-mutable-exports
let asyncRoutes = []
if (useSettingsStore(pinia).app.routeBaseOn === 'fileSystem') {
  asyncRoutes = setupLayouts(
    generatedRoutes.filter((item) => {
      return (
        !item.meta?.disabled
        && item.meta?.constant !== true
        && item.meta?.layout !== false
        && !item.meta?.frontend
      )
    }),
  )
}
export { systemRoutes, asyncRoutes }
