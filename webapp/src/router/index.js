import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/Home.vue'
import Study from '@/views/study/Study.vue'
import What from '@/views/what/What.vue'
import Mine from '@/views/mine/Mine.vue'
import Food from '@/views/food/FoodList.vue'
import Drink from '@/views/drink/DrinkList.vue'
import Fun from '@/views/fun/FunList.vue'
// import EnjoyList from '@/views/home/EnjoyList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/study',
      name: 'study',
      component: Study,
    },
    {
      path: '/what',
      name: 'what',
      component: What,
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine,
    },
    {
      path: '/food',
      name: 'food',
      component: Food,
    },
    {
      path: '/drink',
      name: 'drink',
      component: Drink,
    },
    {
      path: '/fun',
      name: 'fun',
      component: Fun,
    }
    // {
    //   path: '/enjoy',
    //   name: 'enjoy',
    //   component: EnjoyList,
    // },

  ],
})

export default router
