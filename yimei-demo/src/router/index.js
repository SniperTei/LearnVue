import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
// import CheckInRecordMgmt from '../views/checkInMgmt/CheckInRecordMgmt.vue';
import Business from '../views/business/Business.vue';
import CheckIn from '@/views/business/CheckIn.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // {
    //   path: '/check-in-records',
    //   name: 'checkInRecords',
    //   // 使用直接导入而不是懒加载以避免动态导入问题
    //   component: CheckInRecordMgmt
    // },
    {
      path: '/business',
      name: 'business',
      component: Business
    },
    {
      path: '/check-in',
      name: 'checkIn',
      component: CheckIn
    },
  ]
});

export default router;
