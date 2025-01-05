<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
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
          title: menu.meta?.title || menu.title,
          path: currentBasePath,
          redirect: menu.redirect
        })
        
        if (menu.children && menu.children.length) {
          findMenuPath(menu.children, currentBasePath)
        }
      }
    }
  }

  // 从路由匹配记录中获取完整的面包屑
  const matched = route.matched
  if (matched.length) {
    // 先从菜单中查找主要路径
    findMenuPath(menus)
    
    // 检查最后一个匹配项是否已包含在结果中
    const lastMatched = matched[matched.length - 1]
    const lastPath = lastMatched.path
    const lastTitle = lastMatched.meta?.title
    
    if (lastPath && lastTitle && !result.find(item => item.path === lastPath)) {
      result.push({
        title: lastTitle,
        path: lastPath
      })
    }
  }

  return result
})

// 处理面包屑点击
const handleClick = (item) => {
  if (item.path === route.path) return
  
  // 如果有重定向路径，优先使用重定向路径
  const targetPath = item.redirect || item.path
  router.push(targetPath)
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item @click="router.push('/')" :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item 
      v-for="item in breadcrumbs" 
      :key="item.path"
      @click="handleClick(item)"
      :to="{ path: item.redirect || item.path }"
    >
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.el-breadcrumb {
  line-height: 34px;
  font-size: 14px;

  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      cursor: pointer;
      
      &:hover {
        color: var(--el-color-primary);
      }
      
      &.is-link {
        font-weight: normal;
      }
    }
  }
}
</style>
