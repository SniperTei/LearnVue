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

new VConsole()

app.mount('#app')
