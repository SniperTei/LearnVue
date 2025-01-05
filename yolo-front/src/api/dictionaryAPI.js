import http from '@/utils/http'

// 获取字典数据
export const getDictionaries = (groups) => {
  return http.get('/api/v1/dictionaries', { groups })
}
