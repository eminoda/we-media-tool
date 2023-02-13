<template>
  <div class="side-menu-wrap">
    <a-tooltip placement="left">
      <template #title>复制 </template>
      <a-button
        @click="handleCopy"
        id="copy-btn"
        data-clipboard-target=".wmt"
        size="large"
      >
        <template #icon><CopyOutlined /></template>
      </a-button>
    </a-tooltip>
    <a-tooltip placement="left">
      <template #title>微信发布 </template>
      <a-button @click="handlePushlish" size="large">
        <template #icon><wechat-outlined /></template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script>
import { CopyOutlined, WechatOutlined } from '@ant-design/icons-vue'
import useCopy from '@/composables/useCopy'
// const { ipcRenderer } = require('electron');
export default {
  components: { CopyOutlined, WechatOutlined },
  methods: {
    handleCopy () {
      useCopy('copy-btn', '.wmt')
    },
    handlePushlish () {
      window.ipcRenderer.send('cmd', {
        name: 'say-hello',
        data: 'weixin',
      });
      window.ipcRenderer.on('cmd', (event, arg = {}) => {
        const { name, data } = arg;
        switch (name) {
          case 'reply-hello':
            console.log(data);
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.side-menu-wrap {
  position: fixed;
  top: 55%;
  right: 10px;
  //   width: 54px;
  //   height: 54px;
  display: flex;
  flex-direction: column;
  [data-clipboard-target] {
  }
}
</style>