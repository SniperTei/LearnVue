<template>
  <div class="business-container">
    <!-- 导航栏 -->
    <div class="navbar">
      <van-icon name="arrow-left" size="24" class="back-icon" @click="goBack" />
      <div class="navbar-title">업무</div>
      <div class="navbar-right"></div>
    </div>
    <!-- 搜索框 -->
    <div class="search-container">
      <van-field
        v-model="searchQuery"
        placeholder="검색"
        left-icon="search"
        class="search-field"
      />
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <div
        v-for="(category, index) in categories"
        :key="index"
        :class="['category-tab', { active: activeCategory === index }]"
        @click="activeCategory = index"
      >
        {{ category }}
      </div>
    </div>

    <!-- 业务列表 -->
    <div class="business-list">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <van-loading type="spinner" color="#07c160" />
        <span class="loading-text">加载中...</span>
      </div>

      <!-- 列表内容 -->
      <template v-else>
        <BusinessItem
          v-for="(item, index) in businessItems"
          :key="index"
          :item="item"
          @click="navigateToCheckIn(item)"
        />

        <!-- 空状态 -->
        <div v-if="businessItems.length === 0" class="empty-state">
          <van-empty description="暂无数据" />
        </div>
      </template>
    </div>

    <!-- 右下角操作按钮 -->
    <div class="action-button">
      <van-icon name="plus" size="32" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Field, Icon, Loading, Empty } from 'vant';
import BusinessItem from '../../components/business-item/BusinessItem.vue';
import { itemList } from '../../api/itemApi.js';

// 路由实例
const router = useRouter();

// 返回上一页
const goBack = () => {
  router.back();
};

// 状态管理
const searchQuery = ref('');
const activeCategory = ref(0);

// 地点分类数据
const categories = ['전체', '위치1', '위치2'];

// 业务列表数据
const businessItems = ref([]);
const loading = ref(false);

