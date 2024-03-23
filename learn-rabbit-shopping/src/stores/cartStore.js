import { defineStore } from "pinia"
import { ref } from "vue"

export const useCartStore = defineStore('cart', () => {
  // 1. 定义管理购物车数据
  const cartList = ref([])
  // 2. 定义添加商品到购物车的action函数
  const addGoodToCart = (good) => {
    // 判断购物车中是否已经有该商品
    const index = cartList.value.findIndex(item => item.id === good.id)
    if (index !== -1) {
      cartList.value[index].count++
    } else {
      cartList.value.push(good)
    }
    console.log('cartList:', cartList.value)
  }
  // 3. 定义清空购物车的action函数
  const clearCart = () => {
    cartList.value = []
  }
  // 3. 以对象的格式把state和action都return出去
  return {
    cartList,
    addGoodToCart,
    clearCart
  }
}, {
  persist: true
})