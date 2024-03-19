// 用户数据相关的store
import { defineStore } from "pinia";
import { ref } from "vue";
// import { loginAPI } from '@/apis/user'

export const useUserStore = defineStore('user', () => {
  // 1. 定义管理用户数据
  const userInfo = ref({})
  // 2. 定义获取接口数据的aciton函数
  const getUserInfo = async ({account, password}) => {
    // const res = await loginAPI({account, password})
    console.log('res in user store', '');
    // userInfo.value = res.result
    userInfo.value = {
      account: account,
      mobile: '13800138000',
      token: 'thisisatoken',
      password: password
    }
  }
  // 3. 以对象的格式把state和action都return出去
  return {
    userInfo,
    getUserInfo
  }
}, {
  persist: true
});