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

/**
 * 用户注册
 * @param {Object} data - 注册参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @param {string} data.gender - 性别
 * @param {string} data.mobile - 手机号
 * @param {string} data.birthDate - 出生日期
 * @returns {Promise} 返回注册响应的Promise
 */
export const register = (data) => {
  return http.post('/api/v1/users/register', {
    ...data,
    password: encryptPassword(data.password)
  }, {
    showError: false // 禁用全局错误提示，由业务层自己处理
  });
};