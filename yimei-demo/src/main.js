import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VConsole from 'vconsole'

import App from './App.vue'
import router from './router'

import Vant from 'vant';
import 'vant/lib/index.css'; // 引入 Vant 样式

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant); // 全局注册所有组件

// 开发环境判断
if (import.meta.env.DEV) {
  console.log('开发环境，启用VConsole')
  new VConsole()
}

// 测试环境判断 - 支持两种方式
if (import.meta.env.TEST || import.meta.env.VITE_TEST === 'true') {
  console.log('测试环境')
}

// 生产环境判断
if (import.meta.env.PROD) {
  console.log('生产环境')
}

// 环境信息显示
console.log('当前环境:', import.meta.env)
console.log('环境标题:', import.meta.env.VITE_APP_TITLE)


app.mount('#app')
