import fs from 'fs'
export default function (include = [], exclude = []) {
  return {
    // 预购建npm包以及按需引入UI包，防止开发模式下频繁的reloading
    name: 'auto-optimizeDeps',
    async configureServer(server) {
      exclude = ['rc-util']
      include = [
        '@galaxy/swrv/dist/index',
        'lodash-es',
        'element-plus/es',
        'lodash-unified',
      ]
      const json = JSON.parse(
        fs.readFileSync(`${process.cwd()}/package.json`, {
          encoding: 'utf-8',
        }),
      )

      const optimizeDeps = Object.keys(json.dependencies)
        .filter(item => !exclude.includes(item))
        .concat(include)
      function findElementUi() {
        const arr = []
        const esComponentsFolder = 'element-plus/es/components'
        fs.readdirSync(`node_modules/${esComponentsFolder}`).forEach(
          (dirname) => {
            if (
              !fs
                .statSync(
                  `node_modules/${esComponentsFolder}/${dirname}`,
                )
                .isFile()
            )
              arr.push(
                `${esComponentsFolder}/${dirname}/style/index`,
              )
          },
        )
        return arr
      }
      const arr = findElementUi()
      server.config.optimizeDeps.include = Array.from(
        new Set([
          ...(server.config.optimizeDeps.include || []),
          ...arr,
          ...optimizeDeps,
        ]),
      )
    },
  }
}
