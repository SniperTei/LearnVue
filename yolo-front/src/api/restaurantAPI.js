import http from '@/utils/http'

// 创建餐厅
export const createRestaurant = (data) => {
  return http.post('/api/v1/restaurants/create', data)
}

// 获取餐厅列表
export const getRestaurantList = (params) => {
  return http.get('/api/v1/restaurants/list', { ...params })
}

// 获取单个餐厅
export const getRestaurant = (id) => {
  return http.get(`/api/v1/restaurants/query/${id}`)
}

// 更新餐厅
export const updateRestaurant = (id, data) => {
  return http.put(`/api/v1/restaurants/update/${id}`, data)
}

// 删除餐厅
export const deleteRestaurant = (id) => {
  return http.delete(`/api/v1/restaurants/delete/${id}`)
}

// 获取价位等级
export const getPriceLevels = () => {
  return http.get('/api/v1/restaurants/price-levels')
}
