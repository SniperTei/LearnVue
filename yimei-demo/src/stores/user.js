import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 用户信息store
export const useUserStore = defineStore('user', () => {
  // 用户基本信息
  const userInfo = ref({
    nickname: '',
    token: '',
    username: '',
    user_id: ''
    // 可根据项目需求添加更多字段
  })

  // 登录状态
  const isLoggedIn = computed(() => {
    return !!userInfo.value.token && userInfo.value.username !== ''
  })

  // 设置用户信息
  function setUserInfo(info) {
    console.log('设置用户信息:', info);
    userInfo.value = info
    console.log('更新后的userInfo:', userInfo.value);
    // 存储到本地存储
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    // 设置token到localStorage
    if (userInfo.value.token) {
      localStorage.setItem('token', userInfo.value.token)
    }
  }

  // 清除用户信息
  function clearUserInfo() {
    userInfo.value = {
      nickname: '',
      token: '',
      username: '',
      user_id: ''
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
