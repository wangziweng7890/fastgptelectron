import dayjs from 'dayjs'
import {
  EventStreamContentType,
  fetchEventSource,
} from '@fortaine/fetch-event-source'
import {
  getErrText,
} from './utils'
enum sseResponseEventEnum {
    error = 'error',
    answer = 'answer', // animation stream
    response = 'response', // direct response, not animation
    moduleStatus = 'moduleStatus',
    appStreamResponse = 'appStreamResponse', // sse response request
}

export const streamFetch = ({
  url = 'http://smart-api-test.galaxy-immi.com:8090/front/chat/completions/stream' || '/api/v1/chat/completions',
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
    const errMsg = ''
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
        message: getErrText(err, errMsg || '响应过程出现异常~'),
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
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHBfdXNlcjoxNzY4MTAxNDU5NjY4ODQwNDUwIiwicm5TdHIiOiJrbW9CNFNEMnp3VDdlUVhBaGhIVVVIOEZwZklJc2VCeCIsImNsaWVudGlkIjoiZTVjZDdlNDg5MWJmOTVkMWQxOTIwNmNlMjRhN2IzMmUiLCJ0ZW5hbnRJZCI6IjAwMDAwMCIsInVzZXJJZCI6MTc2ODEwMTQ1OTY2ODg0MDQ1MCwiZGVwdElkIjoxMDB9.-i-dgE58AXVLjYY7LvnCEuYkBRDEz-04ERSR7SzpgVY',
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
        onmessage({ event, data }) {
          console.log(11, event, 22, data)
          if (data === '[DONE]' || finished) {
            finished = true
            return
          }

          for (const item of data) {
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
          clearTimeout(timeoutId)
          failedFinish(getErrText(e))
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
