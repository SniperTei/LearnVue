<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item 
      v-for="item in breadcrumbs" 
      :key="item.path"
      :to="{ path: item.path }"
    >
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

// 根据当前路由和菜单数据生成面包屑
const breadcrumbs = computed(() => {
  const result = []
  const currentPath = route.path
  const menus = userStore.menus

  // 递归查找当前路径对应的菜单项
  const findMenuPath = (menuList, basePath = '') => {
    for (const menu of menuList) {
      const currentBasePath = basePath ? `${basePath}/${menu.path}` : menu.path
      
      if (currentPath.startsWith(currentBasePath)) {
        result.push({
          title: menu.title,
          path: currentBasePath
        })
        
        if (menu.children && menu.children.length) {
          findMenuPath(menu.children, currentBasePath)
        }
      }
    }
  }

  findMenuPath(menus)
  return result
})
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  line-height: 34px;
  font-size: 14px;
}
</style>
