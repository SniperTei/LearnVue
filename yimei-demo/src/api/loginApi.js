import { post } from '@/utils/request';

// 参数都是params，
// 如果是post或者put 放到data里
// 如果是get 放到params里


/**
 * 登录
 */
export function login(params) {
  // 转一层，将params转换为data
  const data = {
    ...params
  }
  return post('api/user/login/', data)
}
