const MarkdownIt = require('markdown-it')
import { ref, onMounted, watch } from 'vue'

const md = new MarkdownIt()
  .use(require('markdown-it-highlightjs'))
  .use(require('./lineNumbers'))

const mdConfig = {
  toutiao: {
    heading: {
      h1: {
        open: '<h1>',
        close: '</h1>',
      },
      h2: {
        open: '<p><strong>',
        close: '</strong></p>',
      },
      h3: {
        open: '<div>',
        close: '</div>',
      },
    },
  },
  weixin: {
    heading: {
      h1: {
        open: '<h2 class="wx_h1" style="color:red;">',
        // open: `<h2 class="wx_h1" style="${'background-image: url(https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg);background-size: contain;background-repeat: no-repeat;background-position: center;'}">`,
        close: '</h2>',
      },
      h2: {
        open: '<p><strong>',
        close: '</strong></p>',
      },
      h3: {
        open: '<div>',
        close: '</div>',
      },
    },
  },
}
const mediaStyle = `<style>
      .wx_h1{
            font-size: 20px;
    text-align: center;
    background: transparent;
    position: relative;
      }
      .wx_h1::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-image: url(https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 0;
  }
      </style>`

const mediaType = 'weixin'
export default function useMarkdown2Html(mdStr) {
  const mdValue = ref('')

  const mdRender = () => {
    md.renderer.rules.heading_open = (tokens, idx) => {
      const tag = tokens[idx].tag
      if (mdConfig[mediaType].heading[tag]) {
        return mdConfig[mediaType].heading[tag].open
      } else {
        return `<${tag}>`
      }
    }
    md.renderer.rules.heading_close = (tokens, idx) => {
      const tag = tokens[idx].tag
      if (mdConfig[mediaType].heading[tag]) {
        return mdConfig[mediaType].heading[tag].close
      } else {
        return `</${tag}>`
      }
    }
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
      const tag = tokens[idx].tag
      // TODO: 处理网络图片
      //   if (tag == 'img') {
      //     tokens[idx].attrs = [
      //       ['src', 'http://127.0.0.1:3000/image/preview?filename=2.png'],
      //       ['alt', 'abc'],
      //     ]
      //   }
      return self.renderToken(tokens, idx, options)
    }
    md.renderer.rules.text = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const content = token.content
      if (content.indexOf('assets_image') != -1) {
        token.type = 'image'
        token.tag = 'img'
        token.attrs = [
          ['src', 'http://127.0.0.1:3000/image/preview?filename=2.png'],
          ['alt', 'abc'],
          ['data-filename', '2.png'],
        ]
        return self.renderToken(tokens, idx, options)
      }
      return tokens[idx].content
    }
    mdValue.value = mediaStyle + md.render(mdStr.value)
  }

  watch(mdStr, mdRender)

  onMounted(mdRender)
  return { mdValue, mdRender }
}
