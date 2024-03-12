<route>
{
  meta: {
    title: "登录",
    constant: true,
    layout: false
  }
}
</route>

<script setup lang="ts" name="Login">
// 登录页面 用户名 密码 输入框左侧的图标
import { Key, Lock, UserFilled } from '@element-plus/icons-vue'
import cryptoAES from '@/utils/cryptoAES'

// 引入pinia状态管理
import useUserStore from '@/store/modules/user'

// 数据状态管理
const userStore = useUserStore()

// 单个路由
const route = useRoute()

// 路由器：用来管理路由
const router = useRouter()

// 登录信息数据
const loginForm = reactive({
  // 用户名
  username: '',
  // 密码
  password: '',
  // 验证码key
  key: '',
  // 验证码
  captcha: '',
})

// 登录按钮--动画控制
const loading = ref<boolean>(false)

// 校验提示信息内容
const tip = ref<string>('')

// 登录校验规则
const checkRules = reactive({
  username: false,
  password: false,
  captcha: false,
})

// interface loginCaptcha {
//     sensitive: boolean
//     key: string
//     img: string
// }
// 验证码
const captchaImg = ref<string>('')
// 获取验证码图标
const getCaptcha = async () => {
  // const { data: { img, key } } = await API.captcha() as ApiResponse<loginCaptcha>
  // captchaImg.value = img
  // loginForm.key = key
}
// 登录方法逻辑
const login = async () => {
  // 解构赋值  获取登录信息--用户名和密码
  const { username, password, captcha } = loginForm
  // 校验：当未输入时展示 提示框2秒
  if (!username) {
    tip.value = '请填写用户名'
    checkRules.username = true
    setTimeout(() => {
      checkRules.username = false
    }, 2000)
    return
  }
  if (!password) {
    tip.value = '请输入密码'
    checkRules.password = true
    setTimeout(() => {
      checkRules.password = false
    }, 2000)
    return
  }
  if (!captcha) {
    tip.value = '请输入验证码'
    checkRules.captcha = true
    setTimeout(() => {
      checkRules.captcha = false
    }, 2000)
    return
  }
  // 登录按钮进行londing状态
  loading.value = true
  // 调用pinia状态管理的login方法 调用一个接口 普通调用过程
  userStore.login({ ...loginForm, password: cryptoAES.encrypt(loginForm.password) }).then(() => {
    // 定向路径
    let redirectPath = '/'
    // route.query.redirect 为数组还是字符串 进行赋值
    if (Array.isArray(route.query.redirect))
      redirectPath = route.query.redirect[0] as string
    // Assuming first item in array is the intended path
    else if (typeof route.query.redirect === 'string')
      redirectPath = route.query.redirect
    // 路由跳转 到 定向那个路径
    router.push({ path: redirectPath })
    // 登录按钮取消loading状态
    loading.value = false
  })
    .catch((error) => {
      // 捕获错误
      getCaptcha()
      ElMessage.error(error.message || '服务异常，请稍后再试')
      loading.value = false
    })
}
// 给登录按钮绑定回车事件
const enterLogin = () => {
  document.onkeydown = (e: Partial<KeyboardEvent>) => {
    e = window.event || e
    if (
      route.name === 'login'
            && ['Enter', 'enter', 'NumpadEnter'].includes(e.code ?? '')
    )
      login()
  }
}
onMounted(() => {
  getCaptcha()
  enterLogin()
})
</script>

<template>
  <div class="login-page">
    <div class="container">
      <div class="form-con">
        <div class="company">
          <!-- 图标 -->
          <img src="~@/assets/images/logo.png" alt="">
          <!-- 文案 -->
          <h2>xxx后台通用管理系统</h2>
        </div>
        <div class="form">
          <el-form ref="ruleForm" :model="loginForm">
            <el-form-item prop="username">
              <!-- 用户名校验提示框 -->
              <el-tooltip :visible="checkRules.username" placement="right">
                <template #content>
                  <i class="tip-icon el-icon-warning" />{{
                    tip
                  }}
                </template>
                <el-input v-model="loginForm.username" placeholder="用户名" class="username" :prefix-icon="UserFilled" />
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="password">
              <!-- 密码校验提示框 -->
              <el-tooltip :visible="checkRules.password" placement="right">
                <template #content>
                  <i class="tip-icon el-icon-warning" />{{ tip }}
                </template>
                <!-- 密码输入框 -->
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  :prefix-icon="Lock"
                  show-password
                  placeholder="密码"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="captcha">
              <!-- 验证码提示框 -->
              <el-tooltip :visible="checkRules.captcha" placement="right">
                <template #content>
                  <i class="tip-icon el-icon-warning" />{{ tip }}
                </template>
                <!-- 验证码输入框 -->
                <el-row :gutter="10">
                  <el-col :span="17">
                    <el-input
                      v-model="loginForm.captcha"
                      :prefix-icon="Key"
                      placeholder="验证码"
                    />
                  </el-col>
                  <el-col :span="7">
                    <img class="login-img" :src="captchaImg" @click="getCaptcha">
                  </el-col>
                </el-row>
              </el-tooltip>
            </el-form-item>
          </el-form>
          <!-- 登录按钮 -->
          <el-button
            class="login-btn"
            round
            type="primary"
            :loading="loading"
            @click="login"
            @keyup.enter="enterLogin()"
          >
            登录
          </el-button>
        </div>
      </div>
      <div class="illustration">
        <img class="desc-img" src="@/assets/images/login.png" alt="login-info">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #f7fbff;

  .container {
    display: flex;
    width: 980px;
    height: 520px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 2px 9px 49px -17px rgb(0 0 0 / 10%);
  }
  // .center {
  //     justify-content: center;
  //     align-items: center;
  // }

  .username {
    :deep(.el-input__inner) {
      border-radius: 0 26px 26px 0;
    }
  }

  .form-con {
    display: flex;
    flex-direction: column;
    align-items: center;

    .company {
      display: flex;
      justify-content: center;
      width: 80%;
      margin: 50px 0;

      h2 {
        margin-left: 12px;
        color: #272346;
        font-weight: 900;
        font-size: 30px;
        line-height: 40px;
        text-align: center;
      }

      img {
        width: 40px;
        height: 40px;
      }
    }

    .form {
      width: 80%;

      :deep(.el-form-item) {
        margin-bottom: 36px;

        .el-input__wrapper {
          border-radius: 26px;
          border: 1px solid #e5e5e5;
          background: #f7fafc;
          box-shadow: none;
          padding: 1px;
        }
      }

      :deep(.el-input__inner) {
        display: inline-block;
        box-sizing: border-box;
        width: 100%;
        height: 52px;
        padding: 15px 60px 15px 0;
        color: $hk-main-text-color;
        font-size: 16px;
        text-align: left;
        border: none;
        outline: none;
        outline: non0e;
        transition: 0.3s ease;
      }

      :deep(.el-input__prefix) {
        width: 52px;
        height: 52px;

        .el-input__icon {
          width: 52px;
          font-size: 18px;
          line-height: 52px;
        }
      }

      :deep(.el-input__suffix) {
        padding: 0 16px;
        height: 52px;
      }

      .login-btn {
        width: 100%;
        height: 52px;
        font-size: 20px;
        letter-spacing: 24px;
        text-indent: 24px;
        border-radius: 26px;
      }
      .login-img {
        width: 100px;
        height: 50px;
        cursor: pointer;
      }
    }
  }

  .illustration {
    flex: 1;
    .desc-img {
      width: 100%;
      height: 100%;
    }
  }
}

.tip-icon {
  margin-right: 6px;
  color: #e6a23c;
  font-size: 14px;
}
</style>
