import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/views/layout/index.vue';
import Login from '@/views/user/Login.vue';
import Register from '@/views/user/Register.vue';

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
    meta: { hidden: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { hidden: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
