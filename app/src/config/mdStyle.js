const toutiao = {
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
}
const weixin = {
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
}
export { toutiao, weixin }
