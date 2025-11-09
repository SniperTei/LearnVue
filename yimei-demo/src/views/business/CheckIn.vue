<template>
  <div class="checkin-container">
    <!-- 导航栏 -->
    <div class="navbar">
      <van-icon name="arrow-left" size="24" class="back-icon" @click="goBack" />
      <div class="navbar-title">업무</div>
      <div class="navbar-right"></div>
    </div>

    <!-- 打卡内容区域 -->
      <div class="checkin-content">
        <!-- 选中的物品信息 -->
        <div v-if="selectedItem.name" class="selected-item-info">
          <p class="item-name">선택된 항목: {{ selectedItem.name }}</p>
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
            placeholder="관련 택스트 상자"
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
          </div>
        </div>

        <!-- 拍照/选择图片按钮 -->
        <!-- <div class="action-section">
          <div class="image-actions">
            <van-button type="primary" size="large" @click="takePhoto('template')" class="photo-btn">样板</van-button>
            <van-button type="default" size="large" @click="takePhoto('current')" class="comparison-btn">现在</van-button>
          </div>
        </div> -->
      </div>

      <!-- 打卡按钮 -->
      <div class="checkin-button-section">
        <van-button type="primary" size="large" @click="checkIn" class="checkin-btn">촬영</van-button>
      </div>

      <!-- 提示信息 -->
      <div class="notice-section">
        <p class="notice-text">원본사진처럼 정리 밑 수정후 사진촬영</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Button, Icon, Field, Popup } from 'vant';
import device from '@/utils/device.js';

// 路由实例
const router = useRouter();
const route = useRoute();

// 返回上一页
const goBack = () => {
  router.back();
};

// 状态管理
const selectedCategory = ref('관리센터상자');
const templateImage = ref(''); // 样板图片
const currentImage = ref(''); // 现在的图片
const showCategoryPicker = ref(false);
const selectedItem = ref({
  id: '',
  name: ''
});

// 获取路由参数
onMounted(() => {
  const itemId = route.query.itemId;
  const itemName = route.query.itemName;

  if (itemId && itemName) {
    selectedItem.value = {
      id: itemId,
      name: itemName
    };
    // 可以根据需要在这里设置默认分类或加载相关数据
  }
});

// 分类数据
const categories = [
  '관리센터상자',
  '위치1',
  '위치2',
  '위치3'
];

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category;
  showCategoryPicker.value = false;
};

// 拍照/选择图片
const takePhoto = (type) => {
  // 实际项目中这里会调用摄像头或图片选择器
  // 这里使用占位图片模拟
  if (type === 'template') {
    templateImage.value = 'https://via.placeholder.com/300x200/CCCCCC/000000?text=样板';
  } else {
    currentImage.value = 'https://via.placeholder.com/300x200/CCCCCC/000000?text=现在';
  }
};

// 打卡
const checkIn = () => {
  // 实际项目中这里会调用打卡API
  device.takePhoto('current', (result) => {
    if (result.success && result.data && result.data.imageUrl) {
      // 确保设置currentImage值，这样模板中的v-if="currentImage"条件会被满足
      currentImage.value = result.data.imageUrl;
      console.log('图片已设置:', currentImage.value);
      
      // 调用打卡API
      checkInApi({
        category: selectedCategory.value,
        imageUrl: result.data.imageUrl
      }).then(response => {
        if (response.success) {
          // 打卡成功处理
          alert('출퇴근 성공!');
        } else {
          // 打卡失败处理
          alert('출퇴근 실패: ' + response.message);
        }
      }).catch(error => {
        // 网络错误处理
        alert('네트워크 오류: ' + error.message);
      });
    } else {
      // 拍照失败处理
      alert('촬영 실패: ' + (result.message || '未知错误'));
    }
  });

  // console.log('打卡操作', {
  //   category: selectedCategory.value,
  //   hasImage: !!currentImage.value
  // });

  // // 模拟打卡成功
  // alert('출퇴근 성공!');
};
</script>

<style lang="scss" scoped>
// 引入变量
@import '../../styles/variables.scss';

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
      background-color: #e6f7ff;
      border-radius: $border-radius-small;

      .item-name {
        margin: 0;
        color: #1890ff;
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
