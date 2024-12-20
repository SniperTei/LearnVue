import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login/index.vue'
import LayoutView from '@/views/layout/index.vue'
import TestView from '@/views/test/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/test01',
      name: 'test01',
      component: TestView,
    },
    {
      path: '/home',
      name: 'layout',
      component: LayoutView,
      // 子路由
      children: [
        {
          path: '/booklist',
          name: 'book',
          component: () => import('@/views/book/index.vue'),
        },
        {
          path: '/booklist/detail/:bookId',
          name: 'book-detail',
          component: () => import('@/views/book/detail.vue'),
        },
        {
          path: '/movielist',
          name: 'movie',
          component: () => import('@/views/movie/index.vue'),
        },
        {
          path: '/movielist/detail/:movieId',
          name: 'movie-detail',
          component: () => import('@/views/movie/detail.vue'),
        },
        {
          path: '/foodlist',
          name: 'food',
          component: () => import('@/views/food/index.vue'),
        },
        {
          path: '/alcohol',
          name: 'alcohol',
          component: () => import('@/views/alcohol/index.vue'),
        },
        {
          path: '/drink',
          name: 'drink',
          component: () => import('@/views/drink/index.vue'),
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
