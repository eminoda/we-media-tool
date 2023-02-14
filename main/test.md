# 标题 H1

## 文章标题 H2

### 段落示例 H3

> 栈（stack）又名堆栈，它是一种运算受限的线性表。限定仅在表尾进行插入和删除操作的线性表。

[超链接](https://jinzhi.hwcha.com/) 会开设一条 **主线程** 用来做 **DOM** 的解析，计算样式，以及构建出 Layout 树，Layer 树...
虽然 **主线程** 已经做了那么多工作，但它还要运行我们的 js 代码。因为这个 主线程 被设计为 线程，并且单个 **渲染进程** 中只存在一个 **主线程** ，所以跑在里面的 **js** 也只能是单线程级的，环境如何所以何谈多线程，或者多进程。
~~从另一方面理解，如果同一段代码由多个 js 线程在运行~~，必然存在并发问题，涉及到 DOM 的修改的话，浏览器也不知道怎么处理渲染关系。

## 代码块

```css
.wave {
  animation: waveMove 1s infinite linear;
}
```

## 图片

### 网络图片

![图片说明](https://cdn.nlark.com/yuque/0/2023/png/245935/1675846468890-cdbe145e-cc7e-4eeb-ab79-f7978d1aad95.png)

### 本地 hexo 图片

{% asset_img 2.png 图片说明 %}

## 表格

| 标题 | 内容 |
| ---- | ---- |
| 1    | 2    |

## 参考（友情链接）

- [文献 1](https://jinzhi.hwcha.com/)
- [文献 2](https://tool.oschina.net/hexconvert/)

1. [文献 1](https://jinzhi.hwcha.com/)
2. [文献 2](https://tool.oschina.net/hexconvert/)
