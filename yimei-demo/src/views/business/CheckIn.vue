<template>
  <div class="checkin-container">
    <!-- 导航栏 -->
    <div class="navbar">
      <van-icon name="arrow-left" size="24" class="back-icon" @click="goBack" />
      <div class="navbar-title">打卡</div>
      <div class="navbar-right"></div>
    </div>

    <!-- 打卡内容区域 -->
      <div class="checkin-content">
        <!-- 选中的物品信息 -->
        <div v-if="selectedItem.name" class="selected-item-info">
          <p class="item-name">选择的物品: {{ selectedItem.name }}</p>
        </div>

        <!-- 标题和序号 -->
        <div class="title-section">
          <!-- <div class="title-label">원본</div> -->
          <!-- <div class="step-number">1</div> -->
        </div>

      <!-- 分类标签 -->
      <div class="category-section">
        <!-- <div class="category-number">2</div> -->
        <div class="category-selector">
          <van-field
            v-model="selectedCategory"
            placeholder="选择分类"
            readonly
            clickable
            @click="showCategoryPicker = true"
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

        <!-- 拍照/选择图片按钮 -->
        <div class="action-section">
          <div class="image-actions">
            <van-button type="default" size="small" class="comparison-btn" >样板</van-button>
            <van-button type="primary" size="small" @click="takePhoto('current')" class="photo-btn">拍照</van-button>
          </div>
        </div>
      </div>

      <!-- 打卡按钮 -->
      <div class="checkin-button-section">
        <van-button type="primary" size="large" @click="checkInClick" class="checkin-btn" :disabled="isLoading">{{ isLoading ? '打卡中...' : '打卡' }}</van-button>
      </div>

      <!-- 提示信息 -->
      <div class="notice-section">
        <p class="notice-text">请以样板照片为准，进行整理和调整后，再进行拍照</p>
      </div>
    </div>

    <!-- 分类选择器弹窗 -->
    <van-popup v-model:show="showCategoryPicker" position="bottom" round>
      <div class="picker-title">
        <span>카테고리 선택</span>
        <van-icon name="cross" @click="showCategoryPicker = false" />
      </div>
      <div class="picker-content">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="picker-item"
          @click="selectCategory(category)"
        >
          {{ category }}
        </div>
      </div>
    </van-popup>

    <!-- 全局加载遮罩 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在打卡中，请稍后...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Button, Icon, Field, Popup } from 'vant';
import device from '@/utils/device.js';
import { checkIn } from '@/api/checkInApi';
import { uploadFile } from '@/api/uploadApi';

// 路由实例
const router = useRouter();
const route = useRoute();

// 返回上一页
const goBack = () => {
  router.back();
};

// 状态管理
const selectedCategory = ref('管理');
const templateImage = ref(''); // 样板图片
const currentImage = ref(''); // 现在的图片
const showCategoryPicker = ref(false);
const selectedItem = ref({
  id: '',
  name: '',
  image: ''
});

// 分数展示相关状态
const score = ref(0);
const showScore = ref(false);

// 重置分数显示
const resetScore = () => {
  score.value = 0;
  showScore.value = false;
};

// 获取路由参数
onMounted(() => {
  // 输出所有路由参数，方便调试
  console.log('路由参数:', route.query);

  const itemId = route.query.itemId || route.query.id || '';
  const itemName = route.query.itemName || route.query.name || '';
  const itemImage = route.query.itemImage || route.query.image || '';

  // 设置selectedItem，无论是否有参数都提供默认值
  selectedItem.value = {
    id: itemId,
    name: itemName || '未命名项目',
    image: itemImage
  };

  // 如果没有提供itemId，记录警告信息
  if (!itemId) {
    console.warn('未收到项目ID，请检查上一页是否正确传递了参数');
  }

  // 设置模板图片，提供默认值以防为空
  templateImage.value = itemImage || 'https://via.placeholder.com/300x200/CCCCCC/000000?text=模板图片';
});

// 分类数据
const categories = [
  '管理',
  '广东',
  '广西',
  '其他'
];

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category;
  showCategoryPicker.value = false;
};

