import http from '@/utils/http'

/**
 * 用户登录
 * @param {Object} data 登录数据
 * @param {string} data.username 用户名
 * @param {string} data.password 密码
 * @returns {Promise} 返回登录响应的Promise
 */
export const login = (data) => {
  return http.post('/api/v1/users/login', data, {
    showError: false // 禁用全局错误提示，由业务层自己处理
  })
}

/**
 * 获取用户信息
 * @returns {Promise} 返回用户信息的Promise
 */
export const getUserInfo = () => {
  return http.get('/api/v1/users/info')
}

/**
 * 用户登出
 * @returns {Promise} 返回登出响应的Promise
 */
export const logout = () => {
  return http.post('/api/v1/users/logout', {}, {
    showError: false // 禁用全局错误提示，由业务层自己处理
  })
}