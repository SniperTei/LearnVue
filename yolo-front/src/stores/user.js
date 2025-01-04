import { defineStore } from 'pinia'
import { ref } from 'vue'

const getLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 初始化状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(getLocalStorage('userInfo', null))
  const menus = ref(getLocalStorage('menus', []))

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  const setMenus = (newMenus) => {
    menus.value = newMenus
    localStorage.setItem('menus', JSON.stringify(newMenus))
  }

  const clearUserInfo = () => {
    token.value = ''
    userInfo.value = null
    menus.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('menus')
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
