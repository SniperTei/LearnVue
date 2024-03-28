// Import any dependencies you need
import { defineStore } from 'pinia';
import { ref, computed } from 'vue'

// Define a new store
export const useUserStore = defineStore('user', () => {
  // Define your state properties here
  const userInfo = ref({})
  // 是否已经登录
  const isLogin = computed(() => {
    return !!userInfo.value.token
  })

  // Define your actions here
  const getUserInfo = async ({account, password}) => {
    // const res = await loginAPI({account, password})
    // userInfo.value = res.data.result
    userInfo.value = {
      account: account,
      password: password,
      token: 'admin'
    }
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