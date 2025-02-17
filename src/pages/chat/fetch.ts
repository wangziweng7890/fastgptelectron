import dayjs from 'dayjs'
import {
  EventStreamContentType,
  fetchEventSource,
} from '@fortaine/fetch-event-source'
import {
  getErrText,
} from './utils'
import router from '@/router'
// enum sseResponseEventEnum {
//     error = 'error',
//     answer = 'answer', // animation stream
//     response = 'response', // direct response, not animation
//     moduleStatus = 'moduleStatus',
//     appStreamResponse = 'appStreamResponse', // sse response request
// }

export const streamFetch = ({
  url = `${import.meta.env.VITE_APP_API_BASEURL}/front/chat/completions/stream`,
  data,
  onMessage,
  abortCtrl,
}) =>
  new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      abortCtrl.abort('Time out')
    }, 60000)

    // response data
    let responseText = ''
    let remainTextList: string[] = []
    let errMsg = ''
    const responseData = []
    let finished = false

    const finish = () => {
      if (errMsg) {
        return failedFinish()
      }
      return resolve({
        responseText,
        responseData,
      })
    }
    const failedFinish = (err?: any) => {
      finished = true
      reject({
        message: getErrText(err, errMsg),
        responseText,
      })
    }

    // animate response to make it looks smooth
    function animateResponseText() {
      // abort message
      if (abortCtrl.signal.aborted) {
        const remainText = remainTextList.join('')
        onMessage({ text: remainText })
        responseText += remainText
        return finish()
      }

      if (remainTextList.length > 0) {
        const fetchCount = Math.max(1, Math.round(remainTextList.length / 60))
        const fetchText = remainTextList.slice(0, fetchCount).join('')

        onMessage({ text: fetchText })

        responseText += fetchText
        remainTextList = remainTextList.slice(fetchCount)
      }

      if (finished && remainTextList.length === 0) {
        return finish()
      }

      requestAnimationFrame(animateResponseText)
    }
    // start animation
    animateResponseText()

    try {
      // auto complete variables
      const variables = data?.variables || {}
      variables.cTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

      const requestData = {
        method: 'POST',
        headers: {
          'clientId': 'e5cd7e4891bf95d1d19206ce24a7b32e',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}` || 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHBfdXNlcjoxNzY4MTAxNDU5NjY4ODQwNDUwIiwicm5TdHIiOiJrbW9CNFNEMnp3VDdlUVhBaGhIVVVIOEZwZklJc2VCeCIsImNsaWVudGlkIjoiZTVjZDdlNDg5MWJmOTVkMWQxOTIwNmNlMjRhN2IzMmUiLCJ0ZW5hbnRJZCI6IjAwMDAwMCIsInVzZXJJZCI6MTc2ODEwMTQ1OTY2ODg0MDQ1MCwiZGVwdElkIjoxMDB9.-i-dgE58AXVLjYY7LvnCEuYkBRDEz-04ERSR7SzpgVY',
          'Accept': '*/*',
        },
        signal: abortCtrl.signal,
        body: JSON.stringify({
          ...data,
          variables,
          detail: true,
          stream: true,
        }),
      }

      // send request
      await fetchEventSource(url, {
        ...requestData,
        async onopen(res) {
          clearTimeout(timeoutId)
          const contentType = res.headers.get('content-type')

          // not stream
          if (contentType?.startsWith('text/plain')) {
            return failedFinish(await res.clone().text())
          }

          // 401
          if (contentType?.startsWith('application/json')) {
            const resData = await res.clone().json()
            if (resData.code === 401) {
              abortCtrl.abort('error')
              errMsg = '登录已过期，请重新登录'
              localStorage.clear()
              router.push({
                path: '/login',
              })
            }
            else if (resData.code === 503)
              (
                errMsg = resData.msg || '你进小黑屋啦，快找管理员哦'
              )
            else {
              errMsg = '网络被妖怪抓走啦'
            }
            console.log('请求错误', resData.msg)
            return failedFinish()
          }

          // failed stream
          if (
            !res.ok
                        || !res.headers.get('content-type')?.startsWith(EventStreamContentType)
                        || res.status !== 200
          ) {
            try {
              failedFinish(await res.clone().json())
            }
            catch {
              const errText = await res.clone().text()
              if (!errText.startsWith('event: error')) {
                failedFinish()
              }
            }
          }
        },
        onmessage({ data }) {
          if (data === '[DONE]' || finished) {
            finished = true
            return
          }

          // parse text to json
          const parseJson = (() => {
            try {
              return JSON.parse(data)
            }
            catch (error) {
              return {
                content: '',
              }
            }
          })()
          for (const item of parseJson.content) {
            remainTextList.push(item)
          }

          //   // parse text to json
          //   const parseJson = (() => {
          //     try {
          //       return JSON.parse(data)
          //     }
          //     catch (error) {
          //       return {}
          //     }
          //   })()

          //   if (event === sseResponseEventEnum.answer) {
          //     const text: string = parseJson?.choices?.[0]?.delta?.content || ''

        //     for (const item of text) {
        //       remainTextList.push(item)
        //     }
        //   }
        //   else if (event === sseResponseEventEnum.response) {
        //     const text: string = parseJson?.choices?.[0]?.delta?.content || ''
        //     remainTextList.push(text)
        //   }
        //   else if (
        //     event === sseResponseEventEnum.moduleStatus
        //                 && parseJson?.name
        //                 && parseJson?.status
        //   ) {
        //     onMessage(parseJson)
        //   }
        //   else if (event === sseResponseEventEnum.appStreamResponse && Array.isArray(parseJson)) {
        //     responseData = parseJson
        //   }
        //   else if (event === sseResponseEventEnum.error) {
        //     errMsg = getErrText(parseJson, '流响应错误')
        //   }
        },
        onclose() {
          finished = true
        },
        onerror(e) {
          console.error('fetchError', e)
          clearTimeout(timeoutId)
          failedFinish()
        },
        openWhenHidden: true,
      })
    }
    catch (err: any) {
      clearTimeout(timeoutId)

      if (abortCtrl.signal.aborted) {
        finished = true

        return
      }
      console.log(err, 'fetch error')

      failedFinish(err)
    }
  })
