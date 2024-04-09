<script setup lang="ts">
import { AuthBinding, AuthLogin } from '~/services/auth/apifox'
const router = useRouter()
const route = useRoute()
const loginUrl = ref('')

function jump() {
  router.push({
    path: route.path === '/login2' ? '/login' : '/login2',
  })
}
// 登录,获取access_token
function initAuth(url: string) {
  const urlParams = new URLSearchParams(url.split('?')[1])
  localStorage.setItem('urlParams', JSON.stringify(urlParams))
  const socialCode = urlParams.get('code')
  const socialState = urlParams.get('state')

  const params = {
    socialCode, // 上步回调页面返回的code
    socialState, // 上步回调页面返回的state
    tenantId: '000000', // 固定
    source: 'wechat_enterprise', // 企微就是 wechat_enterprise
    clientId: 'e5cd7e4891bf95d1d19206ce24a7b32e', // 固定
    grantType: 'social', // 固定
  }

  AuthLogin(params).then((res: any) => {
    console.log('登录-res', res)
    localStorage.setItem('access_token', res.access_token)
    localStorage.setItem('refresh_token', res.refresh_token)
    router.push('/chat') // 成功跳转到聊天页面
  }).catch((err: any) => {
    console.log('err', err)
    loginUrl.value = ''
    jump()
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  })
}

// 获取企业微信的登录url
async function loadLoginUrl() {
  try {
    const res = await AuthBinding({
      type: 'wechat_enterprise',
    })
    console.log('res', res)
    loginUrl.value = res
  }
  catch (err) {
    console.log('err', err)
    // ElMessage.error('认证失败')
  }
}
function event(e) {
  console.log('will-navigate', e)
  const targetUrl = e.url || ''
  // 包含redirect_uri的url，表示还是跳转登录页
  if (targetUrl.includes('redirect_uri')) {
    jump()
    return
  }
  loginUrl.value = ''
  initAuth(targetUrl)
}

// 登录的方法：获取webview的event事件，并打印
async function init() {
  await loadLoginUrl()
}
let webviewRef

onMounted(async () => {
  await init()
  webviewRef = document.querySelector('webview')
  webviewRef?.addEventListener('will-navigate', event)
})

onUnmounted(() => {
  webviewRef.removeEventListener('will-navigate', event)
})
</script>

<template>
  <div class="flex flex-col h-100% w-100%">
    <HeaderBar />
    <webview v-if="loginUrl" :src="loginUrl" class="flex-1 " />
  </div>
  <!-- <iframe v-if="loginUrl" :src="loginUrl" style="display: inline-flex; width: 640px; height: 800px;" /> -->
</template>

<style scoped lang="scss">

</style>

<route>
{
  meta: {
    title: "银河数字助理",
    layout: 'blank'
  }
}
</route>
