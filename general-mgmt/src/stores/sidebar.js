import { defineStore } from "pinia";

export const useSidebarStore = defineStore('sidebar', () => {
  // 是否折叠
  let collapse = false
  let bgColor = '#324157'
  let textColor = '#bfcbd9'

  const handleCollapse = () => {
    collapse = !collapse;
  }
  // 设置背景色
  const setBgColor = (bgColor) => {
    this.bgColor = bgColor
  }
  // 设置文字颜色
  const setTextColor = (textColor) => {
    this.textColor = textColor
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
