<template>
  <div class="home-container">
    <!-- 顶部用户信息 -->
    <div class="header-section">
      <div class="user-info">
        <div class="user-name">{{ userInfo.nickname }}  ({{ userInfo.role_name }})</div>
        <!-- <div class="page-title">{{ userInfo.role_name }}</div> -->
      </div>
      <div class="header-right">
        <van-icon name="letter" size="24" class="header-icon" />
      </div>
    </div>

    <!-- 主要功能区 -->
    <div class="main-content">
      <!-- 功能卡片 -->
      <div class="feature-cards">
        <van-card
          class="feature-card item-card"
          :border="false"
          :shadow="false"
          @click="navigateToBusiness"
          style="cursor: pointer;"
        >
          <template #content>
            <div class="card-content">
              <span class="card-title">{{ BUSINESS_CATEGORY.business }}</span>
              <van-icon name="briefcase" size="28" />
            </div>
          </template>
        </van-card>

        <van-card
          class="feature-card meeting-card"
          :border="false"
          :shadow="false"
        >
          <template #content>
            <div class="card-content">
              <span class="card-title">{{ BUSINESS_CATEGORY.meeting }}</span>
              <van-icon name="todo-list" size="28" />
            </div>
          </template>
        </van-card>
      </div>

      <!-- 快捷操作按钮 -->
      <div class="quick-actions">
        <div class="action-btn" @click="handleQuickAction('add')">
          <van-icon name="plus" size="24" class="action-icon" />
          <span class="action-text">{{ QUICK_ACTIONS.education }}</span>
        </div>
        <div class="action-btn" @click="handleQuickAction('view')">
          <van-icon name="eye" size="24" class="action-icon" />
          <span class="action-text">{{ QUICK_ACTIONS.note }}</span>
        </div>
        <div class="action-btn" @click="handleQuickAction('memo')">
          <van-icon name="star-o" size="24" class="action-icon" />
          <span class="action-text">{{ QUICK_ACTIONS.my_level }}</span>
        </div>
      </div>

      <!-- 影像区域 -->
      <div class="video-section">
        <div class="section-header">
          <span class="section-title">교육 영상</span>
        </div>
        <div class="video-items">
          <div class="video-item completed">
            <div class="video-check">
              <van-icon name="success" size="24" class="check-icon" />
            </div>
            <div class="video-text">엽상 1</div>
          </div>
          <div class="video-item completed">
            <div class="video-check">
              <van-icon name="success" size="24" class="check-icon" />
            </div>
            <div class="video-text">엽상 1</div>
          </div>
        </div>
      </div>

      <!-- 通知区域 -->
      <div class="notice-section">
        <div class="section-header">
          <span class="section-title">공지사항</span>
          <span class="date-text">12.10.2024</span>
        </div>
        <van-card class="notice-card" :border="false" :shadow="false">
          <div class="notice-content">테스트 노트</div>
        </van-card>
      </div>

    </div>

    <!-- 底部导航栏 -->
    <van-tabbar route v-model="active" class="custom-tabbar">
      <van-tabbar-item icon="home-o" to="/" class="custom-tabbar-item">{{ TAB_ITEMS[0].text }}</van-tabbar-item>
      <van-tabbar-item icon="briefcase-o" class="custom-tabbar-item">{{ TAB_ITEMS[1].text }}</van-tabbar-item>
      <van-tabbar-item icon="calendar-o" class="custom-tabbar-item">{{ TAB_ITEMS[2].text }}</van-tabbar-item>
      <van-tabbar-item icon="user-o" class="custom-tabbar-item">{{ TAB_ITEMS[3].text }}</van-tabbar-item>
      <van-tabbar-item icon="setting-o" class="custom-tabbar-item">{{ TAB_ITEMS[4].text }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon, Card, Tabbar, TabbarItem } from 'vant';

const router = useRouter();
const active = ref(0);

// 定义名称常量
// 业务目录
const BUSINESS_CATEGORY = {
  'business': '업무',
  'meeting': '회의'
};
const QUICK_ACTIONS = {
  education: '교육',
  note: '노트',
  my_level: '나의둥급'
};
const TAB_ITEMS = [
  { icon: 'home-o', to: '/', text: '홈' },
  { icon: 'briefcase-o', to: '/tasks', text: '업무' },
  { icon: 'calendar-o', to: '/schedule', text: '고육' },
  { icon: 'user-o', to: '/profile', text: '재고' },
  { icon: 'setting-o', to: '/settings', text: '노트' }
];

