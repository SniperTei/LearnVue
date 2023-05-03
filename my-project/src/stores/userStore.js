import { defineStore } from 'pinia'

export const useUserStore  = defineStore('userInfo', {
  state: () => ({
    username: '',
    password: '',
  }),
  actions: {
    login() {
      console.log('user store login')
      this.username = 'admin'
      this.password = '123456'
    },
  },
})