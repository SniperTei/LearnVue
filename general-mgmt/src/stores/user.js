// Import any dependencies you need
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginAPI } from '@/api/accounts/accountsAPI'

// Define a new store
export const useUserStore = defineStore('user', () => {
  // Define your state properties here
  const userInfo = ref({})
  const token = ref(localStorage.getItem('token') || '')
  
  // 计算属性
  const isLogin = computed(() => !!token.value)
  const username = computed(() => userInfo.value.username || '')
  const avatar = computed(() => userInfo.value.avatar || '')
  
  // 获取用户信息
  const getUserInfo = async ({username, password}) => {
    try {
      const res = await loginAPI({username, password})
      if (res.data.code !== '000000') {
        return Promise.reject(res.data)
      }
      userInfo.value = res.data.data
      token.value = res.data.data.token
      localStorage.setItem('token', token.value)
      return res.data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 退出登录
  const logout = () => {
    userInfo.value = {}
    token.value = ''
    localStorage.removeItem('token')
  }

  // Return the state and actions
  return {
    userInfo,
    token,
    isLogin,
    username,
    avatar,
    getUserInfo,
    logout
  }
}, {
  // Enable the store to persist state in the browser's localStorage
  persist: true
});