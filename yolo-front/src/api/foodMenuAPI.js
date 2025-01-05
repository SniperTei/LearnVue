import http from '@/utils/http';

/**
 * 创建菜品
 * @param {Object} data 菜品数据
 * @returns {Promise} 返回创建响应的Promise
 */
export const createFoodMenu = (data) => {
  return http.post('/api/v1/foodmenus/create', data);
};

/**
 * 获取菜品列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回菜品列表的Promise
 */
export const getFoodMenuList = (params = {}) => {
  return http.get('/api/v1/foodmenus/list', { ...params });
};

/**
 * 获取单个菜品详情
 * @param {string} id 菜品ID
 * @returns {Promise} 返回菜品详情的Promise
 */
export const getFoodMenuDetail = (id) => {
  return http.get(`/api/v1/foodmenus/query/${id}`);
};

/**
 * 更新菜品
 * @param {string} id 菜品ID
 * @param {Object} data 更新数据
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateFoodMenu = (id, data) => {
  return http.put(`/api/v1/foodmenus/update/${id}`, data);
};

/**
 * 删除菜品
 * @param {string} id 菜品ID
 * @returns {Promise} 返回删除响应的Promise
 */
export const deleteFoodMenu = (id) => {
  return http.delete(`/api/v1/foodmenus/delete/${id}`);
};
