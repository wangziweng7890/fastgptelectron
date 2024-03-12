<h1 align='center'>
<b>vue3-template-cli</b>
</h1>

<br>

## Features

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite 2](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [ESBuild](https://github.com/evanw/esbuild) - born with fastness

- 🗂 [File based routing](./src/pages)

- 📦 [Components auto importing](./src/components)

- 🎨 [UnoCSS](https://github.com/antfu/unocss) - The instant on-demand atomic CSS engine.

- 😃 Use icons from any icon sets in [Pure CSS](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

- 🔥 Use the [new `<script setup>` style](https://github.com/vuejs/rfcs/pull/227)

- ✅ Use [Vitest](http://vitest.dev/) for unit and components testing

- 🦾 TypeScript, of course

- ☁️ Deploy on Netlify, zero-config


<br>

## Pre-packed

### UI Frameworks

- [UnoCSS](https://github.com/antfu/unocss) - The instant on-demand atomic CSS engine.

### Icons

- [Iconify](https://iconify.design) - use icons from any icon sets [🔍Icônes](https://icones.netlify.app/)
- [Pure CSS Icons via UnoCSS](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

### Plugins

- [Vue Router](https://github.com/vuejs/vue-router)
- [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages) - file system based routing
- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Directly use Vue Composition API and others without importing
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) - components auto import
- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs

## Try it now!

### Clone to local
终端执行命令

```bash

# 在项目仓库内
hkcli-init
# 选择脚手架对应版本
# yarn && yarn dev
```

![demo](https://s1.ax1x.com/2022/07/28/v9kVO0.jpg)

目前该Cli采用了简易版的git clone对应仓库的代码


使用本模板前，需要在本地依次安装好 Node.js, Git 和 Visual Studio Code。Node.js 版本需 >= 14.18.0 ，建议为 16.x

然后在 Visual Studio Code 里安装好以下扩展：

EditorConfig for VS Code
DotENV
i18n Ally
ESLint
stylelint
Vue Language Features

在 Visual Studio Code 里打开源码的文件夹，右下角会自动提示需要安装的依赖，直接点击安装即可。
![vscode](https://s3.bmp.ovh/imgs/2022/07/22/41257ad209e9e2ea.png)

```bash

|── .husky // husky相关文件
|── .vscode // vscode setting配置项
|── locales // 多语言翻译，.yml配置
|── public // 外链文件
|── src
│   ├── assets // 项目资源目录
│   ├── components // 基础组件、流程组装组件，此目录下文件会自动注册
│   ├── layouts // 布局layouts 默认default.vue
│   ├── modules  // vue注册的js
│   ├── pages // 页面文件，该目录下的.vue会默认生成路由页面
│   ├── router // vue-router 路由配置项和导航守卫
│   ├── services // 后端api相关
│   ├── store // pinia
│   ├── styles // style样式
│   ├── utils // 工具函数
│   ├── main.ts // 入口js
│   └── App.vue // 入口文件
|── test // 单元测试
├── .editorconfig // 编辑器配置项
├── .env.development // dev环境env配置
├── .env.production // prd环境env配置
├── .env.test // test环境env配置
├── .gitignore // git忽略文件
├── .npmrc // npm配置项
├── .stylelintrc // stylelint配置项
├── auto-imports.d.ts // 全局自动导入api
├── commitlint.config.js // git commit 的编写规范
├── index.html // 入口html 已支持EJS
├── netlify.toml
├── package.json
├── README.md
├── shims.d.ts
├── tsconfig.json // ts配置项
├── unocss.config.js // unocss配置项
├── vite.config.ts // vite配置项
└── yarn.lock

```
#### components
该目录下的.vue文件会被自动注册，由[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)支持,，只会注册.vue，.jsx文件，可在components.d.ts查看自动注册的name,vue文件中使用，不再需要import注册

vite.config.ts 中可增加额外配置
```bash
Components({
      dts: true,
      resolvers: [ElementPlusResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.jsx$/],
    }),
```

#### layouts
该特性由[vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)技术支持

.vue文件中增加以下代码，可实现基于当前的layout进行页面布局，可以在vite中配置
```bash
<route lang="yaml">
meta:
  layout: default #layouts下的文件会被自动全局注册，默认值为default
</route>
```
#### pages
该特性由[vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)技术支持

传统使用路由的方式需要手动编写路由，而基于文件系统的路由则会根据 /src/pages/ 下的文件目录结构，自动生成每个 .vue 文件对应的路由配置，从而节省手动配置路由的时间

路由示例：
```bash
文件系统                       路由地址                       路由 name

views
├─ example
│  ├─ components
│  │  └─ List
│  │     └─ index.vue
│  ├─ params
│  │  └─ [id].vue             /example/params/:id          example-params
│  ├─ axios.vue               /example/axios               example-axios
│  ├─ cookie.vue              /example/cookie              example-cookie
│  └─ svgicon.vue             /example/svgicon             example-svgicon
├─ [...all].vue               /:all(.*)*                   all
├─ index.vue                  /                            index
├─ reload.vue                 /reload                      reload
└─ login.vue                  /login                       login

```

- 使用路由参数需通过 [ ] 将参数名包裹，并设为文件名
- 文件夹不会生成路由，例如 example 文件夹并没有生成 /example 路由
- 路由 name 会根据文件的目录结构自动生成，并用-连接，可确保 name 的唯一性
- 所有 components/ 目录均不会生成路由

额外功能点:

- settingStore中配置routeBaseOn: fileSystem决定要不要开启文件系统理由,如不开启则需要手动写入路由
```bash
  /**
    * 路由数据来源
    * frontend 前端
    * filesystem 文件系统
    */
  routeBaseOn: 'fileSystem',
```
- 针对某些不需要被生成路由的文件，可以增加配置项禁止生成路由
```bash
<route>
{
    meta: {
        enabled: false
    }
}
</route>
```
- 某些根据权限判断再增加的路由，需要增加配置项且自行在route/index中动态addRoute(asyncRoutes)
```bash
<route>
{
    meta: {
        enabled: true,
        constant: false
    }
}
</route>
```

- 同时支持前端自定义路由和文件系统路由，前端自定义的路由文件配置项
``` js
<route>
{
    meta: {
        enabled: true,
        frontend: true
    }
}
</route>
```

#### script setup语法糖 + auto-imports
- vue3中使用composition-api进行开发，如果不熟悉composition-api,可以阅读Vue3[官方文档](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)进行学习，如果你已经熟悉 Composition API ，那么我们建议你在开发的时候，使用 [单文件组件script setup](https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6-script-setup) 语法糖进行开发，它将提高很多开发上的效率。

- 同时得益于 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 的特性，在script setup中导入相关api，该依赖会自动导入（默认支持vue vue-router pinia）
```js
<script setup>
#// 原先需要手动 import 相关 API
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const count = ref(0)
const doubled = computed(() => count.value * 2)

const route = useRoute()
const router = useRouter()
console.log(route.path)
router.push('/dashboard')
</script>
```

```bash
<script setup name="dashboard"> #name保证唯一，相当于vue 组件name
#// 现在直接使用即可
const count = ref(0)
const doubled = computed(() => count.value * 2)

const route = useRoute()
const router = useRouter()
console.log(route.path)
router.push('/dashboard')
</script>

```

#### eslint tslint
代码规则参考[@antfu/eslint-config](https://github.com/antfu/eslint-config)
- Single quotes, no semi
- Auto fix for formatting (aimed to be used standalone without Prettier)
- TypeScript, Vue, React out-of-box
- Lint also for json, yaml, markdown
- Sorted imports, dangling commas for cleaner commit diff
- Reasonable defaults, best practices, only one-line of config

eslint额外规则可在package.json中配置
```bash
  "eslintConfig": {
    "extends": "@antfu",
    "rules": {
      "import/no-mutable-exports": [
        "error"
      ],
      "no-console": "off"
    }
  }
```
ts额外规则可在tsconfig.json中配置

#### vue-i18n
官方文档[Vue-i18n](https://kazupon.github.io/vue-i18n/zh/started.html)
语言文件在locales文件夹中编写，采用yml配置
想了解yml配置的可阅读[yml参考文档](https://www.ruanyifeng.com/blog/2016/07/yaml.html)  [yml官方文档](https://yaml.org/spec/1.2.2/)
```bash
#用法demo
<script setup>
  const { t, locale } = useI18n()
  const changeLanguage = () => {
    locale.value = 'zh-CN'
  }
</script>
<template>
  <div @change="changeLanguage"></div>
  <div>t('intro.desc')</div>
</template>
```

#### pinia
vue3中尤雨溪推荐使用[pinia](https://pinia.vuejs.org/introduction.html)代替vuex
```bash
# demo
const useSettingStore = defineStore(
  // 唯一ID
  'settings',
  {
    state: () => ({
      app: {
        routeBaseOn: 'fileSystem',
      },
    }),
    getters: {},
    actions: {
    },
  },
)

export default useSettingStore
```
```bash
#.vue文件中使用
<script setup>
const setting = useSettingStore()
const routeBaseOn = $ref(setting.app.routeBaseOn)
</script>
```

#### theme style
Element Plus 默认提供一套主题，CSS 命名采用 BEM 的风格，方便使用者覆盖样式

可参考[element-plus主题配置文档](https://element-plus.gitee.io/zh-CN/guide/theming.html)
theme-chalk 使用SCSS编写而成。 你可以在 
packages/theme-chalk/src/common/var.scss
 文件中查找SCSS变量。全部scss变量可查看源代码 [var scss](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/common/var.scss)

##### 如何覆盖它？
 - 如果您的项目也使用了 SCSS，可以直接修改 Element Plus 的样式变量。 新建一个样式文件，例如 styles/element/index.scss：
 ```bash
 #// styles/element/index.scss
 #// 只需要重写你需要的即可
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': green,
    ),
  ),
);

 #// 如果只是按需导入，则可以忽略以下内容。
 #// 如果你想导入所有样式:
 #// @use "element-plus/theme-chalk/src/index.scss" as *;
 ```
 然后在你的项目入口文件中，导入这个样式文件以替换 Element Plus 内置的 CSS：
``` js
import { createApp } from 'vue'
import './styles/element/index.scss'
import ElementPlus from 'element-plus'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
```

 - 如果你正在使用vite，并且你想在按需导入时自定义主题。

使用 scss.additionalData 来编译所有应用 scss 变量的组件。
```bash
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
```

#### services
基于axios封装通用api
[axios官方文档](http://www.axios-js.com/)
所有的api建议放在services内，页面用到时import导入

#### husky lint-staged
[husky文档](https://www.breword.com/typicode-husky)
[lint-staged文档](https://github.com/okonet/lint-staged)
增加了pre-commit格式检查，不符合lint规定的不能commit，commit完建议查看下是否正确提交
#### git commit
增加了git commit 文本检查，格式参考commitlint.config.js
``` bash
git commit -m 'init: your description'

'init', // 初始化
'feat', // 新功能(feature)
'fix', // 修补bug
'docs', // 文档(documentation)
'style', // 格式、样式(不影响代码运行的变动)
'refactor', // 重构(即不是新增功能，也不是修改BUG的代码)
'perf', // 优化相关，比如提升性能、体验
'test', // 添加测试
'build', // 编译相关的修改，对项目构建或者依赖的改动
'ci', // 持续集成修改
'chore', // 构建过程或辅助工具的变动
'revert', // 回滚到上一个版本
'workflow', // 工作流改进
'mod', // 不确定分类的修改
'wip', // 开发中
'types', // 类型修改
'release', // 版本发布
```
#### env config
默认提供三套环境配置
- 开发环境 .env.development
- 测试环境 .env.test
- 生产环境 .env.production

开发者可根据实际业务需求进行扩展，如果对这块不熟悉，请阅读 [Vite - 环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html) 章节

```
import.meta.env[key]
```
#### index.html
[vite-plugin-html](https://github.com/vbenjs/vite-plugin-html) 提供配置index.html的能力，默认配置了
- HTML 压缩能力
- EJS 模版能力
#### unocss

[原子化css](https://antfu.me/posts/reimagine-atomic-css-zh)
更方便的使用css类名来定义css样式，同时支持按需加载，不会导致包体积变大

#### Icons

You can use icons from almost any icon sets by the power of [Iconify](https://iconify.design/).

It will only bundle the icons you use. Check out [unplugin-icons](https://github.com/antfu/unplugin-icons) for more details.

[icon地址](https://icones.netlify.app/collection/carbon) 加载icon包，点击icon有使用icon方法。
```bash
    #package.json
    #"@iconify-json/carbon": "^1.1.6",
    <div i-carbon-campsite />
```

#### ga分析

更多细节可参考[vue-gtag](https://matteo-gabriele.gitbook.io/vue-gtag/auto-tracking)
需要修改配置项中的id
``` js
app.use(VueGtag, {
  config: {
    id: 'GA_MEASUREMENT_ID', // https://analytics.google.com/ 中的衡量id
  },
}, router)
```

#### sentry 错误上报

接入可参考官方文档：[Vue3接入Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/#vue-3)

在 utils 文件夹增加 sentry.js：
``` js
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

Sentry.init({
    ... // 配置参考 sentry 文档
})
```

在 main.ts 中导入:
```js
import { initSentry } from '@/utils/sentry'

// 线上环境才上报
if (import.meta.env.VITE_APP_ENV === 'production') {
  initSentry(instance, router)
}
```

#### 组件文档自动生成

自动生成组件文档命令：
`npm run docs:create -- -t 'xxx\src\components\Page\Page.vue'
-t` 后面跟着绝对路径，右键复制文件的绝对路径即可。

运行组件文档：`npm run docs:dev`


### apifox
npm i @galaxy/apifox-cli -g --registry http://120.79.37.227:4873/
#### 更新所有接口
apifox-cli create --type=all

#### 按文件夹模块更新接口
apifox-cli create --type=module

#### 按文件夹模块更新接口 --prefixPath参数可以给接口path增加统一的前缀
apifox-cli create --type=module --prefixPath=testPrefix

#### 按api接口精确更新
apifox-cli create --type=api
