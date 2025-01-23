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

/**
 * 获取用户列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回用户列表的Promise
 */
export const getUserList = (params) => {
  return http.get('/api/v1/users/list', { params });
};

/**
 * 获取用户详情
 * @param {string} id 用户ID
 * @returns {Promise} 返回用户详情的Promise
 */
export const getUserDetail = (id) => {
  return http.get(`/api/v1/users/query/${id}`);
};

/**
 * 更新用户信息
 * @param {string} id 用户ID
 * @param {Object} data 更新数据
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateUser = (id, data) => {
  return http.put(`/api/v1/users/${id}`, data);
};

/**
 * 删除用户
 * @param {string} id 用户ID
 * @returns {Promise} 返回删除响应的Promise
 */
export const deleteUser = (id) => {
  return http.delete(`/api/v1/users/${id}`);
};

/**
 * 更新用户菜单权限
 * @param {string} userId 用户ID
 * @param {Array} menuCodes 菜单代码列表
 * @param {boolean} isAdmin 是否管理员
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateUserMenus = (userId, menuCodes, isAdmin = false) => {
  return http.put(`/api/v1/users/${userId}/menus`, { menuCodes, isAdmin });
};

/**
 * 获取用户菜单权限
 * @param {string} userId 用户ID
 * @returns {Promise} 返回用户菜单权限的Promise
 */
export const getUserMenus = (userId) => {
  return http.get(`/api/v1/users/${userId}/menus`);
};