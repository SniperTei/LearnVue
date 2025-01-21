import http from '@/utils/http'

/**
 * 创建健身记录
 * @param {Object} data 记录数据
 * @returns {Promise} 返回创建响应的Promise
 */
export const createFitness = (data) => {
  return http.post('/api/v1/fitness/create', data)
}

/**
 * 获取健身记录列表
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.limit 每页数量
 * @param {string} params.startDate 开始日期
 * @param {string} params.endDate 结束日期
 * @param {string} params.exerciseType 运动类型
 * @param {string} params.intensity 运动强度
 * @param {string} params.sortBy 排序字段
 * @param {string} params.order 排序方向
 * @returns {Promise} 返回记录列表的Promise
 */
export const getFitnessList = (params = {}) => {
  return http.get('/api/v1/fitness/list', { ...params })
}

/**
 * 获取单个健身记录详情
 * @param {string} id 记录ID
 * @returns {Promise} 返回记录详情的Promise
 */
export const getFitnessDetail = (id) => {
  return http.get(`/api/v1/fitness/query/${id}`)
}

/**
 * 更新健身记录
 * @param {string} id 记录ID
 * @param {Object} data 更新的数据
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateFitness = (id, data) => {
  return http.put(`/api/v1/fitness/update/${id}`, data)
}

/**
 * 删除健身记录
 * @param {string} id 记录ID
 * @returns {Promise} 返回删除响应的Promise
 */
export const deleteFitness = (id) => {
  return http.delete(`/api/v1/fitness/delete/${id}`)
}
