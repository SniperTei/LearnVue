import http from '@/utils/http'

/**
 * 创建饮酒记录
 * @param {Object} data 记录数据
 * @returns {Promise} 返回创建响应的Promise
 */
export const createDrink = (data) => {
  return http.post('/api/v1/drinks/create', data)
}

/**
 * 获取饮酒记录列表
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.limit 每页数量
 * @param {string} params.startDate 开始日期
 * @param {string} params.endDate 结束日期
 * @param {string} params.mood 心情
 * @param {string} params.occasion 场合
 * @param {string} params.sortBy 排序字段
 * @param {string} params.order 排序方向
 * @returns {Promise} 返回记录列表的Promise
 */
export const getDrinkList = (params = {}) => {
  return http.get('/api/v1/drinks/list', { 
    params,
    transformResponse: [...(http.defaults?.transformResponse || []), (data) => {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data
        if (parsedData.success && parsedData.data) {
          return {
            success: true,
            data: {
              drinks: parsedData.data.drinks || [],
              pagination: parsedData.data.pagination || {
                total: 0,
                totalPages: 0,
                currentPage: 1,
                limit: 10
              }
            },
            message: parsedData.message
          }
        }
        return parsedData
      } catch (error) {
        console.error('解析饮酒记录数据失败:', error)
        return data
      }
    }]
  })
}

/**
 * 获取单个饮酒记录详情
 * @param {string} id 记录ID
 * @returns {Promise} 返回记录详情的Promise
 */
export const getDrinkDetail = (id) => {
  return http.get(`/api/v1/drinks/${id}`)
}

/**
 * 更新饮酒记录
 * @param {string} id 记录ID
 * @param {Object} data 更新的数据
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateDrink = (id, data) => {
  return http.put(`/api/v1/drinks/${id}`, data)
}

/**
 * 删除饮酒记录
 * @param {string} id 记录ID
 * @returns {Promise} 返回删除响应的Promise
 */
export const deleteDrink = (id) => {
  return http.delete(`/api/v1/drinks/${id}`)
}
