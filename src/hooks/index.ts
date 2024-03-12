/*
 * @Description:hooks钩子函数
 */

/**
 * @description: 计算动态标签宽度，使其一行展示
 * @return {*}
 */
export const useDynamicLabelWidth = (threshold) => {
  const tagRefs = ref<Array<ComponentPublicInstance>>([])
  const getRefData = () => {
    const tagOffsetLeftList = tagRefs.value.map((item) => {
      const offsetWidth = item.$el.offsetWidth
      const offsetLeft = item.$el.offsetLeft
      return offsetWidth + offsetLeft
    })

    const index = tagOffsetLeftList.findIndex(num => num > threshold)
    return index !== -1 ? index : 0
  }

  return { tagRefs, getRefData }
}

/**
 * 使用阿里云OSS服务的hook。
 * @return {Function} uploadFile 上传文件并返回上传文件的信息。
 * @return {Function} viewOssFile 生成用于查看OSS文件的带有临时密钥可直接预览的URL。
 * @return {Function} inputFileUpload 上传一个或多个文件并返回一个解析结果的 Promise。
 */
// export const useAliyunOss = () => {
//     let ossService = null

//     /**
//      * 上传文件并返回上传文件的信息。
//      * @param {Expand<IFileType>} file - 要上传的文件。
//      * @return {Promise<Expand<IFileInfo>>} - 一个返回上传文件信息的 Promise。
//      */
//     const uploadFile: (file: IFileType) => Promise<Expand<IFileInfo>> = async (file: Expand<IFileType>): Promise<Expand<IFileInfo>> => {
//         try {
//             if (!ossService) {
//                 // 初始化oss
//                 ossService = await AliyunOssService.createFromBackend()
//             }
//             const res = await ossService.uploadFile(file)
//             return res
//         }
//         catch (error) {
//             console.warn(error)
//         }
//     }

//     /**
//      * 生成用于查看OSS文件的带有临时密钥可直接预览的URL。
//      * @param {string} url - OSS文件的URL。
//      * @param {string} localBaseUrl - 本地环境的基本URL。默认值为 'http://middle-platform.galaxy-immi.com:8083/api'。
//      * @returns {string} 生成的用于查看OSS文件的URL。
//      */
//     const viewOssFile = (url: string, localBaseUrl = 'http://middle-platform.galaxy-immi.com:8083'): string => {
//         const { MODE } = import.meta.env
//         const baseUrl = MODE === 'development' ? localBaseUrl : ''
//         if (url.includes('?OSSAccessKeyId')) {
//             url = url.split('?OSSAccessKeyId')[0]
//         }
//         return `${baseUrl}/api/notice-manager/authorization?galaxy_app_id=galaxy-crm&url=${url}`
//     }

//     /**
//      * 上传一个或多个文件并返回一个解析结果的 Promise。
//      * @param {string} type - 接受的文件类型。默认值为 '.jpg, .jpeg, .png, .JPG, .JPEG, .PNG'。
//      * @param {boolean} [multiple] - 表示是否可以选择多个文件。
//      * @return {Promise<FileResult<T>>} 上传成功返回阿里云oss的上传结果，失败返回错误信息。
//      */
//     type FileResult<T extends boolean> = T extends true ? Promise<Expand<IFileInfo>[]> : Promise<Expand<IFileInfo>>
//     const inputFileUpload = <T extends boolean = false>(type = '.jpg, .jpeg, .png, .JPG, .JPEG, .PNG', multiple?: T): FileResult<T> => {
//         return new Promise((resolve, reject) => { // Create a Promise
//             const domId = `inputFileUpload-${Date.now()}`
//             const inputElement = document.createElement('input')
//             inputElement.id = domId
//             inputElement.type = 'file'
//             inputElement.accept = type
//             inputElement.multiple = multiple
//             inputElement.style.display = 'none'

//             /**
//              * 处理输入元素的change事件。
//              * @param {Event} event - 事件对象。
//              * @return {Promise<void>} 处理change事件的Promise。
//              */
//             const changeListener = async (event: Event) => {
//                 const inputElement = event.target as HTMLInputElement
//                 const files = Array.from(inputElement.files)
//                 if (multiple) {
//                     try {
//                         const uploadPromises: IFileInfo[] = []

//                         for (const file of files) {
//                             const promise = await uploadFile(file)
//                             uploadPromises.push(promise)
//                         }
//                         const fileRes = await Promise.all(uploadPromises)
//                         resolve(fileRes)
//                     }
//                     catch (error) {
//                         reject(error)
//                     }
//                 }
//                 else {
//                     try {
//                         const fileRes = await uploadFile(files[0])
//                         resolve(fileRes)
//                     }
//                     catch (error) {
//                         reject(error)
//                     }
//                 }

//                 // 上传结束，移除监听和创建的input
//                 inputElement.removeEventListener('change', changeListener)
//                 document.body.removeChild(inputElement)
//             }

//             /**
//              * 取消上传，移除监听和创建的input，并抛出消息
//              */
//             const uploadCancel = () => {
//                 reject(new Error('取消上传'))
//                 inputElement.removeEventListener('change', uploadCancel)
//                 inputElement.removeEventListener('change', changeListener)
//                 document.body.removeChild(inputElement)
//             }
//             inputElement.addEventListener('change', changeListener)
//             inputElement.addEventListener('cancel', uploadCancel)

//             document.body.appendChild(inputElement)
//             inputElement.click()
//         }) as FileResult<T>
//     }
//     return { uploadFile, viewOssFile, inputFileUpload }
// }

/**
 * @description: 获取组件类型
 * @return {*}
 * @example const basicInfoRef = ref<InstanceType<typeof BasicInfo>>(null)
 * const basicInfoRef = useCompRef(BasicInfo)
 */
export const useCompRef = <T extends abstract new (...args: any) => any>(_comp: T) => {
  return ref<InstanceType<T>>()
}

