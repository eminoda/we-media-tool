// markdown-it plugin for generating line numbers.
// It depends on preWrapper plugin.
const html2canvas = require('html2canvas')
const md5 = require('md5');

module.exports = (md) => {
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) => {
    // 得到 code 代码块生成结果
    const rawCode = fence(...args)
    let code = rawCode.slice(
      rawCode.indexOf('<code'),
      rawCode.indexOf('</code>')
    )
    code = code.slice(code.indexOf('>') + 1)
    // 计算总行数
    const lines = code.split('\n')
    const lineNumbersCode = [...Array(lines.length - 1)]
      .map((line, index) => `<span class="line-number">${index + 1}</span><br>`)
      .join('')
    // 定义行号模板
    const lineNumbersWrapperCode = `<div class="line-numbers-wrapper">${lineNumbersCode}</div>`

    // 生成 div 父节点，挂载含行号的代码块
    const codeHtmlNode = document.createElement('codeHtmlNode')
    const id = 'code' + md5(lineNumbersCode)

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
    // document.body.appendChild(codeHtmlNode)

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

    // imageParse(id)
    // return `<p class="img-wrap" id="${id}"></p>`
    return `${
      rawCode.slice(0, rawCode.indexOf('<pre>') + 5) +
      '<div style="position:relative;height:auto;">'+
      lineNumbersWrapperCode +
      '</div>'+
      rawCode.slice(rawCode.indexOf('<pre>') + 5)
    }`
  }
}
