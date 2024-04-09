/*
 * @FilePath: /Document-System/src/store/modules/settings.ts
 * @Description:
 */
const useSettingStore = defineStore(
  // 唯一ID
  'settings',
  () => {
    /**
     * 路由数据来源
     * frontend 前端
     * filesystem 文件系统
     */
    const app = ref({
      routeBaseOn: 'fileSystem',
      title: '银河数字助理',
    })

    function setTitle(str) {
      app.value.title = str
      document.title = str
    }

    // 头像
    const avatar = ref('')
    function setAvatar(str) {
      avatar.value = str
    }

    // 窗口是否置顶
    const isAffixedWindow = ref(false)
    function setIsAffixedWindow(flag) {
      isAffixedWindow.value = flag
    }

    // 窗口大小
    const isFullScreen = ref(false)
    function setIsFullScreen(flag) {
      isFullScreen.value = flag
    }

    return {
      app,
      setTitle,
      avatar,
      setAvatar,
      isAffixedWindow,
      setIsAffixedWindow,
      isFullScreen,
      setIsFullScreen,
    }
  })

export default useSettingStore
