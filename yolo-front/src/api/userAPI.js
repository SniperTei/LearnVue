import http from '@/utils/http';
import { encryptPassword } from '@/utils/crypto';

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} 返回登录响应的Promise
 */
export const login = (data) => {
  return http.post('/api/v1/users/login', {
    username: data.username,
    password: encryptPassword(data.password)
  }, {
    showError: false // 禁用全局错误提示，由业务层自己处理
  });
};