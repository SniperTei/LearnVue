import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/',
      component: () => import('@/views/home/index.vue'),
      redirect: '/book',
      children: [
        {
          path: 'book',
          name: 'book',
          component: () => import('@/views/book/index.vue'),
          meta: { title: '图书管理' }
        },
        {
          path: 'book/detail/:id',
          name: 'book-detail',
          component: () => import('@/views/book/detail.vue'),
          meta: { title: '图书详情' }
        },
        {
          path: 'movie',
          name: 'movie',
          component: () => import('@/views/movie/index.vue'),
          meta: { title: '电影管理' }
        },
        {
          path: 'movie/detail/:id',
          name: 'movie-detail',
          component: () => import('@/views/movie/detail.vue'),
          meta: { title: '电影详情' }
        },
        {
          path: 'food',
          name: 'food',
          component: () => import('@/views/food/index.vue'),
          meta: { title: '美食管理' }
        },
        {
          path: 'alcohol',
          name: 'alcohol',
          component: () => import('@/views/alcohol/index.vue'),
          meta: { title: '酒品管理' }
        },
        {
          path: 'drink',
          name: 'drink',
          component: () => import('@/views/drink/index.vue'),
          meta: { title: '饮品管理' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/error/index.vue'),
      meta: { title: '404' }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - YOLO系统` : 'YOLO系统'
  
  // 白名单，不需要登录就可以访问的页面
  const whiteList = ['/login']
  
  if (token) {
    if (to.path === '/login') {
      next({ path: '/book' })
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
