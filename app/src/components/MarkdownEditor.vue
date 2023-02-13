<template>
  <div id="container"></div>
</template>

<script>
import * as monaco from 'monaco-editor'
export default {
  data() {
    return {
      editor: null,
      value: [
        '# 标题1',
        '> 引用',
        '## 标题2',
        '我的妈妈倒是个异类，[超链接](https://www.baidu.com/)有着白酒般**火辣**的性格。偶有小错，就会对我们厉声呵斥，那样子像个将军在呵斥犯了错的士兵，坐在椅子上一言不发了。',
        '',
        `![图片说明](https://t7.baidu.com/it/u=2397542458,3133539061&fm=193&f=GIF)`,
        '',
        '```javascript',
        '```',
        '',
        'assets_image(2.png)',
        '',
        '我的妈妈倒是个异类，有着白酒般**火辣**的性格。偶有小错，就会对我们厉声呵斥，那样子像个将军在呵斥犯了错的士兵，坐在椅子上一言不发了。',
        '说明',
        '- 我的妈妈倒是个异类，有着白酒般**火辣**的性格。',
        '- 我的妈妈倒是个异类，有着白酒般**火辣**的性格。',
        '# 参考',
        '- [yaodb](https://www.yaobase.com/)',
        '- [yaodb](https://www.yaobase.com/)',
      ].join('\n'),
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

    // this.editor.onDidContentSizeChange(() => {
    //   document.getElementById('container').style.height = `${this.editor.getContentHeight()}px`;
    //   this.editor.layout({ height: `${this.editor.getContentHeight()}px` })
    // })

    this.editor.onDidChangeModelContent(() => {
      // 处理加粗 markdonw 空格问题
      const articles = model.getValue().split('\n')

      this.$emit(
        'change',
        articles
          .map((lineText) => {
            let newLineText = lineText
            let count = lineText.split('**').length
            while (count > 0) {
              newLineText = lineText.replace(
                /\*\*(\s*)([\u4e00-\u9fa5_a-zA-Z0-9]+)(\s*)\*\*/g,
                '**$2**'
              )
              if (lineText == newLineText) {
                count = 0
              }
              count--
            }
            return newLineText
          })
          .join('\n')
      )
    })

    setTimeout(() => {
      fetch('http://127.0.0.1:3000/mock').then((response) => {
        response.text().then((data) => {
          model.setValue(data)
        })
      })
    }, 100)
  },
}
</script>

<style lang="less" scoped>
#container {
  height: 100vh;
}
</style>
