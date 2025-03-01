import request from '@/utils/http'

// 获取业绩列表
export function getPerformanceList(params) {
  return request({
    url: '/performance/list',
    method: 'get',
    params
  })
}

// 创建业绩(已有客户)
export function createPerformance(data) {
  return request({
    url: '/performance',
    method: 'post',
    data
  })
}

// 创建业绩(新客户)
export function createPerformanceWithCustomer(data) {
  return request({
    url: '/performance/with-customer',
    method: 'post',
    data
  })
}

// 更新业绩
export function updatePerformance(data) {
  return request({
    url: `/performance/${data.performanceId}`,
    method: 'put',
    data
  })
}

// 删除业绩
export function deletePerformance(performanceId) {
  return request({
    url: `/performance/${performanceId}`,
    method: 'delete'
  })
} 