<!--
 * @FilePath: /vue3-admin-template/src/pages/template/index.vue
 * @Description: 工作台首页
-->
<route>
  {
    meta: {
      title: "首页",
      constant: false,
      layout: 'blank'
    }
  }
</route>

<script setup lang="ts" name="tempalte">
import { AuthBinding, AuthLogin } from '@/services/auth/apifox'

// const versions = versions || {}
console.log('versions', window.electronAPI?.chromeVersion())
// console.log('ping()', window.electronAPI?.ping())
const testAsync = async () => {
  console.log('testAsync', await window.electronAPI?.ping())
}
testAsync()
const versionInfo = `本应用正在使用 Chrome (v${window.electronAPI?.chromeVersion()}), Node.js (v${window.electronAPI?.nodeVersion()}), 和 Electron (v${window.electronAPI?.electronVersion()})`
// const versionInfo = 'version info'
// console.log('process.env.VITE_DEV_SERVER_URL', process.env.VITE_DEV_SERVER_URL)

function initAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('urlParams', urlParams)
    const socialCode = urlParams.get('code');
    const socialState = urlParams.get('state');

    console.log('socialCode', socialCode, socialState)
    const access_token = localStorage.getItem('access_token')
    // 有access_token，则无需反复授权
    if (access_token) return

    if (socialCode) {
        let params = {
            socialCode,//上步回调页面返回的code
            socialState,//上步回调页面返回的state
            "tenantId": "000000",//固定
            "source": "wechat_enterprise",//企微就是 wechat_enterprise
            "clientId": "e5cd7e4891bf95d1d19206ce24a7b32e",//固定
            "grantType": "social"//固定
        }
        console.log('params', params)
        // {
        //     "scope": "string",
        //     "openid": "string",
        //     "access_token": "string",
        //     "refresh_token": "string",
        //     "expire_in": 0,
        //     "refresh_expire_in": 0,
        //     "client_id": "string"
        // }
        AuthLogin(params).then((res: any) => {
            console.log('登录-res', res)
            localStorage.setItem('access_token', res.access_token)
            localStorage.setItem('refresh_token', res.refresh_token)
            location.reload()
        }).catch((err: any) => {
            console.log('err', err)
            ElMessage.error('登录失败');
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        })
        return
    }

    AuthBinding('wechat_enterprise').then((res: any) => {
        console.log('res', res)
        window.location.href = res
    }).catch((err: any) => {
        console.log('err', err)
        ElMessage.error('认证失败');
    })
}

initAuth()

</script>

<template>
  <div style="color: red;">
    首页7
    <ul>
      <li>
        <a href="">
          <router-link to="/template">
            链接跳转template页
          </router-link>
        </a>
      </li>
        <li>
        <a href="">
          <router-link to="/search">
            银河搜搜
          </router-link>
        </a>
      </li>
    </ul>
    <p>
      {{ versionInfo }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.tempalte-content {
  width: 100%;
  height: 90%;
}
</style>
