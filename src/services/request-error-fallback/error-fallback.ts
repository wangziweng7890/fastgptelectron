import type { AxiosError } from 'axios'

export interface FallbackableError extends AxiosError {
  _key: any
  _isFallbackableError: boolean
  _fallbackPrevented: boolean
  preventFallback: () => void
}

export interface FallbackErrorHandler<T = Error> {
  (err: T): any
}

export function isFallbackableError(err: any) {
  return !!err._isFallbackableError
}

function errorHandler<T>(
  event: PromiseRejectionEvent,
  fallbackErrorHandler: FallbackErrorHandler<T>,
) {
  const { reason: err } = event
  if (isFallbackableError(err)) {
    event.preventDefault()
    fallbackErrorHandler(err)
  }
}

type UnhandledRejection = (event: PromiseRejectionEvent) => any
interface CustomError {
  message: string
  response?: {
    data?: {
      message?: string
    }
  }
}
/**
 * 错误兜底
 * 特性清单：
 * 1. 未 catch 且 err 【未】被 makeErrorFallbackable 过的 Promise rejection 跳过，例：
 *    ```
 *      Promise.reject(new Error('reason'));
 *    ```
 * 2. 未 catch 且 err 被 makeErrorFallbackable 过的 Promise rejection 默认调用 fallbackErrorHandler ，例：
 *    ```
 *      Promise.reject(makeErrorFallbackable(new Error('reason')));
 *    ```
 * 3. 被 catch 过的 Promise rejection 不会被处理，例：
 *    ```
 *      Promise.reject(new Error('reason'))
 *          .catch((err) => { console.trace(err) });
 *    ```
 * 4. 被 catch 过且再次 throw err 的，且未 catch 且 err 被 makeErrorFallbackable 过的，且调用了 err.preventFallback() 的，跳过，例：
 *    ```
 *      Promise.reject(makeErrorFallbackable(new Error('reason')))
 *          .catch((err) => {
 *              err.preventFallback();
 *              throw err;
 *          });
 *    ```
 * 5. 被 catch 过且在 catch 里再一次 throw err 的，且未 catch 且 err 被 makeErrorFallbackable 过的，且未调用 err.preventFallback() 的，默认调用 fallbackErrorHandler ，例：
 *    ```
 *      Promise.reject(makeErrorFallbackable(new Error('reason')))
 *          .catch((err) => {
 *              throw err;
 *          });
 *    ```
 * @param fallbackErrorHandler 兜底错误处理方法，入参未 `reject reason`
 * @param key 标识此次 `install` 关心的错误，默认值: `fallbackErrorHandler`
 * @returns {{ uninstall: () => void, makeErrorFallbackable: (err: Error) => FallbackableError }} `uninstall`: 卸载；`makeErrorFallbackable`: 将 err 变为可自消化错误对象，保证兜底方案生效
 */
export function install<T>(
  fallbackErrorHandler: FallbackErrorHandler<T>,
  key: any = fallbackErrorHandler, // @TODO 相同 key 多次 install 时候有问题
) {
  let isActive = true

  function makeErrorFallbackable(error: AxiosError): FallbackableError {
    if (!isActive) {
      throw new Error('I have been uninstalled.')
    }
    let message = error.message
    if (error && error.response) {
      switch (error.response.status) {
      case 400: message = '参数错误'; break
      case 401: message = '登录失效，请重新登录'; break
      case 403: message = '您没有权限操作'; break
      case 404: message = '请求地址出错'; break
      case 408: message = '请求超时'; break
      case 500: {
        const errorData = error as CustomError
        message = errorData?.response?.data?.message ? errorData.message : '服务器内部错误'
        break
      }
      case 501: message = '服务未实现'; break
      case 502: message = '网关错误'; break
      case 503: message = '服务不可用！'; break
      case 504: message = '服务暂时无法访问，请稍后再试'; break
      case 505: message = 'HTTP版本不受支持'; break
      }
    }
    if (error.message.includes('timeout')) {
      message = '请求超时'
    }
    else if (error.message.includes('Network')) {
      message = '网络错误'
    }
    error.message = message
    Object.assign(error, {
      _key: key,
      _isFallbackableError: true,
      _fallbackPrevented: false,
      preventFallback() {
        Object.assign(error, { _fallbackPrevented: true })
      },
    })

    return error as FallbackableError
  }

  let onUnhandledRejection: UnhandledRejection | null = function onUnhandledRejection(
    event: PromiseRejectionEvent,
  ) {
    const { reason: error } = event
    if (error._key === key && !error._fallbackPrevented)
      errorHandler<T>(event, fallbackErrorHandler)
  }

  window.addEventListener('unhandledrejection', onUnhandledRejection)

  function uninstall() {
    if (onUnhandledRejection) {
      window.removeEventListener('unhandledrejection', onUnhandledRejection)

      isActive = false
      onUnhandledRejection = null
      key = null
    }
  }

  return {
    uninstall,
    makeErrorFallbackable,
  }
}
