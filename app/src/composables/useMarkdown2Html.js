const MarkdownIt = require('markdown-it')
import { ref, onMounted, watch } from 'vue'
import { toutiao, weixin, csdn, juejin, zhihu } from '../config/mdStyle'

// 设置包裹的标签，标签样式
const mdConfig = {
  toutiao,
  weixin,
  csdn,
  juejin,
  zhihu,
}

const bufferImage2Base64 = (el) => {
  const filename = el.getAttribute('data-filename')
  const base64IsComplete = el.getAttribute('base64-is-complete')
  if (base64IsComplete && el.getAttribute('old-data-filename') == filename) {
    return
  }
  // 将 hexo 本地图片转为 base64 格式，用于文本复制
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

export default function useMarkdown2Html(
  mdStr,
  { mediaType = 'weixin', isLine, isCode2Image } = {}
) {
  const mdValue = ref('')

  const mdRender = (mediaType) => {
    const md = new MarkdownIt()
      .use(require('markdown-it-highlightjs'))
      .use((mdStr) => {
        return require('../config/lineNumbers')(mdStr, { isLine, isCode2Image })
      })
    const customTag = (openOrClose) => {
      return (...args) => {
        const [tokens, idx, options, env, self] = args
        const _tag = tokens[idx].tag
        const token = tokens[idx]
        const nextToken = tokens[idx + 1]
        // console.log(token, token.content)
        if (_tag == 'p') {
          // 基础规则
        } else if (_tag == 'blockquote') {
          // 引用
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
          // hexo 本地图片
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
              ['onload', `javascript:(${bufferImage2Base64})(this)`],
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
        // console.log(mdConfig, mediaType)
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

  watch(mdStr, () => {
    console.log('watch')
    mdRender(mediaType)
  })
  onMounted(() => {
    mdRender(mediaType)
  })
  return { mdValue, mdRender }
}
