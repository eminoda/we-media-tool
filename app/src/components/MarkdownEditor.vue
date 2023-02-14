<template>
  <div id="container"></div>
</template>

<script>
import * as monaco from 'monaco-editor'
export default {
  data() {
    return {
      editor: null,
      value: [].join('\n'),
    }
  },
  mounted() {
    monaco.editor.setTheme('vs-dark')
    const model = monaco.editor.createModel('', 'markdown')

    this.editor = monaco.editor.create(document.getElementById('container'), {
      model,
      language: 'markdown',
      automaticLayout: true,
      fontSize: 18,
      wordWrap: true,
      minimap: {
        enabled: true,
      },
    })

    this.editor.onDidChangeModelContent(() => {
      const article = model.getValue()
      /**
       * 处理不规范的加粗文字
       * aaa ** xxx **bbb => aaa **xxx** bbb
       */
      const standardLineTexts = article.split('\n').map((text) => {
        let newLineText = text
        let count = text.split('**').length
        while (count > 0) {
          const irregularReg =
            /(\s{0,3})\*\*(\s*)([\u4e00-\u9fa5_a-zA-Z0-9（）]+\s*[\u4e00-\u9fa5_a-zA-Z0-9（）]+)(\s*)\*\*(\s{0,3})/g
          newLineText = text.replace(irregularReg, ' **$3** ')
          // 无变动
          if (text == newLineText) {
            count = 0
          }
          count--
        }
        return newLineText
      })
      this.$emit('change', standardLineTexts.join('\n'))
    })

    setTimeout(() => {
      fetch('http://127.0.0.1:3000/mock').then((response) => {
        response.text().then((data) => {
          model.setValue(data)
        })
      })
    }, 1000)
  },
}
</script>

<style lang="less" scoped>
#container {
  height: 100vh;
}
</style>
