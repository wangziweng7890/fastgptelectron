import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

/**
 * qiankun 所有应用 dsn 配置表
 * @key: 应用名
 * @value: dsn
 */
const appsSentryDsn = {
  mainApp:
        'https://5c1268fd50654bca8a4b8364545281a4@dev-sentry.galaxy-immi.com/6',
  chatbot_admin:
        'https://a9813c7f9573436084dabdd69a55dfc0@dev-sentry.galaxy-immi.com/4',
  earlyWarning:
        'https://c5381f74ef2d404e98b83e39846fdc7c@dev-sentry.galaxy-immi.com/5',
}

/**
 * 根据具体情况（当前在哪个应用），改写sentry上报的url（目的：qiankun区分多应用上报sentry）
 * @param {*} url
 * @param {*} ops
 * @returns
 */
const SentryFilter = (url, ops) => {
  let currentDsn = ''
  if (window.location.pathname.split('/')[1] !== 'subApp') {
    currentDsn = appsSentryDsn.mainApp /* 没匹配上，默认上报到主应用 */
  }
  else {
    const currentApp = window.location.pathname.split('/')[2]
    currentDsn = appsSentryDsn[currentApp]
  }
  const projectId = currentDsn.split('@')[1].split('/')[1]
  const sentryKey = currentDsn.split('@')[0].split('//')[1]
  const urlObj = new URL(url)
  const { origin, search } = urlObj
  const currentSentryUrl = `${origin}/api/${projectId}/envelope/${search.replace(
    urlObj.searchParams.get('sentry_key'),
    sentryKey,
  )}`
  return {
    newUrl: currentSentryUrl,
    newOptions: ops,
  }
}

const CustomTransport = (options) => {
  const fetchImpl = (url, options) => {
    const { newUrl, newOptions } = SentryFilter(url, options)
    return window.fetch(newUrl, newOptions)
  }
  Sentry.makeFetchTransport(options, fetchImpl)
  return Sentry.makeFetchTransport(options, fetchImpl)
}

export const initSentry = (vueInstance, routerInstance) => {
  Sentry.init({
    app: vueInstance,
    // dsn: 'http://@39.108.119.243:9000/6',
    dsn: appsSentryDsn.mainApp /* 默认上报到主应用 */,
    transport: CustomTransport,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation:
                    Sentry.vueRouterInstrumentation(routerInstance),
        tracingOrigins: ['localhost', 'my-site-url.com', /^\//],
      }),
    ],
    // eslint-disable-next-line no-undef
    release: APP_VERSION,
    environment: import.meta.env.VITE_APP_ENV,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
