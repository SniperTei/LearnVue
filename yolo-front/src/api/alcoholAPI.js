import http from '@/utils/http';

/**
 * 创建酒类
 * @param {Object} data 酒类数据
 * @returns {Promise} 返回创建响应的Promise
 */
export const createAlcohol = (data) => {
  return http.post('/api/v1/alcohols/create', data);
};

/**
 * 获取酒类列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回酒类列表的Promise
 */
export const getAlcoholList = (params = {}) => {
  return http.get('/api/v1/alcohols/list', { params });
};

/**
 * 获取单个酒类详情
 * @param {string} id 酒类ID
 * @returns {Promise} 返回酒类详情的Promise
 */
export const getAlcoholDetail = (id) => {
  return http.get(`/api/v1/alcohols/${id}`);
};

/**
 * 更新酒类
 * @param {string} id 酒类ID
 * @param {Object} data 更新数据
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateAlcohol = (id, data) => {
  return http.put(`/api/v1/alcohols/${id}`, data);
};

/**
 * 删除酒类
 * @param {string} id 酒类ID
 * @returns {Promise} 返回删除响应的Promise
 */
export const deleteAlcohol = (id) => {
  return http.delete(`/api/v1/alcohols/${id}`);
};
