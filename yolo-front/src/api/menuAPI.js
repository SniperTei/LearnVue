import http from '@/utils/http'

/**
 * 创建菜单
 * @param {Object} data 菜单数据
 * @returns {Promise} 返回创建响应的Promise
 */
export const createMenu = (data) => {
  return http.post('/api/v1/menus', data)
}

/**
 * 更新菜单
 * @param {string} code 菜单编码
 * @param {Object} data 更新数据
 * @returns {Promise} 返回更新响应的Promise
 */
export const updateMenu = (code, data) => {
  return http.put(`/api/v1/menus/${code}`, data)
}

/**
 * 删除菜单
 * @param {string} code 菜单编码
 * @returns {Promise} 返回删除响应的Promise
 */
export const deleteMenu = (code) => {
  return http.delete(`/api/v1/menus/${code}`)
}

/**
 * 获取菜单树
 * @returns {Promise} 返回菜单树的Promise
 */
export const getMenuTree = () => {
  return http.get('/api/v1/menus/tree')
}

/**
 * 获取所有菜单
 * @returns {Promise} 返回所有菜单的Promise
 */
export const getAllMenus = () => {
  return http.get('/api/v1/menus/all')
}
