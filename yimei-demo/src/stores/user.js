import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 用户信息store
export const useUserStore = defineStore('user', () => {
  // 用户基本信息
  const userInfo = ref({
    id: 0,
    nickname: '',
    token: '',
    avatar: '',
    phone: '',
    username: '',
    user_id: ''
    // 可根据项目需求添加更多字段
  })

  // 登录状态
  const isLoggedIn = computed(() => {
    return !!userInfo.value.token && userInfo.value.id > 0
  })

  // 设置用户信息
  function setUserInfo(info) {
    userInfo.value = {
      ...userInfo.value,
      ...info
    }

    // 存储到本地存储
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  // 清除用户信息
  function clearUserInfo() {
    userInfo.value = {
      id: 0,
      nickname: '',
      token: '',
      avatar: '',
      phone: '',
      email: ''
    }

    // 清除本地存储
    localStorage.removeItem('userInfo')
  }

  // 更新用户部分信息
  function updateUserInfo(partialInfo) {
    userInfo.value = {
      ...userInfo.value,
      ...partialInfo
    }

    // 更新本地存储
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  // 从本地存储恢复用户信息
  function restoreUserInfo() {
    try {
      const storedInfo = localStorage.getItem('userInfo')
      if (storedInfo) {
        userInfo.value = JSON.parse(storedInfo)
      }
    } catch (error) {
      console.error('恢复用户信息失败:', error)
      // 出错时清除可能损坏的数据
      localStorage.removeItem('userInfo')
    }
  }

  // 设置token
  function setToken(token) {
    userInfo.value.token = token
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  // 获取token
  function getToken() {
    return userInfo.value.token
  }

  return {
    userInfo,
    isLoggedIn,
    setUserInfo,
    clearUserInfo,
    updateUserInfo,
    restoreUserInfo,
    setToken,
    getToken
  }
})
