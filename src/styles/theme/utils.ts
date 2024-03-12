import { updateCSS as updateCSSVars } from 'rc-util/lib/Dom/dynamicCSS'

const defaultPrefix = 'hk'
const dynamicStyleMark = `hk-${Date.now()}-${Math.random()}`

export const updateCSS = (
  themeJson: Record<string, string>,
  prefix: string = defaultPrefix,
) => {
  const reg = /[A-Z]/g
  const cssList = Object.keys(themeJson).map((key) => {
    const val = key.replace(reg, v => `-${v.toLowerCase()}`)
    return `--${prefix}-${val}: ${themeJson[key]};`
  })
  updateCSSVars(
    `
        :root {
            ${cssList.join('\n')}
          }
        `,
    dynamicStyleMark,
  )
}
