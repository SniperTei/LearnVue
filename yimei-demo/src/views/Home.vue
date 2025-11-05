<template>
  <Menu 
    :title="'功能列表'" 
    :columns="3" 
    @menu-click="handleMenuClick" 
  />
</template>

<script setup>
import Menu from '@/components/menu/Menu.vue';

const handleMenuClick = (item) => {
  console.log('点击了菜单:', item);
  // 根据item.id跳转到不同页面或执行不同操作
  switch (item.id) {
    case 'items':
      // 跳转到物品管理
      break;
    case 'checkin':
      // 跳转到打卡管理
      break;
    // 其他菜单项处理...
  }
};
</script>

<style scoped></style>