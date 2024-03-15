/// <reference types="vitest" />

import path from 'path'
import fs from 'fs'
import electron from 'vite-plugin-electron/simple'
import type { ConfigEnv } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { createHtmlPlugin } from 'vite-plugin-html'
import Layouts from 'vite-plugin-vue-layouts'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import iconfontLoader, { FileSystemIconLoader } from '@galaxy-fe/vite-plugin-unocss-iconfont'
// import ElementPlus from '@galaxy-fe/vite-plugin-element-message-style-resolver'
import autoOptimizeDeps from '@galaxy-fe/vite-plugin-auto-optimize'
import viteCompression from 'vite-plugin-compression'
import electronRenderer from 'vite-plugin-electron-renderer'
// sentry

const autoprefixer = require('autoprefixer')

export default ({ mode, command }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())
  console.log('------env', env, mode)
  // 全局 scss 资源
  const scssResources: string[] = []
  fs.readdirSync('src/styles/resources').forEach((dirname: string) => {
    if (fs.statSync(`src/styles/resources/${dirname}`).isFile())
      scssResources.push(`@use "src/styles/resources/${dirname}" as *;`)
  })
  const electronArr = (!mode.includes('h5') && mode !== 'development') ? [
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: 'electron/preload.ts',
      },
      // Optional: Use Node.js API in the Renderer process
      renderer: {},
    }),
    electronRenderer(),
    polyfillExports(),
  ] : []
  return defineConfig({
    // base: './',
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssResources.join(''),
        },
      },
      postcss: {
        plugins: [
          autoprefixer(),
        ],
      },
      // postcss: require('./postcss.config.js'),
    },
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      host: '0.0.0.0',
      port: 10308,
      hmr: true,
      cors: true,
      proxy: {
        // '/api/rest': {
        //     target: 'http://wiki.galaxy-immi.com:8090/',
        //     changeOrigin: true,
        //     rewrite: path => path.replace(/\/api/, ''),
        // },
        // '/api': {
        //   target: 'http://smart-h5-test.galaxy-immi.com:8090/prod-api/',
        //   changeOrigin: true,
        //   rewrite: path => path.replace(/\/api/, ''),
        // }
      },
    },
    build: {
      sourcemap: mode === 'prod',
      minify: 'terser',
      outDir: 'dist-electron',
      terserOptions: {
        compress: {
          // 移除console.log和console.info配置项参考： https://github.com/terser/terser#compress-options
          drop_console: mode === 'prod' ? ['log', 'info'] : true as any,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: [],
    },
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
      // iconfont 转换为 svg,
      // 使用如下
      // <el-icon size="16px" color="burlywood">
      //      <icon-font-btn_out />
      // </el-icon>
      iconfontLoader({
        cookie: 'cna=Xl2hHHeH5GYCAXFZYa3NFmsI; EGG_SESS_ICONFONT=U9fbDOeaopkgF8Nw-zVwcgoQJNiGBLVo9e4m0Azk-Cw_Qo7u53eQH6b3oo1pOEgt8eSlAsgJPC5zN7anUpHmnuuZbltZUnIJP69xPZCv-pz8RY86EODkr3Nf2zat7rt3XZ3D1T-wzQ7leAV41ukKo-iZTlTStPlm8K2zHhxRUCm06QqgK9kqMRsrjqekTSOMOc9iDKlUW6Ks02ekylUO5BgeY0lH0NBwXTby8Cxf34UlVG0eQUOWuRhsB89tt5fD; locale=zh-cn; xlly_s=1; ctoken=_zwmQdUWzsOAfXp5NIykDT4K; u=5509081; u.sig=DQk-Ka_8iGU9qoHZrfIxUajSHTJndoXdJHQwxO4hdjk; isg=BJOTxA9Y8xSNb7-kLS6wgXS0Ihe9SCcKu-96j0WwY7LpxLBmzBp6W8lS_jSq5H8C',
        pid: '4011647',
        ctoken: '_zwmQdUWzsOAfXp5NIykDT4K',
      }),
      Icons({
        customCollections: {
          font: FileSystemIconLoader(svg => svg.replace(/fill="#[\w\d]+"/g, 'fill="currentColor"').replace(/style="[^"]*"/g, '')),
        },
      }),
      // 解决tsx中导入message组件不会自动导入样式问题
      // ElementPlus(),
      mode === 'prod'
        ? sentryVitePlugin({
          org: 'sentry',
          project: 'document-system',
          url: 'https://dev-sentry.galaxy-immi.com/',

          // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
          // and need `project:releases` and `org:read` scopes
          authToken: 'd2febfa7b445484e8f8475b3b6883f3c26e704bac2e5453b8e6fdfde7a646af4',
          release: {
            cleanArtifacts: true,
            name: process.env.npm_package_version,
            uploadLegacySourcemaps: {
              paths: ['./main'],
              // urlPrefix: '~/assets',
              ignore: ['./node_modules'],
            },
          },
        })
        : null,
      svgLoader(),
      vueJsx({
        transformOn: true,
      }),
      Vue({
        // reactivityTransform: true,
      }),
      ...electronArr,
      viteMockServe({
        mockPath: 'mock',
        enable: command !== 'build',
      }),
      vueSetupExtend(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: 'index',
          },
        },
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        exclude: ['**/C/*.vue'],
      }),
      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue/macros',
          'vue-router',
          {
            vue: [
              'defineProps',
              'defineEmits',
              'defineExpose',
              'withDefaults',
            ],
          },
          'pinia',
          '@vueuse/core',
        ],
        resolvers: [
          ElementPlusResolver({
            importStyle: false,
          }),
          IconsResolver({
            prefix: 'Icon',
            customCollections: ['font'],
          }),
        ],
        dts: true,
        dirs: [
          './src/composables',
          'src/store',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true,
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
            customCollections: ['font'],
            // enabledCollections: ['ep'],
          }),
          ElementPlusResolver({
            importStyle: false,
          }),
        ],
        include: [/\.vue$/, /\.vue\?vue/, /\.jsx?$/, /\.tsx?$/],
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss({
        mode: 'vue-scoped',
      }),
      autoOptimizeDeps(),
      viteCompression({
        verbose: true,
        algorithm: 'gzip', // 选择压缩算法（gzip、brotli、deflate）
        ext: '.gz', // 压缩文件的扩展名
        threshold: 10240, // 压缩的最小文件大小（以字节为单位）（默认为 10KB）
        deleteOriginFile: false, // 如果要删除原始的未压缩文件，请将其设置为 true
      }),
    ],
  })
}
