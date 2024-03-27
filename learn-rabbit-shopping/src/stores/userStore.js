// 用户数据相关的store
import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI } from '@/apis/user'
import { useCartStore } from './cartStore'

export const useUserStore = defineStore('user', () => {
  // 1. 定义管理用户数据
  const userInfo = ref({})
  const cartStore = useCartStore()
  // 2. 定义获取接口数据的aciton函数
  const getUserInfo = async ({account, password}) => {
    const res = await loginAPI({account, password})
    console.log('res in user store', res)
    userInfo.value = res.data.result
    console.log('userInfo.value', userInfo.value)
  }
  // 3. 定义清除用户数据的action函数
  const clearUserInfo = () => {
    userInfo.value = {}
    // 清除购物车数据
    cartStore.clearCart()
  }
  // 3. 以对象的格式把state和action都return出去
  return {
    userInfo,
    getUserInfo,
    clearUserInfo
  }
}, {
  persist: true
});