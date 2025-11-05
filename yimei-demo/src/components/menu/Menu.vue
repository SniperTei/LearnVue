<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 定义props
const props = defineProps({
  // 菜单标题
  title: {
    type: String,
    default: '功能菜单'
  },
  // 菜单列数
  columns: {
    type: Number,
    default: 2
  }
});

// 定义emits
const emit = defineEmits(['menu-click']);

// 路由实例
const router = useRouter();

// 菜单项数据
const menuItems = ref([
  {
    id: 'items',
    title: '物品管理',
    icon: 'goods-o',
    color: '#07c160'
  },
  {
    id: 'checkin',
    title: '打卡管理',
    icon: 'clock-o',
    color: '#1989fa'
  },
  {
    id: 'records',
    title: '打卡记录',
    icon: 'list-o',
    color: '#ff976a'
  },
  {
    id: 'settings',
    title: '设置',
    icon: 'setting-o',
    color: '#646566'
  },
  {
    id: 'others',
    title: '其他功能待定',
    icon: 'more-o',
    color: '#969799',
    disabled: true
  }
]);

// 处理菜单点击事件
const handleMenuClick = (item) => {
  if (!item.disabled) {
    // 先触发事件
    emit('menu-click', item);

    // 根据菜单项ID进行路由跳转
    switch (item.id) {
      case 'records':
        // 跳转到打卡记录管理页面
        router.push('/check-in-records');
        break;
      // 可以在这里添加其他菜单项的路由跳转
      case 'items':
        // 将来可能跳转到物品管理页面
        break;
      case 'checkin':
        // 将来可能跳转到打卡管理页面
        break;
      case 'settings':
        // 将来可能跳转到设置页面
        break;
    }
  }
};
</script>

<template>
  <div class="grid-menu">
    <!-- 菜单标题 -->
    <div class="menu-header" v-if="title">
      <h3 class="menu-title">{{ title }}</h3>
    </div>

    <!-- 网格菜单主体 -->
    <div class="menu-grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="menu-item"
        :class="{ 'menu-item-disabled': item.disabled }"
        @click="handleMenuClick(item)"
      >
        <!-- 菜单图标 -->
        <div class="menu-icon-wrapper">
          <div class="menu-icon" :style="{ backgroundColor: item.color + '20' }">
            <van-icon :name="item.icon" :color="item.color" size="32" />
          </div>
        </div>

        <!-- 菜单标题 -->
        <div class="menu-item-title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-menu {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.menu-header {
  margin-bottom: 20px;
}

.menu-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #323233;
}

.menu-grid {
  display: grid;
  gap: 20px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  border-radius: 8px;
  background-color: #f7f8fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:hover:not(.menu-item-disabled) {
  background-color: #ebedf0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-item-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.menu-icon-wrapper {
  margin-bottom: 12px;
}

.menu-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item-title {
  font-size: 14px;
  color: #323233;
  text-align: center;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid-menu {
    padding: 16px;
  }

  .menu-grid {
    gap: 16px;
  }

  .menu-item {
    padding: 16px 8px;
  }

  .menu-icon {
    width: 56px;
    height: 56px;
  }

  .van-icon {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
