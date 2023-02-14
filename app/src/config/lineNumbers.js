// markdown-it plugin for generating line numbers.
// It depends on preWrapper plugin.
const html2canvas = require('html2canvas')
const md5 = require('md5')

module.exports = (md, { isLine = false, isCode2Image = false } = {}) => {
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) => {
    // 解析代码内容
    let rawCode = fence(...args)

    if (isLine) {
      const classIndex = rawCode.indexOf('hljs') + 4
      rawCode =
        rawCode.substring(0, classIndex) +
        ' hljs-line ' +
        rawCode.substring(classIndex)
    }

    let code = rawCode.slice(
      rawCode.indexOf('<code'),
      rawCode.indexOf('</code>')
    )
    code = code.slice(code.indexOf('>') + 1)

    let lineNumbersWrapperCode = ''
    if (isLine) {
      // 生成行号
      const lines = code.split('\n')
      const lineNumbersCode = [...Array(lines.length - 1)]
        .map(
          (line, index) => `<span class="line-number">${index + 1}</span><br>`
        )
        .join('')
      lineNumbersWrapperCode = `<div class="line-numbers-wrapper">${lineNumbersCode}</div>`
    }

    if (isCode2Image) {
      // 创建临时空间渲染代码 canvas
      const codeHtmlNode = document.createElement('codeHtmlNode')
      const id = 'code' + md5(code)

      const tempId = 'temp' + id
      codeHtmlNode.id = tempId
      codeHtmlNode.style['display'] = 'inline-block'
      codeHtmlNode.style['min-width'] = '500px'
      codeHtmlNode.style['border-radius'] = '10px'
      codeHtmlNode.innerHTML = `
    ${
      rawCode.slice(0, rawCode.indexOf('<pre>') + 5) +
      lineNumbersWrapperCode +
      rawCode.slice(rawCode.indexOf('<pre>') + 5)
    }`
      document.body.appendChild(codeHtmlNode)

      // 替换至文章内，删除临时空间
      const imageParse = (id) => {
        // 通过 canvas 转图片
        html2canvas(codeHtmlNode).then((canvas) => {
          const img = new Image()
          img.src = canvas.toDataURL('image/png')
          document.getElementById(id).appendChild(img)
          // 等待 vue 解析完毕，移除旧元素
          setTimeout(() => {
            document.body.removeChild(codeHtmlNode)
          }, 10)
          return canvas
        })
      }

      imageParse(id)
      return `<p class="img-wrap" id="${id}"></p>`
    } else {
      // 直接展示代码
      return `${
        rawCode.slice(0, rawCode.indexOf('<pre>') + 5) +
        lineNumbersWrapperCode +
        rawCode.slice(rawCode.indexOf('<pre>') + 5)
      }`
    }
  }
}
