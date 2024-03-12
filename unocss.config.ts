/*
 * @FilePath: /Document-System/unocss.config.ts
 * @Description:
 */
import {
  defineConfig,
  presetAttributify,
  // presetIcons,
  presetUno,
  // presetWebFonts,
  // transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

// 主色/品牌色
const mainColor = ['#1453FF', '#ffffff', '#141222']

const compelColor = [
  // 辅助色/多色系
  ...['#5F31F5', '#8B14FF', '#2414FF', '#1453FF', '#2181FF', '#59B2ED', '#17C9FF', '#6DECF5', '#84E3CA'],
  // 辅助色/同色系
  ...['#E0252B', '#F602E', '#F602E', '#0DC986'],
  // 文字颜色
  ...['#626569'],
]

export default defineConfig({
  rules: [
    ['w-100%', { width: '100%' }],
    [/^main-bg-(\d+)$/, match => ({ 'background-color': mainColor[match[1]] })],
    [/^main-text-(\d+)$/, match => ({ color: mainColor[match[1]] })],
    [/^compel-bg-(\d+)$/, match => ({ 'background-color': compelColor[match[1]] })],
    [/^compel-text-(\d+)$/, match => ({ color: compelColor[match[1]] })],
    [/^main-text-opacity-(\d+)$/, match => ({ color: `rgba(20, 18, 34, ${match[1]}%)` })],
  ],
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    // presetIcons({
    //     scale: 1.2,
    //     warn: true,
    // }),
    // presetWebFonts({
    //     fonts: {
    //         sans: 'DM Sans',
    //         serif: 'DM Serif Display',
    //         mono: 'DM Mono',
    //     },
    // }),
  ],
  // transformers: [
  //   transformerDirectives(),
  //   transformerVariantGroup(),
  // ],
})
