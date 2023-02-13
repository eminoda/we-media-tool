import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Row, Col, Button, Tooltip } from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css' // or 'ant-design-vue/dist/antd.less'
import './index.less'

createApp(App)
  .use(store)
  .use(router)
  .use(Button)
  .use(Row)
  .use(Col)
  .use(Tooltip)
  // .use(SearchOutlined )
  .mount('#app')
