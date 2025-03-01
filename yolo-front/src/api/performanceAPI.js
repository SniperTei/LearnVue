import http from '@/utils/http'

// 获取业绩列表
export function getPerformanceList(params) {
  return http.get('/api/v1/performances', params)
}

// 创建业绩(已有客户)
export function createPerformance(data) {
  return http.post('/api/v1/performances', data)
}

// 创建业绩(新客户)
export function createPerformanceWithCustomer(data) {
  return http.post('/api/v1/performances/with-customer', data)
}

// 更新业绩
export function updatePerformance(data) {
  return http.put(`/api/v1/performances/${data.performanceId}`, data)
}

// 删除业绩
export function deletePerformance(performanceId) {
  return http.delete(`/api/v1/performances/${performanceId}`)
} 