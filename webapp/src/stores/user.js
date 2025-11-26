import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义用户store
export const useUserStore = defineStore('user', () => {
  // 状态定义
  const token = ref('')
  const tokenType = ref('')
  const userInfo = ref(null)
  const isAuthenticated = ref(false)

  // 计算属性
  const userDetails = computed(() => {
    return userInfo.value || {}
  })

  const displayName = computed(() => {
    return userInfo.value?.username || userInfo.value?.email || '未登录用户'
  })

  const authHeader = computed(() => {
    if (!token.value || !tokenType.value) return {}
    return {
      Authorization: `${tokenType.value} ${token.value}`
    }
  })

  // 登录
  const login = async (credentials) => {
    try {
      // 实际项目中应调用登录API
      // const response = await request.post('/api/v1/auth/login', credentials)

      // 模拟登录响应
      const mockResponse = {
        "token": "mock_jwt_token_123456",
        "tokenType": "Bearer",
        "userInfo": {
          "id": "692141c9cf1350056d15fb65",
          "email": "test001@example.com",
          "username": "test001",
          "mobile": "13800000001"
        }
      }

      // 更新状态
      setUserData(mockResponse)

      // 保存到localStorage
      saveToStorage()

      return { success: true, data: mockResponse }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: error.message || '登录失败' }
    }
  }

  // 登出
  const logout = () => {
    // 清空状态
    token.value = ''
    tokenType.value = ''
    userInfo.value = null
    isAuthenticated.value = false

    // 清空localStorage
    clearStorage()
  }

  // 设置用户数据
  const setUserData = (data) => {
    if (data.token) token.value = data.token
    if (data.tokenType) tokenType.value = data.tokenType
    if (data.userInfo) userInfo.value = data.userInfo

    isAuthenticated.value = !!token.value && !!userInfo.value
  }

  // 保存数据到localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem('userStore', JSON.stringify({
        token: token.value,
        tokenType: tokenType.value,
        userInfo: userInfo.value
      }))
    } catch (error) {
      console.error('保存用户数据失败:', error)
    }
  }

  // 从localStorage加载数据
  const loadFromStorage = () => {
    try {
      const storedData = localStorage.getItem('userStore')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        setUserData(parsedData)
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
      clearStorage()
    }
  }

  // 清除localStorage数据
  const clearStorage = () => {
    try {
      localStorage.removeItem('userStore')
    } catch (error) {
      console.error('清除用户数据失败:', error)
    }
  }

  // 更新用户信息
  const updateUserInfo = async (updatedInfo) => {
    try {
      // 实际项目中应调用更新用户信息API
      // const response = await request.put('/api/v1/user/profile', updatedInfo)

      // 模拟更新用户信息
      userInfo.value = { ...userInfo.value, ...updatedInfo }

      // 保存到localStorage
      saveToStorage()

      return { success: true, data: userInfo.value }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return { success: false, error: error.message || '更新失败' }
    }
  }

  // 检查token是否过期（简化版）
  const isTokenValid = () => {
    // 在实际应用中，应该检查token的过期时间
    return !!token.value && isAuthenticated.value
  }

  // 刷新token
  const refreshToken = async () => {
    try {
      // 实际项目中应调用刷新token的API
      // const response = await request.post('/api/v1/auth/refresh')

      // 模拟刷新token
      const newToken = `mock_jwt_token_${Date.now()}`
      token.value = newToken

      // 保存到localStorage
      saveToStorage()

      return { success: true, token: newToken }
    } catch (error) {
      console.error('刷新token失败:', error)
      // 刷新失败，可能需要重新登录
      logout()
      return { success: false, error: error.message || '刷新token失败' }
    }
  }

  // 初始化加载用户数据
  const initUserStore = () => {
    loadFromStorage()
  }

  // 暴露状态和方法
  return {
    // 状态
    token,
    tokenType,
    userInfo,
    isAuthenticated,

    // 计算属性
    userDetails,
    displayName,
    authHeader,

    // 方法
    login,
    logout,
    setUserData,
    updateUserInfo,
    isTokenValid,
    refreshToken,
    initUserStore
  }
})
