<script setup>
// import { ref } from 'vue'
// import { useUserStore } from '@/stores/userStore'
// const userStore = useUserStore()
</script>
<template>
  <div class="common-layout">
    <!-- 左侧菜单部分 -->
    <div class="menu-container">
      <!-- 后台管理系统title -->
      <div class="menu-title">后台管理系统</div>
      <el-menu
        default-active="1"
        background-color="#324157"
        text-color="#fff"
        active-text-color="#409eff"
        router
      >
        <router-link to="/booklist" index="booklist">
          <el-menu-item>图书</el-menu-item>
        </router-link>
        <router-link to="/movielist" index="movielist">
          <el-menu-item>影视</el-menu-item>
        </router-link>
        <router-link to="/c" index="">
          <el-menu-item>菜单C</el-menu-item>
        </router-link>
        <router-link to="/d" index="">
          <el-menu-item>菜单D</el-menu-item>
        </router-link>
      </el-menu>
    </div>
    <!-- 右侧内容 -->
    <div class="container">
      <!-- 左上角菜单标题 -->
      <div class="header-container">
        <!-- title -->
        <div class="header-container-title">
          <!-- <div>预留 可能以后要用</div> -->
        </div>
        <!-- info -->
        <div class="header-container-navi">
          <div>Sniper</div>
          <div>设置</div>
          <div>退出</div>
        </div>
      </div>
      <div class="title-container">图书列表</div>
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
    .menu-title {
      color: #fff;
      font-size: 20px;
      text-align: center;
      padding: 20px;
    }
  }
  // 右侧内容
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    .header-container {
      width: 100%;
      // 右侧对齐 横向排列
      display: flex;
      justify-content: space-between;
      .header-container-title {
        font-size: 20px;
        color: #333;
      }
      .header-container-navi {
        display: flex;
        div {
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }
    // 右上角菜单标题
    .title-container {
      font-size: 20px;
      color: #333;
      padding: 20px;
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
}
</style>
