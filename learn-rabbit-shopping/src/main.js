import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { lazyPlugin } from '@/directives/index.js'
import { componentPlugin } from '@/components/index.js'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

// 引入初始化样式文件
import '@/styles/common.scss'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.use(router)
// Use the lazy plugin
app.use(lazyPlugin);
// Use component
app.use(componentPlugin)
app.mount('#app')

