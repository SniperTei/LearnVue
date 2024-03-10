import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useIntersectionObserver } from '@vueuse/core'

import App from './App.vue'
import router from './router'

// 引入初始化样式文件
import '@/styles/common.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// 定义全局指令
app.directive('img-lazy', {
  // el: 指令绑定的元素
  // binding: binding.value 传入的值
  mounted(el, binding) {
    useIntersectionObserver(el,
      ([{ isIntersecting }], observerElement) => {
        if (isIntersecting) { // 进入了视口区域
          const img = new Image()
          img.src = binding.value
          img.onload = () => {
            el.src = img.src
            observerElement.disconnect()
          }
        }
      },
      { threshold: 0.5 }
    )
  }
})

