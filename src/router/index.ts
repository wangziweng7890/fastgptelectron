/*
 * @FilePath: /vue3-admin-template/src/router/index.ts
 * @Description:
 */
import { createRouter, createWebHistory } from 'vue-router'
import '@/styles/nprogress.scss'
import { useNProgress } from '@vueuse/integrations/useNProgress'
import { asyncRoutes, systemRoutes } from './routes'
import useSettingsStore from '@/store/modules/settings'
const { isLoading } = useNProgress()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...systemRoutes,
    ...asyncRoutes,
  ],
})

router.beforeEach(async () => {
  // const userStore = useUserStore()

  isLoading.value = true
  // if (to.query.token) {
  //     await userStore.setURLToken(to.query.token)
  //     delete to.query.token
  //     next({
  //         ...to,
  //         replace: true,
  //         query: {
  //             ...to.query,
  //         },
  //     })
  // }
  // if (userStore.isLogin) {
  //     if (!(userStore.menus && userStore.menus.length)) {
  //         await userStore.getUserNavMenu()
  //     }
  //     if (to.name) {
  //         if (to.matched.length) {
  //             if (to.name === 'login') {
  //                 next({
  //                     path: '/',
  //                     replace: true,
  //                 })
  //             }
  //             else {
  //                 if (from && from.path === '/login') {
  //                     // 登录之后检查跳转的页面是否在当前的分组内，如果不在，则跳转到当前分组的第一个页面
  //                     const toPathId = findMenuProperty(userStore.menus, to.path, 'path', 'id')
  //                     const toPathIsInGroup = userStore.menuGroups.find(item => item.id === userStore.currentGroupId)?.pages_id.includes(toPathId) || false
  //                     if (toPathIsInGroup) {
  //                         next()
  //                     }
  //                     else {
  //                         const allPagesId = getAllPagesId(userStore.menus) // 所有属于页面级的页面id
  //                         const currentGroupPagesId = userStore.menuGroups.find(item => item.id === userStore.currentGroupId)?.pages_id || []
  //                         const pagesId = allPagesId.find(item => currentGroupPagesId.includes(item)) || 0
  //                         const firstGroupPage = findMenuProperty(userStore.menus, pagesId, 'id', 'path')
  //                         if (firstGroupPage) {
  //                             next({
  //                                 path: firstGroupPage,
  //                             })
  //                         }
  //                         else {
  //                             next()
  //                         }
  //                     }
  //                 }
  //                 else {
  //                     next()
  //                 }
  //             }
  //         }
  //         else {
  //             next({
  //                 path: '/404',
  //             })
  //         }
  //     }
  //     else {
  //         next()
  //     }
  // }
  // else {
  //     if (to.name !== 'login') {
  //         next({
  //             name: 'login',
  //             query: {
  //                 redirect: to.fullPath,
  //             },
  //         })
  //     }
  //     else {
  //         next()
  //     }
  // }
})
router.afterEach((to) => {
  const settingsStore = useSettingsStore()
  isLoading.value = false
  // 设置页面 title
  to.meta.title && settingsStore.setTitle(typeof to.meta.title === 'function' ? to.meta.title() : to.meta.title)
})

export default router
