const { defineConfig } = require('@vue/cli-service')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // plugins: [new MonacoWebpackPlugin()],
  },
  chainWebpack: (config) => {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        // Languages are loaded on demand at runtime
        languages: ['markdown', 'javascript', 'html', 'css', 'json'],
      },
    ])
  },
})
