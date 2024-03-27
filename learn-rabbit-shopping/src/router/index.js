// createRouter 创建路由实例
// createWebHistory 创建history路由模式
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/index.vue'
import Layout from '@/views/layout/index.vue'
import Home from '@/views/home/index.vue'
import Category from '@/views/category/index.vue'
import SubCategory from '@/views/subCategory/index.vue'
import Detail from '@/views/detail/index.vue'
import CartList from '@/views/cartList/index.vue'
import Checkout from '@/views/checkout/index.vue'
import Pay from '@/views/pay/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // path和component的对应关系的位置
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '', // 默认子路由
          component: Home,
        },
        {
          path: 'category/:id',
          component: Category,
        },
        {
          path: 'category/sub/:id',
          component: SubCategory,
        },
        {
          path: 'detail/:id',
          component: Detail
        },
        {
          path: 'cartlist',
          component: CartList
        },
        {
          path: 'checkout',
          component: Checkout
        },
        {
          path: 'pay',
          component: Pay
        }
      ]
    },
  ],
  // 路由滚动行为定制
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
