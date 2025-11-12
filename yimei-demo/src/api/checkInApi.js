import { post, get } from '@/utils/request';

// 参数都是params，
// 如果是post或者put 放到data里
// 如果是get 放到params里


/**
 * 打卡
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function checkIn(params) {
  // 转一层，将params转换为data
  const data = {
    ...params
  }
  return post('api/itemrecord/addclock/', data)
}

/**
 * 打卡记录列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function checkInList(params) {
  // 转一层，将params转换为data
  const data = {
    ...params
  }
  return post('api/itemrecord/clocklist/', data)
}

/**
 * 测试接口
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function testApi() {
  // 转一层，将params转换为data
  // const data = {
  //   ...params
  // }
  return get('api/v1/items/')
}

