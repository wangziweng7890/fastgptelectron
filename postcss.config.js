/*
 * @FilePath: /Document-System/postcss.config.js
 * @Description:
 */
module.exports = {
  plugins: [require('./plugin/postcss-selector-namespace')({
    namespace(cssfile) {
      // if (cssfile) { // 本地开发时不需要加前缀
      //     return '.master-application'
      // }
      if (/lang\.module\.scss|scoped=true|element-plus|reset\/tailwind\.css/.test(cssfile))
        return ''
      // return '.你的样式'
    },
    dropRoot: true,
  }),
  ],

}

// const postcssNamespace = require('postcss-selector-namespace')

// module.exports = {
//     plugins: [
//         postcssNamespace({
//             // 添加 namespace 的类名，可以自定义
//             namespace(css = '') {
//                 if (/lang\.module\.scss|scoped=true|element-plus | crm\/index\.vue | reset\/tailwind\.css/.test(css))
//                     return ''
//                 return '.master-application'
//                 // return `.master-application ${css}`
//             },
//             // 不添加 namespace 的类名，需要排除的列表，可选
//             exclude: /\.btn/,
//         }),
//     ],
// }
