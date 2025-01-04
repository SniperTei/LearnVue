import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/views/layout/index.vue';
import Login from '@/views/user/Login.vue';
import NotFound from '@/views/error/404.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/system/dashboard',
    children: [
      {
        path: 'system/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/system/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: { title: '系统管理', icon: 'setting' },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/system/users/index.vue'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/entertainment',
    component: Layout,
    name: 'Entertainment',
    meta: { title: '娱乐', icon: 'smile' },
    children: [
      {
        path: 'movie',
        name: 'Movie',
        component: () => import('@/views/entertainment/movie/index.vue'),
        meta: { title: '影视', icon: 'video-camera' }
      },
      {
        path: 'game',
        name: 'Game',
        component: () => import('@/views/entertainment/game/index.vue'),
        meta: { title: '游戏', icon: 'gamepad' }
      },
      {
        path: 'travel',
        name: 'Travel',
        component: () => import('@/views/entertainment/travel/index.vue'),
        meta: { title: '旅游', icon: 'compass' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404' }
  },
  // 将匹配所有内容并将其重定向到 404 页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - YOLO系统` : 'YOLO系统';

  // 获取token
  const token = localStorage.getItem('token');
  
  // 如果是访问登录页且已登录，重定向到首页
  if (to.path === '/login' && token) {
    next('/');
    return;
  }
  
  // 如果不是登录页，检查是否已登录
  if (to.path !== '/login' && !token) {
    next('/login');
    return;
  }
  
  next();
});

export default router;
