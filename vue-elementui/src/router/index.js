import Vue from 'vue';
import VueRouter from 'vue-router';
import Test from '../views/test/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/test',
    name: 'test',
    component: Test
  }
  // Define your routes here
  // Example:
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('../views/Home.vue')
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;