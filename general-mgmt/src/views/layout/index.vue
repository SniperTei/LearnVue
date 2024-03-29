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
        <el-menu-item index="book">菜单A</el-menu-item>
        <el-menu-item index="movie">菜单B</el-menu-item>
        <el-menu-item index="3">菜单C</el-menu-item>
        <el-menu-item index="4">菜单D</el-menu-item>
      </el-menu>
    </div>
    <!-- 右侧内容 -->
    <div class="container">
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
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  // 右侧具体内容
  .content-container {
    flex: 0;
    padding: 20px;
  }
  // 底部页脚
  .footer-container {
    width: 100%;
    background-color: #f5f5f5;
  }
}
</style>
