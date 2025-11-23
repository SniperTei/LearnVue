<script setup>
import SNPTabBar from './components/tabbar/SNPTabBar.vue';
</script>

<template>
  <div class="app-container">
    <router-view />
    <SNPTabBar />
  </div>
</template>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
  padding-bottom: 50px; /* 为底部导航栏预留空间 */
}
</style>
