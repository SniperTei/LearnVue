<template>
  <div class="checkin-record-container">
    <!-- 导航栏 -->
    <div class="navbar">
      <van-icon name="arrow-left" size="24" class="back-icon" @click="goBack" />
      <div class="navbar-title">记录</div>
      <div class="navbar-right"></div>
    </div>
    <!-- 搜索框 -->
    <div class="search-container">
      <van-field
        v-model="searchQuery"
        placeholder="搜索"
        left-icon="search"
        class="search-field"
        @input="handleSearch"
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

    <!-- 记录列表 -->
    <div class="record-list">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <van-loading type="spinner" color="#07c160" />
        <span class="loading-text">加载中...</span>
      </div>

      <!-- 列表内容 -->
      <template v-else>
        <div
          v-for="(record, index) in filteredRecords"
          :key="index"
          class="record-item"
          @click="navigateToCheckInDetail(record)"
        >
          <div class="record-image">
            <img :src="record.image" alt="打卡图片" class="item-image" />
          </div>
          <div class="record-info">
            <div class="record-title">{{ record.checkInPerson }}</div>
            <div class="record-meta">
              <span class="record-date">{{ formatDate(record.createtime) }}</span>
              <span class="record-score">分数: {{ record.score }}</span>
            </div>
          </div>
          <div class="record-arrow">
            <van-icon name="arrow" size="20" color="#999" />
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredRecords.length === 0" class="empty-state">
          <van-empty description="暂无记录" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Field, Icon, Loading, Empty } from 'vant';
import { checkInList } from '../../api/checkInApi';

// 路由实例
const router = useRouter();

// 返回上一页
const goBack = () => {
  router.back();
};

// 状态管理
const searchQuery = ref('');
const activeCategory = ref(0);
const records = ref([]);
const loading = ref(false);

// 分类数据
const categories = ['全部', '位置1', '位置2', '位置3'];

// 计算过滤后的记录
const filteredRecords = computed(() => {
  let result = records.value;

  // 根据分类筛选
  if (activeCategory.value > 0) {
    // 实际应用中这里会根据分类ID筛选
    // 这里仅做演示
    result = result.filter(record =>
      record.category === categories[activeCategory.value]
    );
  }

  // 根据搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(record =>
      record.itemName.toLowerCase().includes(query) ||
      record.description.toLowerCase().includes(query)
    );
  }

  return result;
});

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000); // 假设时间戳是秒级的
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 获取打卡记录列表
const fetchClockList = async () => {
  try {
    loading.value = true;
    const params = {
      page: 1,
      limit: 20
    };
    const response = await checkInList(params);

    if (response.code === 1 && response.data && response.data.rows) {
      records.value = response.data.rows.map(item => ({
        id: item.id,
        checkInPerson: item.user.nickname || '未知',
        image: item.itemsimage ? `${import.meta.env.VITE_APP_API_URL}${item.itemsimage}` : 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=PIC',
        score: item.score || 0,
        createtime: item.createtime,
        category: '位置1' // 假设分类信息，实际应从API获取
      }));
    }
  } catch (error) {
    console.error('获取打卡记录失败:', error);
  } finally {
    loading.value = false;
  }
};

// 模拟数据获取（用于开发测试）
const fetchMockClockList = async () => {
  // 模拟API响应延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 模拟数据
  const mockData = {
    "code": 1,
    "msg": "返回成功",
    "time": "1762954536",
    "data": {
      "total": 5,
      "page": 1,
      "rows": [
        {
          "id": 1,
          "user_id": 3,
          "items_id": "6",
          "items_name": "郑楠的物品A",
          "itemsimage": "/uploads/20251112/e13a3692b8ffed87adfaf7261b21a4d2.jpg",
          "createtime": 1762954536,
          "score": 39.83
        },
        {
          "id": 2,
          "user_id": 3,
          "items_id": "2",
          "items_name": "笔记本",
          "itemsimage": "/uploads/20251112/0a0c7a91d1c417d83a0b6189f8b02f5c.jpg",
          "createtime": 1762944536,
          "score": 85.25
        },
        {
          "id": 3,
          "user_id": 3,
          "items_id": "3",
          "items_name": "手机",
          "itemsimage": "/uploads/20251112/8e97fe95bf24b6c618eb8ac485602012.jpg",
          "createtime": 1762934536,
          "score": 72.50
        },
        {
          "id": 4,
          "user_id": 3,
          "items_id": "4",
          "items_name": "桌面",
          "itemsimage": "/uploads/20251112/a13ca981b7ac3eb0dd9d4f04bf745b7b.jpg",
          "createtime": 1762924536,
          "score": 90.00
        },
        {
          "id": 5,
          "user_id": 3,
          "items_id": "5",
          "items_name": "头疼",
          "itemsimage": "/uploads/20251112/70dc083f72f29ab27528abd0e20a07f2.jpg",
          "createtime": 1762914536,
          "score": 65.75
        }
      ]
    }
  };

  // 处理数据格式
  records.value = mockData.data.rows.map(item => ({
    id: item.id,
    itemName: item.items_name || '未命名物品',
    image: item.itemsimage ? `${import.meta.env.VITE_APP_API_URL}${item.itemsimage}` : 'https://via.placeholder.com/80/CCCCCC/FFFFFF?text=PIC',
    score: item.score || 0,
    createtime: item.createtime,
    category: activeCategory.value === 0 ? '位置1' : categories[activeCategory.value] // 模拟分类数据
  }));

  loading.value = false;
};

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已通过computed属性处理
  console.log('搜索关键词:', searchQuery.value);
};

// 跳转到打卡详情页面
const navigateToCheckInDetail = (record) => {
  router.push({
    path: '/check-in-detail',
    query: {
      id: record.id,
      fromRecord: 'true', // 标记来源为记录页面
      itemId: record.items_id || '',
      itemName: record.itemName || record.checkInPerson || '',
      image: record.image,
    }
  });
};

// 组件挂载时获取数据
onMounted(() => {
  // 优先使用模拟数据进行开发测试
  // fetchMockClockList();

  // 实际项目中使用真实API
  fetchClockList();
});
</script>

<style lang="scss" scoped>
// 引入变量
@use '../../styles/variables.scss' as *;

// 变量别名，解决未定义变量问题
$spacing-large: $spacing-lg;
$border-color: #e4e4e4; // 定义边框颜色变量
$background-color: $bg-secondary; // 使用已定义的背景色变量

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkin-record-container {
  min-height: 100vh;
  background-color: $bg-secondary;

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

  // 记录列表
  .record-list {
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

    // 记录项
    .record-item {
      display: flex;
      align-items: center;
      padding: $spacing-base;
      background-color: $bg-primary;
      border-radius: $border-radius-small;
      margin-bottom: $spacing-base;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;

      &:active {
        transform: scale(0.98);
      }

      .record-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        margin-right: $spacing-base;

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .record-info {
        flex: 1;
        min-width: 0;

        .record-title {
          font-size: 16px;
          font-weight: 500;
          color: $text-primary;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .record-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;

          .record-date {
            color: $text-secondary;
          }

          .record-score {
            color: $primary-color;
            font-weight: 500;
          }
        }
      }

      .record-arrow {
        margin-left: $spacing-small;
      }
    }
  }
}
</style>
