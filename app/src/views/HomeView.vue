<template>
  <div class="home">
    <div justify="space-between" class="page-panel">
      <div class="panel-wrap">
        <markdown-editor @change="handleMarkdownEditor" />
      </div>
      <div class="panel-wrap">
        <!-- <html-render :value="mdValue" :mediaType="'weixin'" /> -->
        <html-render :value="mdValue" :mediaType="mediaType" />
        <side-menu @choose="handleMediaType" />
      </div>
    </div>
    <div class="bottom-wrap">123</div>
  </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import HtmlRender from '@/components/HtmlRender'
import SideMenu from '@/components/SideMenu'
export default {
  name: 'HomeView',
  components: { HtmlRender, MarkdownEditor, SideMenu },
  data() {
    return {
      mdValue: '',
      mediaType: 'weixin',
    }
  },
  methods: {
    handleMarkdownEditor(value) {
      this.mdValue = value
    },
    handleMediaType(mediaType) {
      this.mediaType = mediaType
      console.log(this.mediaType)
    },
  },
}
</script>

<style lang="less" scoped>
.page-panel {
  height: calc(100vh - 50px);
  overflow: hidden;
}
.panel-wrap {
  width: 50%;
  display: inline-block;
  height: 100%;
  vertical-align: top;
  overflow: auto;
}
</style>
