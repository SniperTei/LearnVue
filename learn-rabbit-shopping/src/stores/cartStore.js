import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useUserStore } from "./userStore"
import { insertCartAPI, getCartAPI, delCartAPI } from "@/apis/cart"

export const useCartStore = defineStore('cart', () => {
  // 定义管理购物车数据
  const cartList = ref([])
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token !== '')
  // actions
  // 定义添加商品到购物车的action函数
  const addGoodToCart = async (good) => {
    let { skuId, count } = good
    if (isLogin.value) { // 如果用户已经登录，从后端获取购物车数据
      await insertCartAPI({ skuId, count })
      updateCartList()
      return
    } 
    // 判断购物车中是否已经有该商品
    const index = cartList.value.findIndex(item => item.skuId === good.skuId)
    if (index !== -1) {
      cartList.value[index].count++
    } else {
      cartList.value.push(good)
    }
    console.log('cartList:', cartList.value)
  }
  // 定义清空购物车的action函数
  const clearCart = () => {
    cartList.value = []
  }
  // 删除购物车中的商品
  const delCart = async (skuId) => {
    if (isLogin.value) { // 如果用户已经登录，调接口删除购物车数据
      await delCartAPI([skuId])
      updateCartList()
      return
    }
    const index = cartList.value.findIndex(item => item.skuId === skuId)
    if (index !== -1) {
      cartList.value.splice(index, 1)
    }
  }
  // 获取最新购物车列表action
  const updateCartList = async () => {
    let res = await getCartAPI()
    cartList.value = res.data.result
  }
  // 单选功能
  const singleCheck = (skuId) => {
    const index = cartList.value.findIndex(item => item.skuId === skuId)
    cartList.value[index].selected = !cartList.value[index].selected
  }
  // 全选功能
  const allCheck = (selected) => {
    cartList.value.forEach(item => {
      item.selected = selected
    })
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

  // 是否全选
  const isAllSelected = computed(() => {
    return cartList.value.length > 0 && cartList.value.every(item => item.selected)
  })

  // 已选择数量
  const selectedCount = computed(() => {
    return cartList.value.reduce((total, item) => item.selected ? total + item.count : total, 0)
  })
  // 已选择总价
  const selectedPrice = computed(() => {
    return cartList.value.reduce((total, item) => item.selected ? total + item.count * item.price : total, 0)
  })

  //  以对象的格式把state和action都return出去
  return {
    cartList,
    addGoodToCart,
    clearCart,
    delCart,
    totalCount,
    totalPrice,
    singleCheck,
    isAllSelected,
    allCheck,
    selectedCount,
    selectedPrice
  }
}, {
  persist: true
})