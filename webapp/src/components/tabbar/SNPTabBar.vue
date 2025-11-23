<template>
  <div class="tabbar-wrapper">
    <van-tabbar v-model="active" route :active-color="activeColor" fixed>
      <van-tabbar-item v-for="item in tabbarItems" :key="item.name"
        :icon="item.icon" :to="item.to" :name="item.name">
        {{ item.name }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Tabbar, TabbarItem } from 'vant';

const tabbarItems = [
  { name: '首页', icon: 'home-o', to: '/' },
  { name: '学习', icon: 'medal-o', to: '/study' },
  { name: '待定', icon: 'apps-o', to: '/what' },
  { name: '我的', icon: 'user-o', to: '/mine' },
];

// 使用路由获取当前路径，以正确设置激活状态
const route = useRoute();

// 计算当前激活的标签
const active = computed(() => {
  const path = route.path;
  return tabbarItems.find(item => item.to === path)?.name || 'home';
});

// 激活状态的颜色，与主题色保持一致
const activeColor = 'var(--van-primary-color)'; // 使用主题红色
</script>

<style scoped lang="scss">
.tabbar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
