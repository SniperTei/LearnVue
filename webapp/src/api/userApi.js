import { get } from '@/utils/request'

/**
 * 获取单个食品
 * @returns {Promise}
 */
export function getMe() {
  return get(`/api/v1/users/me`)
}