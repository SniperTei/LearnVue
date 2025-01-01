import { defineStore } from "pinia"
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  // 是否折叠
  const collapse = ref(false)
  const bgColor = ref('#324157')
  const textColor = ref('#bfcbd9')

  const handleCollapse = () => {
    collapse.value = !collapse.value
  }

  // 设置背景色
  const setBgColor = (color) => {
    bgColor.value = color
  }

  // 设置文字颜色
  const setTextColor = (color) => {
    textColor.value = color
  }

  return {
    collapse,
    bgColor,
    textColor,
    handleCollapse,
    setBgColor,
    setTextColor
  }
})
