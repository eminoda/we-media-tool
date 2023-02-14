<template>
  <div class="wmt-wrap">
    <div class="wmt" :class="'editor-' + mediaType">
      <div v-html="mdValue"></div>
    </div>
  </div>
</template>

<script>
const ClipboardJS = require('clipboard')
const axios = require('axios')
import useMarkdown2Html from '@/composables/useMarkdown2Html'
import { toRefs, watchEffect } from 'vue'
export default {
  props: {
    value: {
      type: String,
      default: '等待编辑...',
    },
    mediaType: String,
  },
  data() {
    return {}
  },
  methods: {
    async coverToBase64() {
      const imageSelectors = document.querySelectorAll('.wmt img')
      const promiseList = Array.from(imageSelectors).map((selector) => {
        const url =
          'http://127.0.0.1:3000/image/base64?filename=' +
          selector.getAttribute('data-filename')
        return new Promise((resolve) => {
          axios.get(url).then(({ data }) => {
            selector.src = data
            resolve(data)
          })
        })
      })
      return Promise.all(promiseList)
    },
    async handleCopy() {
      // html2canvas(document.querySelector('pre')).then(function (canvas) {
      //   document.body.appendChild(canvas);
      // });
      // await this.coverToBase64()
      const clipboard = new ClipboardJS('#copy-btn')
      clipboard.on('success', function (e) {
        e.clearSelection()
      })
    },
  },
  watch: {
    value(newValue) {
      if (!newValue) return
    },
    mediaType(newValue) {
      this.mdRender(newValue)
    },
  },
  setup(props) {
    const { value, mediaType } = toRefs(props)
    const { mdValue, mdRender } = useMarkdown2Html(value, {
      mediaType: mediaType.value,
      isLine: false,
      isCode2Image: false,
    })
    return { mdValue, mdRender }
  },
}
</script>

<style lang="less" scoped>
.wmt-wrap {
  min-height: 500px;
  margin: 0 64px 30px;
  font-family: PingFang SC, Arial, Hiragino Sans GB, WenQuanYi Micro Hei,
    Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #222;
  font-size: 17px;
}
</style>
