<script setup>
import { ref, onMounted, computed } from 'vue';
import { checkInList } from '@/api/checkInApi';
import { Empty, Image, List, PullRefresh, Card, Tag, Button } from 'vant';

// 状态管理
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const checkInRecords = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 获取打卡记录数据
const fetchCheckInRecords = async (page = 1, refresh = false) => {
  if (refresh) {
    refreshing.value = true;
    currentPage.value = 1;
    checkInRecords.value = [];
  } else {
    loading.value = true;
  }

  try {
    const params = {
      page: page,
      limit: pageSize.value
    };

    const response = await checkInList(params);

    if (response.code === 1) {
      const newRecords = response.data.rows || [];

      if (refresh) {
        checkInRecords.value = newRecords;
      } else {
        checkInRecords.value = [...checkInRecords.value, ...newRecords];
      }

      total.value = response.data.total || 0;
      finished.value = checkInRecords.value.length >= total.value;
      currentPage.value = page;
    } else {
      console.error('获取打卡记录失败:', response.msg);
    }
  } catch (error) {
    console.error('获取打卡记录异常:', error);
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

// 处理下拉刷新
const onRefresh = () => {
  fetchCheckInRecords(1, true);
};

// 处理上拉加载
const onLoad = () => {
  if (finished.value || loading.value) {
    return;
  }
  fetchCheckInRecords(currentPage.value + 1);
};

// 查看图片
const viewImage = (imageUrl) => {
  // 这里可以实现图片预览功能
  console.log('查看图片:', imageUrl);
  // 实际项目中可以使用vant的ImagePreview组件
};

// 页面加载时获取数据
onMounted(() => {
  fetchCheckInRecords();
});
</script>

<template>
  <div class="check-in-record-container">
    <h1 class="page-title">打卡记录管理</h1>

    <PullRefresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="checkInRecords.length > 0" class="record-grid">
        <!-- 打卡记录网格 -->
        <Card
          v-for="record in checkInRecords"
          :key="record.id"
          class="record-card"
          :desc="`打卡时间: ${formatTime(record.createtime)}`"
        >
          <template #title>
            <div class="record-title">
              <span>{{ record.user?.username || '未知用户名' }}</span>
              <Tag color="#07c160" v-if="record.score > 0">已评分</Tag>
              <Tag color="#f76260" v-else>未评分</Tag>
            </div>
          </template>

          <div class="record-content">
            <div class="record-image">
              <Image
                v-if="record.itemsimage"
                :src="record.itemsimage"
                fit="cover"
                class="item-image"
                @click="viewImage(record.itemsimage)"
              />
              <div v-else class="no-image">无图片</div>
            </div>

            <div class="record-user-info">
              <div class="user-details">
                <div><strong>用户ID:</strong> {{ record.user_id }}</div>
                <div><strong>物品ID:</strong> {{ record.items_id }}</div>
                <div><strong>评分状态:</strong> {{ record.score > 0 ? `已评分 (${record.score})` : '未评分' }}</div>
                <div v-if="record.user"><strong>用户昵称:</strong> {{ record.user.nickname }}</div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="record-actions">
              <Button size="small" type="primary" v-if="record.score === 0">
                评分
              </Button>
              <Button size="small" type="default">
                详情
              </Button>
            </div>
          </template>
        </Card>
      </div>

      <div v-else class="empty-container">
        <Empty image="search" description="暂无打卡记录" />
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>

      <!-- 没有更多数据提示 -->
      <div v-if="finished && checkInRecords.length > 0" class="finished-text">
        没有更多数据了
      </div>
    </PullRefresh>
  </div>
</template>

<style scoped>
.check-in-record-container {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #323233;
  text-align: center;
}

/* 网格布局 */
.record-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.record-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.record-card:active {
  transform: scale(0.98);
}

.record-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
  flex: 1;
}

.record-image {
  cursor: pointer;
  align-self: center;
}

.no-image {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  border: 1px dashed #ddd;
}

.item-image {
  width: 100%;
  height: 180px;
  border-radius: 8px;
}

.record-user-info {
  flex: 1;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #646566;
}

.record-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.loading-text {
  color: #969799;
  font-size: 14px;
}

.finished-text {
  text-align: center;
  padding: 20px;
  color: #969799;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .check-in-record-container {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .record-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .item-image, .no-image {
    height: 200px;
  }
}

/* 中等屏幕设备 */
@media (min-width: 769px) and (max-width: 1024px) {
  .record-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}
</style>
