import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login/index.vue'
import LayoutView from '@/views/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'layout',
      component: LayoutView,
      // 子路由
      children: [
        {
          path: '/book',
          name: 'book',
          component: () => import('@/views/book/index.vue'),
        },
        {
          path: '/movie',
          name: 'movie',
          component: () => import('@/views/movie/index.vue'),
        }
      ]
    },
    // error page
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/error/index.vue'),
    }
  ]
})

export default router
