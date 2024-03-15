import MarkdownIt from 'markdown-it/dist/markdown-it'
import highlight from 'highlight.js'
import 'highlight.js/styles/an-old-hope.css'

export const IMG_BLOCK_KEY = 'img-block'
export function chatContentReplaceBlock(content = '') {
  const regex = new RegExp(`\`\`\`(${IMG_BLOCK_KEY})\\n([\\s\\S]*?)\`\`\``, 'g')
  return content.replace(regex, '').trim()
}

export function replaceSensitiveText(text: string) {
  // 1. http link
  text = text.replace(/(?<=https?:\/\/)[^\s]+/g, 'xxx')
  // 2. nx-xxx 全部替换成xxx
  text = text.replace(/ns-[\w-]+/g, 'xxx')

  return text
}

export function getErrText(err: any, def = '') {
  const msg: string = typeof err === 'string' ? err : err?.message || def || ''
  msg && console.log('error =>', msg)
  return replaceSensitiveText(msg)
}

export const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  xhtmlOut: true,
  typographer: true,
  langPrefix: 'hljs language-',
  highlight(str, lang) {
    if (lang && highlight.getLanguage(lang)) {
      try {
        // 当前时间加随机数生成唯一的id标识
        let d = new Date().getTime()
        if (window.performance && typeof window.performance.now === 'function') {
          d += performance.now()
        }
        // 唯一随机数生成
        const codeIndex = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
          /[xy]/g,
          (c) => {
            const r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
          },
        )
        // 语言
        const languageName = `<b class="language-name">${lang}</b>`
        const textAreaHtml = `<textarea class="copy-textarea" id="copy${codeIndex}">${str}</textarea>`
        const copyButton = `<button class="copy-btn iconfont icon-icon_fuzhi"  data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}" type="button"></button>`
        return (
          `<pre class="hljs language-${lang}"><code>${highlight.highlight(lang, str, true).value}${languageName}${copyButton}${textAreaHtml}</code></pre>`
        )
      }
      catch (__) { }
    }
  },
})

export enum ChatRoleEnum {
    System = 'System',
    Human = 'Human',
    AI = 'AI',
    Function = 'Function',
    Tool = 'Tool',
}
export enum ChatCompletionRequestMessageRoleEnum {
    'System' = 'system',
    'User' = 'user',
    'Assistant' = 'assistant',
    'Function' = 'function',
    'Tool' = 'tool',
}

const chat2Message = {
  [ChatRoleEnum.AI]: ChatCompletionRequestMessageRoleEnum.Assistant,
  [ChatRoleEnum.Human]: ChatCompletionRequestMessageRoleEnum.User,
  [ChatRoleEnum.System]: ChatCompletionRequestMessageRoleEnum.System,
  [ChatRoleEnum.Function]: ChatCompletionRequestMessageRoleEnum.Function,
  [ChatRoleEnum.Tool]: ChatCompletionRequestMessageRoleEnum.Tool,
}

export const adaptChat2GptMessages = ({
  messages,
  reserveId,
}) => {
  return messages.map(item => ({
    ...(reserveId && { dataId: item.dataId }),
    role: chat2Message[item.obj],
    content: item.value || '',
  }))
}
