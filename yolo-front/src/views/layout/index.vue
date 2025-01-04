<template>
  <div class="app-wrapper" :class="{ collapsed: isCollapse }">
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" :is-collapse="isCollapse" />
    
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="header-container">
        <navbar @toggle-sidebar="toggleSidebar" />
      </div>
      
      <!-- 面包屑导航 -->
      <breadcrumb class="breadcrumb-container" />
      
      <!-- 主要内容区 -->
      <div class="app-main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'

const isCollapse = ref(false)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  
  &.collapsed {
    .sidebar-container {
      width: 64px;
    }
    
    .main-container {
      margin-left: 64px;
    }
  }
}

.sidebar-container {
  width: 210px;
  height: 100%;
  background-color: #304156;
  transition: width 0.3s;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
}

.main-container {
  flex: 1;
  margin-left: 210px;
  transition: margin-left 0.3s;
  
  .header-container {
    height: 50px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
  
  .breadcrumb-container {
    padding: 8px 20px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    margin-bottom: 1px;
  }
  
  .app-main {
    padding: 20px;
    height: calc(100vh - 100px);
    overflow: auto;
    background-color: #f0f2f5;
  }
}
</style>
