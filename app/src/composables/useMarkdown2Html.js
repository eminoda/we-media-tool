const MarkdownIt = require('markdown-it')
import { ref, onMounted, watch } from 'vue'

const md = new MarkdownIt()
  .use(require('markdown-it-highlightjs'))
  .use(require('./lineNumbers'))

// 设置包裹的标签，标签样式
const mdConfig = {
  toutiao: {
    h1: {
      open: '<h1>',
      close: '</h1>',
    },
    h2: {
      open: '<h1><strong>',
      close: '</strong></h1>',
    },
    h3: {
      open: '<strong>',
      close: '</strong>',
    },
    blockquote: {
      open: '<blockquote>',
      close: '</blockquote>',
    },
    a: {
      open: '<a class="link-text">',
    },
    table: {
      open: '<div class="tableWrapper"><table>',
      close: '</table></div>',
    },
    img: {
      open: '<div class="img-wrap"><img>',
      close: '</div>',
    },
  },
  weixin: {
    h1: {
      open: '<section class="h1"><span>',
      close: '</span></section>',
    },
    h2: {
      open: '<section class="h1"><span>',
      close: '</span></section>',
    },
    h3: {
      open: '<section class="h2"><span>',
      close: '</span></section>',
    },
    blockquote: {
      open: '<blockquote>',
      close: '</blockquote>',
    },
    img: {
      open: '<p style="text-align:center">',
      close: '</p>',
    },
    table: {
      open: '<div class="tableWrapper"><table>',
      close: '</table></div>',
    },
  },
}

const imageParse = (el) => {
  const filename = el.getAttribute('data-filename')
  const base64IsComplete = el.getAttribute('base64-is-complete')
  if (base64IsComplete && el.getAttribute('old-data-filename') == filename) {
    return
  }
  // 解析路径
  fetch('http://127.0.0.1:3000/image/base64?filename=' + filename).then(
    (response) => {
      response.text().then((data) => {
        el.src = data
        el.setAttribute('old-data-filename', filename)
        el.setAttribute('base64-is-complete', true)
      })
    }
  )
}

// const code2Canvas = (el) => {
//   html2canvas(el).then((canvas) => {
//     return canvas
//   })
// }

export default function useMarkdown2Html(mdStr, { mediaType = 'weixin' } = {}) {
  const mdValue = ref('')

  const mdRender = () => {
    const customTag = (openOrClose) => {
      return (...args) => {
        const [tokens, idx, options, env, self] = args
        const _tag = tokens[idx].tag
        const token = tokens[idx]
        const nextToken = tokens[idx + 1]
        // console.log(token, token.content)
        // 基础规则
        if (_tag == 'p') {
          // 空标签（blockquote）
          // if (token.type == 'paragraph_open') {
          //   if (!token.children) {
          //     return ''
          //   }
          // }
        } else if (_tag == 'blockquote') {
          // console.log(token)
          // if (token.type == 'blockquote_close') {
          //   return ''
          // }
          // if (
          //   nextToken &&
          //   nextToken.children &&
          //   nextToken.children.length == 1 &&
          //   nextToken.children[0].tag == 'p'
          // ) {
          //   const pTag = nextToken.children[0]
          //   if (!pTag.children) {
          //     console.log(nextToken)
          //     tokens[idx + 1] = null
          //   }
          // }
        }
        // 处理超链接
        else if (_tag == 'a') {
          // 需要展示超链接内容：【链接标题：链接内容】
          if (token.showHref) {
            nextToken.content = nextToken.content + ': ' + token.attrs[0][1]
          }
        }
        // 默认 image 标签下都是互联网图片
        else if (_tag == 'img') {
          return `
            <p class="img-wrap">${self.renderToken(tokens, idx, options)}</p>
          `
        } else if (_tag == 'code') {
          console.log()
          // return code2Canvas()
        }
        // li 下的元素是否为 a 标签。处理 ul/li 标签下的特殊展示
        else if (_tag == 'li') {
          // 相邻下一个的下一个标签
          const nextNextToken = tokens[idx + 2]
          if (
            nextNextToken &&
            nextNextToken.tag == '' &&
            nextNextToken.type == 'inline'
          ) {
            const isLinkToken =
              nextNextToken.children[0] && nextNextToken.children[0].tag == 'a'
            if (isLinkToken) {
              nextNextToken.children[0].showHref = true
            }
          }
        }
        // 正文
        else if (_tag == '') {
          const content = token.content
          // hexo 图片
          if (content.indexOf('asset_img ') != -1) {
            const str = content.split('asset_img ')[1]
            const [filename, title] = str.split(' ')
            // 构建图片标签
            token.type = 'image'
            token.tag = 'img'
            token.attrs = [
              // 设置预览图片
              [
                'src',
                `http://127.0.0.1:3000/image/preview?filename=${filename}`,
              ],
              ['alt', title],
              ['data-filename', content],
              // 替换base64图片
              ['onload', `javascript:(${imageParse})(this)`],
            ]
            return `<p class="img-wrap">${self.renderToken(
              tokens,
              idx,
              options
            )}</p>`
          } else {
            return content
          }
        }

        // 规则
        if (mdConfig[mediaType][_tag] && openOrClose) {
          return mdConfig[mediaType][_tag][openOrClose]
        }
        return self.renderToken(tokens, idx, options)
      }
    }
    // 段落
    md.renderer.rules.paragraph_open = customTag('open')
    // 引用
    md.renderer.rules.blockquote_open = customTag('open')
    md.renderer.rules.blockquote_close = customTag('close')
    // 标题
    md.renderer.rules.heading_open = customTag('open')
    md.renderer.rules.heading_close = customTag('close')
    // 超链接
    md.renderer.rules.link_open = customTag('open')
    // 图片
    md.renderer.rules.image = customTag('open')
    // ul
    md.renderer.rules.bullet_list_open = customTag('open')
    md.renderer.rules.bullet_list_close = customTag('close')
    // li
    md.renderer.rules.list_item_open = customTag('open')
    md.renderer.rules.list_item_close = customTag('close')
    // table
    md.renderer.rules.table_open = customTag('open')

    // md.renderer.rules.fence = customTag()
    // md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    //   return ''
    // }
    md.renderer.rules.text = customTag()
    mdValue.value = md.render(mdStr.value)
  }

  watch(mdStr, mdRender)

  onMounted(mdRender)
  return { mdValue, mdRender }
}
