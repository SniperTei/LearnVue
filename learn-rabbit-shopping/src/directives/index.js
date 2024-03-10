import { useIntersectionObserver } from '@vueuse/core'

// Define your lazy plugin
export const lazyPlugin = {
  install(app) {
    // Add a global directive called "img-lazy"
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
  }
};