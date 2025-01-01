<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu as IconMenu, Location, Document, Setting } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const handleSelect = (key) => {
  router.push(key)
}
</script>

<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="@/assets/logo.svg" class="logo" alt="logo">
      <span class="title" v-show="!isCollapse">YOLO系统</span>
    </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-menu-item index="/book">
        <el-icon><document /></el-icon>
        <template #title>图书管理</template>
      </el-menu-item>
      <el-menu-item index="/movie">
        <el-icon><location /></el-icon>
        <template #title>电影管理</template>
      </el-menu-item>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><IconMenu /></el-icon>
          <span>饮品管理</span>
        </template>
        <el-menu-item index="/alcohol">酒品管理</el-menu-item>
        <el-menu-item index="/drink">饮品管理</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/food">
        <el-icon><setting /></el-icon>
        <template #title>美食管理</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  height: 100vh;
  background-color: #304156;
  
  .logo-container {
    height: 50px;
    padding: 10px;
    display: flex;
    align-items: center;
    background: #2b2f3a;
    
    .logo {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }
    
    .title {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
    }
  }
  
  .el-menu-vertical {
    border-right: none;
    
    &:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>