// 拍照/选择图片
const takePhoto = (type) => {
  // 拍照前重置分数显示
  resetScore();

  // 实际项目中这里会调用摄像头或图片选择器
  // 这里使用占位图片模拟
  // if (type === 'template') {
  //   templateImage.value = 'https://via.placeholder.com/300x200/CCCCCC/000000?text=样板';
  // } else {
  //   currentImage.value = 'https://via.placeholder.com/300x200/CCCCCC/000000?text=现在';
  // }
  device.takePhoto('current', (result) => {
    console.log('拍照结果:', result);

    if (result.success && result.data && result.data.imageUrl) {
      // 确保设置currentImage值，这样模板中的v-if="currentImage"条件会被满足
      currentImage.value = result.data.imageUrl;
      console.log('图片URL已设置到currentImage:', currentImage.value);
    } else {
      // 拍照失败处理
      alert('拍照失败: ' + (result.message || '未知错误'));
    }
  });
};

// 加载状态
const isLoading = ref(false);

// 打卡
const checkInClick = () => {
  // 先检查是否有图片
  if (!currentImage.value) {
    // 添加更友好的提示，包括项目名称
    alert(`请先拍摄打卡照片\n项目ID: ${selectedItem.value.id || '未提供'}\n项目名称: ${selectedItem.value.name}`);
    return;
  }

  // 检查是否有项目ID
  if (!selectedItem.value.id) {
    alert('警告: 未获取到项目ID，请确认上一页是否正确传递参数');
  }

  // 开始加载
  isLoading.value = true;

  // 将base64图片转换为File对象以便上传
  const base64ToFile = (base64, filename) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  // 创建文件对象
  const timestamp = new Date().getTime();
  const file = base64ToFile(currentImage.value, `checkin_${timestamp}.jpg`);

  // 先上传文件
  uploadFile(file).then(uploadResponse => {
    // 检查上传是否成功并获取URL
    if (uploadResponse && uploadResponse.code === 1 && uploadResponse.data) {
      const imageUrl = uploadResponse.data.url || uploadResponse.data;

      // 使用上传后的URL调用打卡API
      return checkIn({
        items_id: selectedItem.value.id,
        file_name: imageUrl
      });
    } else {
      throw new Error('文件上传失败: ' + (uploadResponse?.message || '未知错误'));
    }
  }).then(checkInResponse => {
    if (checkInResponse && checkInResponse.code === 1) {
      // 打卡成功处理
      // 提取分数并显示
      if (checkInResponse.data && checkInResponse.data.score !== undefined) {
        score.value = checkInResponse.data.score;
        showScore.value = true;
        console.log('显示分数:', score.value);
        alert(`打卡成功! 分数: ${score.value}`);
      } else {
        alert('打卡成功!');
      }
    } else {
      // 打卡失败处理
      alert('打卡失败: ' + (checkInResponse?.message || '未知错误'));
    }
  }).catch(error => {
    // 错误处理
    alert('处理失败: ' + error.message);
  }).finally(() => {
    // 无论成功失败都结束加载
    isLoading.value = false;
  });
};
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

.checkin-container {
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

  // 标题和序号
  .title-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-base;

    .title-label {
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
    }

    .step-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: $primary-color;
      color: white;
      font-size: 14px;
      font-weight: 600;
      @include flex-center;
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

    .category-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: $primary-color;
      color: white;
      font-size: 14px;
      font-weight: 600;
      @include flex-center;
      margin-right: $spacing-base;
    }

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
          animation: scoreAppear 0.5s ease-out;
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

        @keyframes scoreAppear {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      }

    .action-section {
      margin-top: 16px;

      .image-actions {
        display: flex;
        gap: 12px;
        justify-content: center;

        .photo-btn {
          flex: 1;
          border-radius: $border-radius-small;
          background-color: $primary-color;
          border-color: $primary-color;
        }

        .comparison-btn {
          flex: 1;
          border-radius: $border-radius-small;
          // 保持默认样式
        }
      }
    }
  }

  // 打卡按钮
  .checkin-button-section {
  margin-bottom: $spacing-large;

  .checkin-btn {
    width: 100%;
    height: 56px;
    border-radius: 28px;
    font-size: 18px;
    font-weight: 600;
    background-color: $primary-color;
    border-color: $primary-color;
  }
}

  // 提示信息
  .notice-section {
    .notice-text {
      color: #ff6b6b;
      font-size: 14px;
      text-align: center;
      line-height: 1.5;
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

  // 分类选择器样式
  .picker-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-base;
    border-bottom: 1px solid #eeeeee;

    span {
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  .picker-content {
    padding: $spacing-base;

    .picker-item {
      padding: $spacing-base;
      text-align: center;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
