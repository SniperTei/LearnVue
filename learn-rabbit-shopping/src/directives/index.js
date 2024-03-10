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
            // console.log("isIntersecting: ", isIntersecting)
            if (isIntersecting) { // 进入了视口区域
              const img = new Image()
              img.src = binding.value
              img.onload = () => { // 当图片加载完成时，触发 onload 事件
                // 将目标元素（通常是 <img> 标签）的 src 属性设置为新图片的 src，从而实现懒加载图片的效果
                el.src = img.src
                observerElement.disconnect()
              }
            }
          },
          // 通过设置 threshold: 0.5，表示当目标元素的一半进入视口时，就会触发回调函数。可以根据实际需求调整阈值来控制触发懒加载的时机
          { threshold: 0.5 }
        )
      }
    })    
  }
};