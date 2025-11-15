<template>
  <div class="checkin-detail-container">
    <!-- 导航栏 -->
    <div class="navbar">
      <van-icon name="arrow-left" size="24" class="back-icon" @click="goBack" />
      <div class="navbar-title">业务详情</div>
      <div class="navbar-right"></div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">加载中...</div>
      </div>
    </div>

    <!-- 打卡内容区域 -->
    <div v-if="!isLoading" class="checkin-content">
      <!-- 选中的物品信息 -->
      <div v-if="selectedItem.name" class="selected-item-info">
        <p class="item-name">选择的项目: {{ selectedItem.name }}</p>
      </div>

      <!-- 分类标签 -->
      <div class="category-section">
        <div class="category-selector">
          <van-field
            v-model="selectedCategory"
            placeholder="相关文本框"
            readonly
          />
        </div>
      </div>

      <!-- 图片显示区域 -->
      <div class="image-section">
        <!-- 图片对比显示 -->
        <div class="image-comparison">
          <!-- 样板图片 -->
          <div class="image-container">
            <div class="image-label">样板</div>
            <img
              v-if="templateImage"
              :src="templateImage"
              alt="样板图片"
              class="display-image"
              @click="viewImage(templateImage)"
            />
            <div v-else class="placeholder-image">
              <van-icon name="photo" size="48" color="#CCCCCC" />
            </div>
          </div>

          <!-- 现在的图片 -->
          <div class="image-container">
            <div class="image-label">现在</div>
            <img
              v-if="currentImage"
              :src="currentImage"
              alt="现在的图片"
              class="display-image"
              @click="viewImage(currentImage)"
            />
            <div v-else class="placeholder-image">
              <van-icon name="photo" size="48" color="#CCCCCC" />
            </div>

            <!-- 分数显示组件 -->
            <div v-if="showScore && score > 0" class="score-display">
              <div class="score-circle">
                <div class="score-number">{{ score }}</div>
                <div class="score-label">分数</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 打卡信息 -->
      <div class="checkin-info-section">
        <div class="info-item">
          <span class="info-label">打卡时间:</span>
          <span class="info-value">{{ checkInTime }}</span>
        </div>
        <div class="info-item" v-if="checkInLocation">
          <span class="info-label">打卡位置:</span>
          <span class="info-value">{{ checkInLocation }}</span>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <van-image-preview
      v-model:show="showImagePreview"
      :images="previewImages"
      :start-position="previewIndex"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Icon, Field, ImagePreview } from 'vant';
import { checkInDetail } from '@/api/checkInApi';

// 路由实例
const router = useRouter();
const route = useRoute();

// 返回上一页
const goBack = () => {
  router.back();
};

// 状态管理
const isLoading = ref(true);
const selectedCategory = ref('');
const templateImage = ref('');
const currentImage = ref('');
const selectedItem = ref({
  id: '',
  name: '',
  image: ''
});

// 分数展示相关状态
const score = ref(0);
const showScore = ref(false);

// 打卡信息
const checkInTime = ref('');
const checkInLocation = ref('');

// 图片预览相关
const showImagePreview = ref(false);
const previewImages = ref([]);
const previewIndex = ref(0);

// 查看图片
const viewImage = (imageUrl) => {
  if (imageUrl) {
    // 设置预览图片数组，包含模板和当前图片
    const images = [];
    if (templateImage.value) images.push(templateImage.value);
    if (currentImage.value) images.push(currentImage.value);

    previewImages.value = [...new Set(images)]; // 去重
    previewIndex.value = previewImages.value.indexOf(imageUrl);
    showImagePreview.value = true;
  }
};

// 获取打卡详情
const fetchCheckInDetailData = async () => {
  const recordId = route.query.id;

  if (!recordId) {
    console.warn('未提供记录ID');
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await checkInDetail({ id: recordId });

    if (response && response.code === 1 && response.data) {
      const data = response.data;
      // 更新项目信息
      selectedItem.value = {
        id: data.items_id || recordId,
        name: data.items.name || '未命名项目',
        image: data.itemsimage ? `${import.meta.env.VITE_APP_API_URL}${data.itemsimage}` : ''
      };

      // 主图片使用根级别的itemsimage
      templateImage.value = data.items.itemimage ? `${import.meta.env.VITE_APP_API_URL}${data.items.itemimage}` : '';
      // 当前图片使用items对象中的itemimage，并拼接环境变量URL
      currentImage.value = selectedItem.value.image;

      // 更新分类信息
      if (data.category) {
        selectedCategory.value = data.category;
      }

      // 更新分数显示
      if (data.score !== undefined) {
        score.value = data.score;
        showScore.value = true;
      }

      // 更新打卡信息
      if (data.create_time) {
        checkInTime.value = new Date(data.create_time).toLocaleString('zh-CN');
      }
      if (data.location) {
        checkInLocation.value = data.location;
      }
    }
  } catch (error) {
    console.error('获取打卡详情失败:', error);
    alert('无法加载详细信息。');
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时调用
onMounted(() => {
  console.log('路由参数:', route.query);
  fetchCheckInDetailData();
});
</script>

<style lang="scss" scoped>
// 引入变量
@use '../../styles/variables.scss' as *;

// 变量别名
$spacing-large: $spacing-lg;
$border-color: #e4e4e4;
$background-color: $bg-secondary;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkin-detail-container {
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
      width: 24px;
    }
  }

  // 打卡内容区域
  .checkin-content {
    padding: $spacing-base;

    // 选中物品信息样式
    .selected-item-info {
      margin-bottom: $spacing-base;
      padding: $spacing-base;
      background-color: $bg-primary;
      border-radius: $border-radius-small;

      .item-name {
        margin: 0;
        color: $text-primary;
        font-size: 14px;
        text-align: center;
      }
    }
  }

  // 分类部分
  .category-section {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-lg;
    background-color: $bg-primary;
    border-radius: $border-radius-small;
    padding: $spacing-base;

    .category-selector {
      flex: 1;
    }
  }

  // 图片部分
  .image-section {
    margin-bottom: $spacing-lg;
    text-align: center;

    .image-comparison {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .image-container {
      flex: 1;
      min-width: 200px;
      max-width: 300px;
      height: 200px;
      background-color: $bg-primary;
      border-radius: $border-radius-small;
      overflow: hidden;
      margin-bottom: $spacing-base;
      border: 1px solid $border-color;
      position: relative;

      .image-label {
        background-color: $bg-primary;
        padding: 8px;
        font-size: $font-size-sm;
        color: $text-secondary;
        border-bottom: 1px solid $border-color;
        font-weight: 500;
      }

      .display-image {
        width: 100%;
        height: auto;
        max-height: 250px;
        object-fit: contain;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.02);
        }
      }

      .placeholder-image {
        width: 100%;
        height: 100%;
        @include flex-center;
        background-color: #f5f5f5;
      }

      // 分数展示样式
      .score-display {
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 10;
      }

      .score-circle {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }

      .score-number {
        font-size: 18px;
        font-weight: bold;
        line-height: 1;
      }

      .score-label {
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }

  // 打卡信息部分
  .checkin-info-section {
    background-color: $bg-primary;
    border-radius: $border-radius-small;
    padding: $spacing-base;
    margin-bottom: $spacing-lg;

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 14px;
        color: $text-secondary;
      }

      .info-value {
        font-size: 14px;
        color: $text-primary;
        font-weight: 500;
      }
    }
  }

  /* 加载遮罩样式 */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .loading-content {
    background-color: white;
    padding: $spacing-base $spacing-large;
    border-radius: $border-radius-small;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: $font-size-md;
    color: $text-primary;
  }
}
</style>
