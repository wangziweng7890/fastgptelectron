// sidebar.ts
import fs from 'fs'
type source = {
  text: string
  link: string
}
let componentSource: source[] = []
fs.readdirSync(process.cwd() + '/docs/component').forEach((dirname: string) => {
  componentSource.push({
    text: dirname.split('.md')[0],
    link: `/component/${dirname}`
  })
})
export default {
  '/component/': getComponentsSidebar(),
  '/guide/': getGuideSidebar(),
}

function getComponentsSidebar() {
  return [
    {
      isGroup: true,
      text: '组件',
      children: [
        ...componentSource
      ],
    },
  ]
}

function getGuideSidebar() {
  return [
    {
      isGroup: true,
      text: '指南',
      children: [
        { text: '介绍', link: '/guide/intro.md' },
        { text: '快速开始', link: '/guide/installation.md' },
      ],
    },
  ]
}