const userInfo = {
  "id": 5,
  "username": "zhengnan",
  "nickname": "김연호",
  "mobile": "",
  "avatar": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgaGVpZ2h0PSIxMDAiIHdpZHRoPSIxMDAiPjxyZWN0IGZpbGw9InJnYigyMTQsMTYwLDIyOSkiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48L3JlY3Q+PHRleHQgeD0iNTAiIHk9IjUwIiBmb250LXNpemU9IjUwIiB0ZXh0LWNvcHk9ImZhc3QiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHRleHQtcmlnaHRzPSJhZG1pbiIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPlo8L3RleHQ+PC9zdmc+",
  "score": 0,
  "token": "xxx",
  "user_id": 5,
  "createtime": 1762653588,
  "expiretime": 1765245588,
  "expires_in": 2592000,
  // need to add
  "role_code": "team_leader",
  "role_name": "팀장"
};

// 处理快捷操作点击
const handleQuickAction = (type) => {
  console.log('快捷操作:', type);
  switch (type) {
    case 'add':
      // 添加功能
      break;
    case 'view':
      // 查看功能
      router.push('/check-in-records');
      break;
    case 'memo':
      // 备忘录功能
      break;
  }
};

// 跳转到业务页面
const navigateToBusiness = () => {
  router.push('/business');
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@mixin section-container {
  background-color: $bg-primary;
  padding: $spacing-base;
  border-radius: $border-radius;
}

.home-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  padding-bottom: 60px;

  // 顶部样式
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px $spacing-base 16px;
    background-color: $bg-primary;

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .user-name {
        font-size: 18px;
        font-weight: 600;
        color: $text-primary;
      }

      .page-title {
        font-size: 24px;
        font-weight: 700;
        color: $text-primary;
      }
    }

    .header-right {
      .header-icon {
        color: $text-primary;
      }
    }
  }

  // 主要内容区域
  .main-content {
    padding: $spacing-base;
    display: flex;
    flex-direction: column;
    gap: 20px;

    // 功能卡片
    .feature-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-small;

      .feature-card {
        border-radius: $border-radius;
        overflow: hidden;
        height: 100px;
        @include flex-center;

        &.item-card {
          background-color: $bg-success;
        }

        &.meeting-card {
          background-color: $bg-info;
        }

        .card-content {
          @include flex-col-center;
          height: 100%;
          color: $text-primary;

          .card-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: $spacing-tiny;
          }
        }
      }
    }

    // 快捷操作
    .quick-actions {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      background-color: $bg-primary;
      padding: 20px;
      border-radius: $border-radius;

      .action-btn {
        @include flex-col-center;
        gap: $spacing-tiny;
        cursor: pointer;

        .action-icon {
          width: 50px;
          height: 50px;
          @include flex-center;
          background-color: $bg-success;
          border-radius: 50%;
          color: $primary-color;
        }

        .action-text {
          font-size: 14px;
          color: $text-primary;
          font-weight: 500;
        }
      }
    }

    // 影像区域
    .video-section {
      @include section-container;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: $text-primary;
        }
      }

      .video-items {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: $spacing-small;

        .video-item {
          @include flex-col-center;
          padding: 16px;
          border-radius: $border-radius-small;
          background-color: $bg-secondary;

          &.completed {
            background-color: $bg-success;
          }

          .video-check {
            margin-bottom: $spacing-tiny;

            .check-icon {
              color: $primary-color;
            }
          }

          .video-text {
            font-size: 14px;
            color: $text-primary;
            font-weight: 500;
          }
        }
      }
    }

    // 通知区域
    .notice-section {
      @include section-container;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: $text-primary;
        }

        .date-text {
          font-size: 14px;
          color: $text-secondary;
        }
      }

      .notice-card {
        background-color: $bg-secondary;
        border-radius: $border-radius-small;
        padding: 12px;

        .notice-content {
          font-size: 14px;
          color: $text-primary;
        }
      }
    }
  }
}

// 底部导航栏自定义样式
.custom-tabbar {
  --tabbar-background-color: $bg-primary;
  --tabbar-height: 50px;

  .custom-tabbar-item {
    // 默认状态 - 绿色图标
    --tabbar-item-active-color: $text-secondary;
    color: $text-secondary;

    &:not(.van-tabbar-item--active) {
      .van-icon {
        color: $primary-color;
      }
    }

    // 选中状态 - 黑色文字，绿色背景
    &.van-tabbar-item--active {
      --tabbar-item-active-color: $text-primary;
      color: $text-primary;

      .van-tabbar-item__icon {
        background-color: $primary-color;
        border-radius: $border-radius-full;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 2px;

        .van-icon {
          color: white;
          font-size: 18px;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 375px) {
  .home-container {
    .main-content {
      padding: 12px;

      .feature-cards {
        gap: 10px;

        .feature-card {
          height: 90px;
        }
      }

      .quick-actions {
        padding: 16px;
        gap: 12px;

        .action-btn {
          .action-icon {
            width: 45px;
            height: 45px;
          }
        }
      }
    }
  }

  // 响应式调整底部导航栏
  .custom-tabbar {
    .custom-tabbar-item {
      &.van-tabbar-item--active {
        .van-tabbar-item__icon {
          width: 28px;
          height: 28px;

          .van-icon {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
