import { defaultTheme, viteBundler } from 'vuepress'
import navbar from './configs/navbar'
import sidebar from './configs/sidebar'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import v2 from 'vuepress2-plugin-demo-block-edit'
import svgLoader from 'vite-svg-loader'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import path from 'path'
import fs from 'fs'
import { getDirname, path } from '@vuepress/utils'
import autoOptimizeDeps from '../../plugin/auto-optimizeDeps.js'
import Unocss from 'unocss/vite'

const __dirname = getDirname(import.meta.url)

const scssResources: string[] = []
const basePath = path.resolve(__dirname, '../../src/styles/resources')
fs.readdirSync(basePath).forEach((dirname: string) => {
  if (fs.statSync(`${basePath}/${dirname}`).isFile())
    scssResources.push(`@use "${basePath}/${dirname}" as *;`)
})
export default {
  lang: 'zh-CN',
  title: '组件文档',
  description: '基于Vue3 + Vuepress的UI组件库',
  theme: defaultTheme({
    navbar,
    sidebar,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdatedText: '上次更新',
    contributorsText: '贡献者',
  }),
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../../src'),
          '~': `${path.resolve(__dirname, '../../src')}`
        }
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: scssResources.join(''),
          },
        },
        // postcss: require('./postcss.config.js'),
      },
      plugins: [
        Unocss({
          mode: 'vue-scoped',
        }),
        autoOptimizeDeps(),
        vueJsx({
          transformOn: true,
        }),
        svgLoader(),
        // MarkdownTransform(),
        Components({
          dirs: ['../../src/components'],
          allowOverrides: true,
          // allow auto import and register components used in markdown
          resolvers: [
            ElementPlusResolver({
              importStyle: 'sass',
            }),
          ],
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        }),
        AutoImport({
          dirs: ['../../src/components'],
          include: [
            /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
            /\.vue$/, /\.vue\?vue/, // .vue
            /\.md$/, // .md
          ],
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
              importStyle: 'sass',
            }),
          ],
          dts: true,
          vueTemplate: true,
        }),],
    }
  }),
  plugins: [
    v2()
    // registerComponentsPlugin({
    //     componentsDir: path.resolve(__dirname, 'components')
    // }),
  ]
}

