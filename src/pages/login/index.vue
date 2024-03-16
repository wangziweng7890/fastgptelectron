<script setup lang="ts">
import { AuthBinding, AuthLogin } from '~/services/auth/apifox'
const router = useRouter()
const loginUrl = ref('')

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
    ElMessage.error('登录失败')
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
    ElMessage.error('认证失败')
  }
}

// 登录的方法：获取webview的event事件，并打印
const init = async () => {
  await loadLoginUrl()
  const webview = document.querySelector('webview')
  webview?.addEventListener('will-navigate', (e: any) => {
    console.log('will-navigate', e)
    const targetUrl = e.url || ''
    // 跳转的域名和企业微信的域名一致，表示刷新页面
    if (loginUrl.value !== targetUrl && loginUrl.value.slice(0, loginUrl.value.indexOf('?')) === targetUrl.slice(0, targetUrl.indexOf('?'))) {
        (webview.reload || location.reload)()
        return
    }
    loginUrl.value = ''
    initAuth(targetUrl)
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <webview v-if="loginUrl" :src="loginUrl" class="flex h-100% w-100%" />
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
