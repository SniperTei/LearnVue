import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const menus = ref([])

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const setMenus = (newMenus) => {
    menus.value = newMenus
  }

  const clearUserInfo = () => {
    token.value = ''
    userInfo.value = null
    menus.value = []
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    menus,
    setToken,
    setUserInfo,
    setMenus,
    clearUserInfo
  }
})
