import { defineStore } from "pinia"
import { ref } from "vue"
import { computed } from "vue"

export const useCartStore = defineStore('cart', () => {
  // 1. 定义管理购物车数据
  const cartList = ref([])
  // 2. 定义添加商品到购物车的action函数
  const addGoodToCart = (good) => {
    // 判断购物车中是否已经有该商品
    const index = cartList.value.findIndex(item => item.skuId === good.skuId)
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
  // 删除购物车中的商品
  const delCart = (skuId) => {
    const index = cartList.value.findIndex(item => item.skuId === skuId)
    if (index !== -1) {
      cartList.value.splice(index, 1)
    }
  }
  // 单选功能
  const singleCheck = (skuId) => {
    const index = cartList.value.findIndex(item => item.skuId === skuId)
    cartList.value[index].selected = !cartList.value[index].selected
  }

  // 计算属性
  // 总数量
  const totalCount = computed(() => {
    return cartList.value.reduce((total, item) => total + item.count, 0)
  })
  // 总价钱
  const totalPrice = computed(() => {
    return cartList.value.reduce((total, item) => total + item.count * item.price, 0)
  })

  //  以对象的格式把state和action都return出去
  return {
    cartList,
    addGoodToCart,
    clearCart,
    delCart,
    totalCount,
    totalPrice,
    singleCheck
  }
}, {
  persist: true
})