// 获取物品列表数据
const fetchItemList = async () => {
  try {
    loading.value = true;
    const params = {
      page: 1,
      // 可以根据需要添加其他参数
    };
    const response = await itemList(params);

    // 将API返回的数据映射为BusinessItem组件需要的格式
    if (response.code === 1 && response.data && response.data.rows) {
      businessItems.value = response.data.rows.map(item => ({
        title: item.name, // 使用name作为标题
        tag: '物品', // 可以根据实际情况设置标签
        image: item.itemimage ? `${import.meta.env.VITE_APP_API_URL}${item.itemimage}` : 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=PIC'
      }));
    }
  } catch (error) {
    console.error('获取物品列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 跳转到打卡页面
const navigateToCheckIn = (item) => {
  // 传递选中的物品信息到打卡页面
  router.push({
    path: '/check-in',
    query: {
      itemId: item.id,
      itemName: item.title,
      itemImage: item.image
    }
  });
};
const fetchMockItemList = async () => {
    // loading.value = true;
    const response = {
        "code": 1,
        "msg": "返回成功",
        "time": "1762657911",
        "data": {
            "total": 11,
            "page": 1,
            "rows": [
                {
                    "id": 2,
                    "name": "笔记本",
                    "content": "笔记本样品",
                    "itemimage": "/uploads/20251027/0a0c7a91d1c417d83a0b6189f8b02f5c.png",
                    "createtime": 1761048715,
                    "updatetime": 1761542637
                },
                {
                    "id": 3,
                    "name": "手机",
                    "content": "手机样品",
                    "itemimage": "/uploads/20251027/8e97fe95bf24b6c618eb8ac485602012.jpg",
                    "createtime": 1761301664,
                    "updatetime": 1761542629
                },
                {
                    "id": 4,
                    "name": "桌面",
                    "content": "桌面",
                    "itemimage": "/uploads/20251027/a13ca981b7ac3eb0dd9d4f04bf745b7b.jpg",
                    "createtime": 1761542596,
                    "updatetime": 1761542596
                },
                {
                    "id": 5,
                    "name": "头疼",
                    "content": "嘎嘎嘎",
                    "itemimage": "/uploads/20251101/70dc083f72f29ab27528abd0e20a07f2.jpg",
                    "createtime": 1761985290,
                    "updatetime": 1761985290
                },
                {
                    "id": 6,
                    "name": "郑楠的物品A",
                    "content": "描述棒棒棒",
                    "itemimage": "/uploads/20251101/3e1dfae9e08c4eece1b64334a2b07d02.jpg",
                    "createtime": 1761985799,
                    "updatetime": 1761985799
                },
                {
                    "id": 7,
                    "name": "郑楠的物品A",
                    "content": "描述棒棒棒",
                    "itemimage": "uploads/20251101/3e1dfae9e08c4eece1b64334a2b07d02.jpg",
                    "createtime": 1762351256,
                    "updatetime": 1762351256
                },
                {
                    "id": 8,
                    "name": "手机",
                    "content": "手机样品",
                    "itemimage": "/uploads/20251027/8e97fe95bf24b6c618eb8ac485602012.jpg",
                    "createtime": 1762498938,
                    "updatetime": 1762498938
                },
                {
                    "id": 9,
                    "name": "笔记本",
                    "content": "笔记本样品",
                    "itemimage": "/uploads/20251027/0a0c7a91d1c417d83a0b6189f8b02f5c.png",
                    "createtime": 1762498996,
                    "updatetime": 1762498996
                },
                {
                    "id": 10,
                    "name": "笔记本",
                    "content": "笔记本样品",
                    "itemimage": "/uploads/20251027/0a0c7a91d1c417d83a0b6189f8b02f5c.png",
                    "createtime": 1762499029,
                    "updatetime": 1762499029
                },
                {
                    "id": 11,
                    "name": "笔记本",
                    "content": "笔记本样品",
                    "itemimage": "/uploads/20251027/0a0c7a91d1c417d83a0b6189f8b02f5c.png",
                    "createtime": 1762499103,
                    "updatetime": 1762499103
                },
                {
                    "id": 12,
                    "name": "头疼",
                    "content": "嘎嘎嘎",
                    "itemimage": "/uploads/20251101/70dc083f72f29ab27528abd0e20a07f2.jpg",
                    "createtime": 1762500382,
                    "updatetime": 1762500382
                }
            ]
        }
    }
    businessItems.value = response.data.rows.map(item => ({
        title: item.name, // 使用name作为标题
        tag: '物品', // 可以根据实际情况设置标签
        image: item.itemimage ? `${import.meta.env.VITE_APP_API_URL}${item.itemimage}` : 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=PIC'
      }));
};

// 组件挂载时获取数据
onMounted(() => {
  // fetchItemList();
  fetchMockItemList();
});
</script>

<style lang="scss" scoped>
// @import '../../styles/variables.scss';
@use '../../styles/variables.scss' as *;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.business-container {
    min-height: 100vh;
    background-color: $bg-secondary;
    padding-bottom: 70px; // 为底部操作按钮留出空间

    // 导航栏
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px $spacing-base 12px;
      background-color: $bg-primary;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .back-icon {
        color: $text-primary;
        cursor: pointer;
      }

      .navbar-title {
        font-size: 18px;
        font-weight: 600;
        color: $text-primary;
        margin: 0 auto;
      }

      .navbar-right {
        width: 24px; // 占位，保持标题居中
      }
    }

  // 搜索框
  .search-container {
    padding: 0 $spacing-base $spacing-base;
    background-color: $bg-primary;

    .search-field {
      --field-background: $bg-secondary;
      --field-border-radius: 8px;
    }
  }

  // 分类标签
  .category-tabs {
    display: flex;
    padding: $spacing-base;
    background-color: $bg-primary;
    margin-bottom: $spacing-small;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    .category-tab {
      padding: 8px 16px;
      border-radius: $border-radius-small;
      background-color: $bg-secondary;
      color: $text-secondary;
      font-size: 14px;
      margin-right: $spacing-small;
      white-space: nowrap;

      &.active {
        background-color: $primary-color;
        color: white;
      }
    }
  }

  // 业务列表
  .business-list {
    padding: 0 $spacing-base;
    min-height: 300px;

    // 加载状态容器
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;

      .loading-text {
        margin-top: 12px;
        font-size: 14px;
        color: $text-secondary;
      }
    }

    // 空状态容器
    .empty-state {
      padding: 40px 0;
    }
  }

  // 右下角操作按钮
  .action-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: $primary-color;
    color: white;
    @include flex-center;
    box-shadow: 0 4px 10px rgba(7, 193, 96, 0.3);
  }
}
</style>
