/*
 * @FilePath: /Document-System/src/directives/index.ts
 * @Description:
 */
import type { App } from 'vue'
import inputRules from './inputRules'
import secret from './secret'

const directives = { inputRules, secret }

// todo: 自动导入

export default function directive(app: App) {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key])
  })
}
