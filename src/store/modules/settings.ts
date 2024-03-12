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
      title: '',
    })

    /**
     * 设置网页标题
     * @param { string} title 标题
    */
    function setTitle(title: string) {
      app.value.title = title
      document.title = title
    }

    return {
      app,
      setTitle,
    }
  })

export default useSettingStore
