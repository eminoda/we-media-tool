<template>
  <div id="container"></div>
</template>

<script>
import * as monaco from 'monaco-editor';
export default {
  data () {
    return {
      editor: null,
      value: ['# 标题1', '## 标题2', '文字', '', '${assets_image 2.png}', '',`\`\`\`js
console.log(123)

function test(){
    
}
\`\`\`
`,
        `![图片](https://t7.baidu.com/it/u=2435923518,4120240558&fm=218&app=137&size=f242,150&n=0&f=JPEG&fmt=auto?s=7FA217665D065645088E0C4C0300F0BA&sec=1650819600&t=20cc5df43f874717c1ebff23186b6e1c)`
      ].join('\n')
    }
  },
  mounted () {
    monaco.editor.setTheme('vs-dark')
    const model = monaco.editor.createModel(this.value, 'markdown')

    this.editor = monaco.editor.create(document.getElementById('container'), {
      model,
      language: 'markdown',
      fontSize: 18,
      minimap: {
        enabled: true
      }
    });



    this.editor.onDidChangeModelContent(() => {
      this.$emit('change', model.getValue())
    })

    setTimeout(() => {
      model.setValue(this.value);
    }, 100)
  }
}
</script>

<style lang="less" scoped>
#container {
  height: 100vh;
}
</style>