<script setup>
// import { ref } from 'vue'
// import { useUserStore } from '@/stores/userStore'
// const userStore = useUserStore()
</script>
<template>
  <div class="common-layout">
    <!-- 左侧菜单部分 -->
    <div class="menu-container">
      <el-menu
        default-active="1"
        background-color="#324157"
        text-color="#fff"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="book">图书管理</el-menu-item>
        <el-menu-item index="movie">电影管理</el-menu-item>
        <el-menu-item index="3">酒精管理</el-menu-item>
        <el-menu-item index="4">健身管理</el-menu-item>
      </el-menu>
    </div>
    <!-- 右侧具体内容 -->
    <div class="content-container">
      <RouterView />
    </div>
    <!-- 底部页脚 -->
    <div class="footer-container">
      <el-footer height="60px" style="text-align: center; line-height: 60px;">
        ©2021-2024 Sniper Company 版权所有
      </el-footer>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.common-layout {
  display: flex;
  height: 100vh;
  // 左侧菜单部分
  .menu-container {
    width: 200px;
    background-color: #324157;
  }
  // 右侧具体内容
  .content-container {
    flex: 1;
    padding: 20px;
    
  }
  // 底部页脚
  .footer-container {
    width: 100%;
  }
}
</style>
