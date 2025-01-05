import http from '@/utils/http';
import { encryptPassword } from '@/utils/crypto';

/**
 * 用户登录
 * @param {Object} data 登录数据
 * @returns {Promise} 返回登录响应的Promise
 */
export const login = async (data) => {
  const encryptedData = {
    ...data,
    password: encryptPassword(data.password)
  };
  return http.post('/api/v1/users/login', encryptedData);
};

/**
 * 用户注册
 * @param {Object} data 注册数据
 * @returns {Promise} 返回注册响应的Promise
 */
export const register = async (data) => {
  const encryptedData = {
    ...data,
    password: encryptPassword(data.password)
  };
  return http.post('/api/v1/users/register', encryptedData);
};