import type { AxiosError } from 'axios'
import Axios from 'axios'
import { ElMessage } from 'element-plus'
import type { ResponseError } from '../types'

export function axiosErrorHandler(error: AxiosError<ResponseError>) {
  if (!Axios.isCancel(error)) {
    // 取消重复请求不需要提示
    ElMessage.error(error.message)
  }
  console.info('【axios-error-hanlde】:', error)
}
