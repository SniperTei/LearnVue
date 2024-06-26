// Import any dependencies you need
import { defineStore } from 'pinia';
import { ref, computed } from 'vue'
import { loginAPI } from '@/api/accounts/accountsAPI'

// Define a new store
export const useUserStore = defineStore('user', () => {
  // Define your state properties here
  const userInfo = ref({})
  // 是否已经登录
  const isLogin = computed(() => {
    return !!userInfo.value.token
  })

  // Define your actions here
  const getUserInfo = async ({username, password}) => {
    const res = await loginAPI({username, password})
    console.log('res:', res)
    if (res.data.code !== '000000') {
      // 登录失败
      return Promise.reject(res.data)
    }
    userInfo.value = res.data.data
    // token存到localStorage中
    localStorage.setItem('token', res.data.data.token)
  }

  const clearUserInfo = () => {
    userInfo.value = {}
  }

  // Return the state and actions
  return {
    userInfo,
    getUserInfo,
    clearUserInfo
  }
}, {
  // Enable the store to persist state in the browser's localStorage
  persist: true
});