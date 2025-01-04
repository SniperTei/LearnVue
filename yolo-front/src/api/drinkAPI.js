import http from '@/utils/http';

/**
 * 创建饮品记录
 * @param {Object} data 饮品数据
 * @returns {Promise} 返回创建响应的Promise
 */
export const createDrink = (data) => {
  return http.post('/api/v1/drinks/create', data);
};

/**
 * 获取饮品列表
 * @returns {Promise} 返回饮品列表的Promise
 */
export const getDrinkList = () => {
  return http.get('/api/v1/drinks/list');
};

/**
 * 获取单个饮品详情
 * @param {string} id 饮品ID
 * @returns {Promise} 返回饮品详情的Promise
 */
export const getDrinkDetail = (id) => {
  return http.get(`/api/v1/drinks/${id}`);
};

/**
 * 更新饮品记录
 * @param {string} id 饮品ID
 * @param {Object} data 更新的数据
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateDrink = (id, data) => {
  return http.put(`/api/v1/drinks/${id}`, data);
};

/**
 * 删除饮品记录
 * @param {string} id 饮品ID
 * @returns {Promise} 返回删除响应的Promise
 */
export const deleteDrink = (id) => {
  return http.delete(`/api/v1/drinks/${id}`);
};
