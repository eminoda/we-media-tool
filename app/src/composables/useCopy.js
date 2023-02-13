const ClipboardJS = require('clipboard')
import { message } from 'ant-design-vue'

export default function useCopy(id, copyCls) {
  const clipboard = new ClipboardJS(`#${id}`)
  clipboard.on('success', function (e) {
    e.clearSelection()
    message.info({ top: '40%', content: '复制成功' })
    clipboard.destroy()
  })
}
