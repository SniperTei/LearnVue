import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/login/index.vue'
import Layout from '@/views/layout/index.vue'
import Home from '@/views/home/index.vue'
import Category from '@/views/category/index.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // path和component的对应关系的位置
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '', // 默认子路由
          component: Home,
        },
        {
          path: 'category',
          component: Category,
        }
      ]
    },
    {
      path: '/login',
      component: Login
    },
    
  ]
})

export default router
