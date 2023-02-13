# 调研

基本功能

- [x] monaco-editor 集成
- [x] markdown 转 html
- [x] clipboard.js 复制 html 内容

核心功能

- [ ] 文章样式处理
  - [ ] 图片处理
    - [x] hexo 本地资源解析
    - [x] 图片转 base64
    - [ ] 是否要控制图片长宽？
  - [ ] 代码块转图片
  - [ ] **样式处理**
    - [ ] 用户自定义配置能力
    - [ ] 客户端默认规则配置
    - [ ] 头条基础样式
      - [ ] 一级标题
      - [ ] 二级标题
      - [ ] 文本
      - [ ] 图片
      - [ ] 代码块
    - [ ] 微信基础样式
      - [ ] 一级标题，图片背景自定义
      - [ ] 二级标题
      - [ ] 文本
      - [ ] 图片
      - [ ] 代码块
- [ ] 自媒体平台自动加载

## 实现功能

| 功能      | 实现方式          | 头条                     | 微信                     |
| --------- | ----------------- | ------------------------ | ------------------------ |
| 字体大小  | element css       | :heavy_check_mark:       | :heavy_check_mark:       |
| 标题 Hn   | element css       | :heavy_check_mark:       | :heavy_check_mark:       |
| 加粗      | element css       | :heavy_check_mark:       | :heavy_check_mark:       |
| 斜体      | element css       | :heavy_check_mark:       | :heavy_check_mark:       |
|           |
| 无序列表  | css               | :heavy_check_mark:       | :heavy_check_mark:       |
| 有序列表  | css               | :heavy_check_mark:       | :heavy_check_mark:       |
|           |
| 分割线    | css               | :heavy_check_mark:       | :heavy_check_mark:       |
| 超链接    | className         | :heavy_check_mark:       | :heavy_check_mark:       |
| 下划线    | element css       | :heavy_multiplication_x: | :heavy_multiplication_x: |
| 中划线    | element css       | :heavy_check_mark:       | :heavy_check_mark:       |
| 引用      | css               | :heavy_check_mark:       | :heavy_check_mark:       |
|           |
| 表格      | className         | :heavy_check_mark:       | :heavy_check_mark:       |
|           |
| 代码块    | markdown + canvan | :heavy_check_mark:       | :heavy_check_mark:       |
|           |
| 网络图片  | markdown          | :heavy_check_mark:       | :heavy_check_mark:       |
| hexo 图片 | 本地解析          | :heavy_check_mark:       | :heavy_check_mark:       |

## 资料

- [monaco-editor](https://microsoft.github.io/monaco-editor/playground.html#creating-the-editor-editor-basic-options)
- [monaco-editor](https://microsoft.github.io/monaco-editor/monarch.html)
- [markdown-it](https://github.com/markdown-it/markdown-it/blob/master/docs/examples/renderer_rules.md)
- [markdown-it plugin](https://github.com/ruanyf/markdown-it-image-lazy-loading)
