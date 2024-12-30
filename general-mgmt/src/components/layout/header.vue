<script setup>
import { onMounted } from 'vue';
import { useSidebarStore } from '@/stores/sidebar';
import { useRouter } from 'vue-router';
const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChage = () => {
    sidebar.handleCollapse();
};

onMounted(() => {
    if (document.body.clientWidth < 1500) {
        collapseChage();
    }
});
</script>

<template>
  <header class="header">
    <div class="header-left">
      <!-- <img src="@/assets/logo.png" alt="Logo" class="logo" /> -->
      <div class="collapse-btn" @click="collapseChage"></div>
    </div>
    <div class="header-right">
      <div class="header-right-icon">消息</div>
      <div class="header-right-icon">设置</div>
      <el-avatar class="user-avator" :size="30" />
      <!-- 再来个下拉菜单 -->
      
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  // TODO var color
  background-color: lightgray;
  color: #ffffff;
  width: 100%;
  height: 70px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.collapse-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    opacity: 0.8;
    font-size: 22px;
}

.collapse-btn:hover {
    opacity: 1;
}

.header-right {
  display: flex;
  align-items: center;
  .header-right-icon {
    margin: 0 5px;
    font-size: 14px;
  }
}

.icon-settings {
  font-size: 24px;
  margin-right: 20px;
  cursor: pointer;
}

.user-portrait {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  cursor: pointer;
}
</style>