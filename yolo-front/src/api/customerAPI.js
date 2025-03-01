import http from '@/utils/http'

// 获取客户列表
export function getCustomerList(params) {
  return http.get('/api/v1/customers', params)
}

// 创建客户
export function createCustomer(data) {
  return http.post('/api/v1/customers', data)
}

// 更新客户
export function updateCustomer(data) {
  return http.put(`/api/v1/customers/${data.customerId}`, data)
}

// 删除客户
export function deleteCustomer(customerId) {
  return http.delete(`/api/v1/customers/${customerId}`)
}
