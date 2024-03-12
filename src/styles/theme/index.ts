import { updateCSS } from './utils'

// 主题常量
enum Themes {
  default = 'default',
  dark = 'dark',
}

const THEME_KEY = 'THEME'

const setTheme = async (store: any, theme?: Themes) => {
  const _theme = theme ?? localStorage.getItem(THEME_KEY) ?? Themes.default

  if (store.state.theme.theme !== _theme) {
    // 动态引入主题文件
    let promise
    switch (_theme) {
    case Themes.dark:
      promise = import('./dark.json')
      break
    default:
      promise = import('./default.json')
      break
    }
    const json: Record<string, string> = (await promise).default
    updateCSS(json)
    localStorage.setItem(THEME_KEY, _theme)
    store.commit('theme/setTheme', _theme)
  }
}

export { Themes }
export default setTheme
