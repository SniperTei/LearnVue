import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import config from './config/env'

// 引入全局SCSS样式
import './styles/main.scss'

const app = createApp(App)

// 设置应用标题
document.title = config.title

// 使用插件
app.use(createPinia())
app.use(router)
app.use(Vant)

// 开发环境下启用调试
if (config.debug) {
  console.log('应用配置:', config)
  console.log('当前环境:', config.env)
}

app.mount('#app')
