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
        meta: { title: '仪表盘', icon: 'fa-solid fa-gauge' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: { title: '系统管理', icon: 'fa-solid fa-gear' },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/system/users/index.vue'),
        meta: { title: '用户管理', icon: 'fa-solid fa-users' }
      },
      {
        path: 'users/menu',
        name: 'UserMenuPermission',
        component: () => import('@/views/system/users/menu.vue'),
        meta: { title: '用户菜单权限', activeMenu: '/system/users' },
        hidden: true
      },
      // 菜单管理
      {
        path: 'menus',
        name: 'Menus',
        component: () => import('@/views/system/users/managemenu.vue'),
        meta: { title: '菜单管理', icon: 'fa-solid fa-bars' }
      }
    ]
  },
  {
    path: '/entertainment',
    component: Layout,
    name: 'Entertainment',
    meta: { title: '娱乐', icon: 'fa-solid fa-gamepad' },
    children: [
      {
        path: 'movie',
        name: 'Movie',
        component: () => import('@/views/entertainment/movie/index.vue'),
        meta: { title: '影视', icon: 'fa-solid fa-film' }
      },
      {
        path: 'movie/detail',
        name: 'NewMovie',
        component: () => import('@/views/entertainment/movie/detail.vue'),
        meta: { title: '新增电影', activeMenu: '/entertainment/movie' }
      },
      {
        path: 'movie/detail/:id',
        name: 'MovieDetail',
        component: () => import('@/views/entertainment/movie/detail.vue'),
        meta: { title: '电影详情', activeMenu: '/entertainment/movie' }
      },
      {
        path: 'game',
        name: 'Game',
        component: () => import('@/views/entertainment/game/index.vue'),
        meta: { title: '游戏', icon: 'fa-solid fa-dice' }
      },
      {
        path: 'travel',
        name: 'Travel',
        component: () => import('@/views/entertainment/travel/index.vue'),
        meta: { title: '旅行', icon: 'fa-solid fa-plane' },
        redirect: { name: 'TravelPlan' },
        children: [
          {
            path: 'plan',
            name: 'TravelPlan',
            component: () => import('@/views/entertainment/travel/plan/index.vue'),
            meta: { title: '旅行计划' }
          },
          {
            path: 'plan/detail/:travelPlanId',
            name: 'TravelPlanDetail',
            component: () => import('@/views/entertainment/travel/plan/detail.vue'),
            meta: { title: '旅行计划详情', activeMenu: '/entertainment/travel/plan' }
          },
          {
            path: 'plan/edit/:travelPlanId',
            name: 'TravelPlanEdit',
            component: () => import('@/views/entertainment/travel/plan/edit.vue'),
            meta: { title: '编辑旅行计划', activeMenu: '/entertainment/travel/plan' }
          },
          {
            path: 'diary',
            name: 'TravelDiary',
            component: () => import('@/views/entertainment/travel/diary/index.vue'),
            meta: { title: '旅行游记' }
          },
          {
            path: 'diary/detail',
            name: 'NewTravelDiary',
            component: () => import('@/views/entertainment/travel/diary/detail.vue'),
            meta: { title: '写新游记', activeMenu: '/entertainment/travel/diary' }
          },
          {
            path: 'diary/detail/:diaryId',
            name: 'TravelDiaryDetail',
            component: () => import('@/views/entertainment/travel/diary/detail.vue'),
            meta: { title: '游记详情', activeMenu: '/entertainment/travel/diary' }
          }
        ]
      }
    ]
  },
  {
    path: '/discipline',
    component: Layout,
    name: 'Discipline',
    meta: { title: '自律', icon: 'fa-solid fa-clock' },
    children: [
      {
        path: 'drinking',
        name: 'Drinking',
        component: () => import('@/views/discipline/drinking/index.vue'),
        meta: { title: '饮酒记录', icon: 'fa-solid fa-wine-glass' }
      },
      {
        path: 'drinking/add',
        name: 'DrinkingAdd',
        component: () => import('@/views/discipline/drinking/add.vue'),
        meta: { title: '新增饮酒记录' }
      },
      {
        path: 'reading',
        name: 'Reading',
        component: () => import('@/views/discipline/reading/index.vue'),
        meta: { title: '阅读记录', icon: 'fa-solid fa-book' }
      },
      {
        path: 'fitness',
        name: 'Fitness',
        component: () => import('@/views/discipline/fitness/index.vue'),
        meta: { title: '健身记录', icon: 'fa-solid fa-dumbbell' }
      }
    ]
  },
  {
    path: '/food',
    component: Layout,
    meta: { title: '美食管理', icon: 'food' },
    children: [
      {
        path: 'recipe',
        name: 'Recipe',
        component: () => import('@/views/food/recipe/index.vue'),
        meta: { title: '菜谱管理' }
      },
      {
        path: 'foodMenu',
        name: 'FoodMenu',
        component: () => import('@/views/food/foodmenu/index.vue'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'randomMenu',
        name: 'RandomMenu',
        component: () => import('@/views/food/foodmenu/random.vue'),
        meta: { title: '今天吃啥' }
      },
      {
        path: 'restaurant',
        name: 'Restaurant',
        component: () => import('@/views/food/restaurant/index.vue'),
        meta: { title: '餐厅管理', icon: 'fa-solid fa-utensils' }
      },
      {
        path: 'alcohol',
        name: 'Alcohol',
        component: () => import('@/views/food/alcohol/index.vue'),
        meta: { title: '酒类管理' }
      }
    ]
  },
  {
    path: '/hospital',
    component: Layout,
    name: 'Hospital',
    meta: { title: '医院管理', icon: 'fa-solid fa-hospital' },
    children: [
      {
        path: 'customer',
        name: 'Customer',
        component: () => import('@/views/hospital/customer/index.vue'),
        meta: { title: '客户管理' }
      },
      {
        path: 'performance',
        name: 'Performance',
        component: () => import('@/views/hospital/performance/index.vue'),
        meta: { title: '绩效管理' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    children: [
      {
        path: 'upload',
        name: 'TestUpload',
        component: () => import('@/views/test/testImgUpload.vue'),
        meta: { title: '图片上传测试' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', icon: 'fa-solid fa-right-to-bracket' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register.vue'),
    meta: { title: '注册', icon: 'fa-solid fa-user-plus' }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404', icon: 'fa-solid fa-triangle-exclamation' }
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
  
  // 如果是访问登录页或注册页且已登录，重定向到首页
  if ((to.path === '/login' || to.path === '/register') && token) {
    next('/');
    return;
  }
  
  // 如果不是登录页或注册页，检查是否已登录
  if (!['/login', '/register'].includes(to.path) && !token) {
    next('/login');
    return;
  }
  
  next();
});

export default router;
