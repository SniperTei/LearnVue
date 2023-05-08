import request from '@/config/http/request'
import { get, post } from '@/config/http/http'

export default {
  // 登录
  login(params) {
    return post('/login', params)
  },
  // 获取用户信息
  getUserInfo(params) {
    return get('/user/info', params)
  }
}