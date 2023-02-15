const toutiao = {
  h1: {
    open: '<h1>',
    close: '</h1>',
  },
  // h2 => h1
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
  // h2 => h1
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
const csdn = {
  h1: {
    open: '<h1><strong>',
    close: '</strong></h1>',
  },
  h2: {
    open: '<h1><strong>',
    close: '</strong></h1>',
  },
  h3: {
    open: '<h2><strong>',
    close: '</strong></h2>',
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
const juejin = {
  h1: {
    open: '<h1><strong>',
    close: '</strong></h1>',
  },
  h2: {
    open: '<h1><strong>',
    close: '</strong></h1>',
  },
  h3: {
    open: '<h2><strong>',
    close: '</strong></h2>',
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
const zhihu = {
  h1: {
    open: '<h1><strong>',
    close: '</strong></h1>',
  },
  h2: {
    open: '<h2>',
    close: '</h2>',
  },
  h3: {
    open: '<h3>',
    close: '</h3>',
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
export { toutiao, weixin, csdn, juejin, zhihu }
