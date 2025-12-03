import { post } from '@/utils/request';

// 参数都是params，
// 如果是post或者put 放到data里
// 如果是get 放到params里


/**
 * 物品列表
 */
export function itemList(params) {
  // 转一层，将params转换为data
  const data = {
    ...params
  }
  return post('/api/items/list/', data)
}
