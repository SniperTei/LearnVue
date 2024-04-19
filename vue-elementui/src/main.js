import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import router from './router'

Vue.config.productionTip = false

Vue.use(ElementUI);
// 使用router
// Vue.use(router)

new Vue({
  render: h => h(App),
}).$mount('#app')
