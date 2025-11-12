import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
// import CheckInRecordMgmt from '../views/checkInMgmt/CheckInRecordMgmt.vue';
import Business from '../views/business/Business.vue';
import CheckIn from '@/views/business/CheckIn.vue';
import CheckInRecord from '@/views/business/CheckInRecord.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
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
    {
      path: '/check-in-records',
      name: 'checkInRecords',
      component: CheckInRecord
    },
  ]
});

export default router;
