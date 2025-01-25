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
 * 获取个人资料
 * @returns {Promise} 返回个人资料的Promise
 */
export const getProfile = () => {
  return http.get('/api/v1/users/profile');
};

/**
 * 更新个人资料
 * @param {Object} data 更新数据
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateProfile = (data) => {
  return http.put('/api/v1/users/profile', data);
};

/**
 * 软删除用户
 * @returns {Promise} 返回删除响应的Promise
 */
export const softDeleteUser = () => {
  return http.delete('/api/v1/users/soft-delete');
};

/**
 * 获取用户列表（管理员接口）
 * @param {Object} params 查询参数
 * @returns {Promise} 返回用户列表的Promise
 */
export const getUserList = (params) => {
  return http.get('/api/v1/users/list', { params });
};

/**
 * 获取用户菜单权限（管理员接口）
 * @param {string} userId 用户ID
 * @returns {Promise} 返回用户菜单权限的Promise
 */
export const getUserMenus = (userId) => {
  return http.get(`/api/v1/users/${userId}/menus`);
};

/**
 * 更新用户菜单权限（管理员接口）
 * @param {string} userId 用户ID
 * @param {Array} menuCodes 菜单代码列表
 * @param {boolean} isAdmin 是否管理员
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateUserMenus = (userId, menuCodes, isAdmin = false) => {
  return http.put(`/api/v1/users/${userId}/menus`, { menuCodes, isAdmin });
};