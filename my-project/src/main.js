import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// import 'element-plus/dist/index.css'
// 引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/main.css'

// 全局初始化入口脚本，index.html被加载时会自动加载这个js文件

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementUI)

app.mount('#app')
