<template>
  <div class="home-container">
    <!-- 顶部用户信息栏 -->
    <div class="header-section">
      <div class="user-info">
        <img src="https://via.placeholder.com/40" alt="用户头像" class="avatar" />
        <div class="user-details">
          <div class="greeting">早上好</div>
          <div class="username">小冀</div>
        </div>
      </div>
      <div class="header-actions">
        <i class="icon-bell van-icon van-icon-bell-o"></i>
        <i class="icon-search van-icon van-icon-search"></i>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-bar">
        <i class="van-icon van-icon-search"></i>
        <span class="search-placeholder">今天想要什么体验？</span>
      </div>
    </div>

    <!-- 体验推荐语 -->
    <div class="experience-tip">
      发现身边的美好生活
    </div>

    <!-- 分类导航 -->
    <div class="category-section">
      <div class="category-grid">
        <div class="category-item" v-for="category in categories" :key="category.id">
          <div :class="['category-icon', category.color]">
            <i :class="category.iconClass"></i>
            <i :class="category.iconClass"></i>
          </div>
          <div class="category-name">{{ category.name }}</div>
          <div class="category-count">{{ category.count }}</div>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="quick-entry-section">
      <div class="section-title">快速入口</div>
      <div class="quick-entry-grid">
        <div class="quick-entry-item" v-for="entry in quickEntries" :key="entry.id">
          <div :class="['entry-icon', entry.color]">
            <i :class="entry.iconClass"></i>
          </div>
          <div class="entry-name">{{ entry.name }}</div>
        </div>
      </div>
    </div>

    <!-- 今日推荐 -->
    <div class="recommendation-section">
      <div class="section-header">
        <div class="section-title">今日推荐</div>
        <div class="section-more">查看更多</div>
      </div>
      <div class="recommendation-list">
        <div class="recommendation-item" v-for="item in recommendations" :key="item.id">
          <img :src="item.image" :alt="item.name" class="item-image" />
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-desc">{{ item.description }}</div>
            <div class="item-bottom">
              <div class="item-price">{{ item.price }}</div>
              <div class="item-tag">{{ item.tag }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门活动 -->
    <div class="activities-section">
      <div class="section-header">
        <div class="section-title">热门活动</div>
        <div class="section-more">全部活动</div>
      </div>
      <div class="activities-list">
        <div class="activity-item">
          <img src="https://via.placeholder.com/150x80" alt="热门活动" class="activity-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NavBar, Icon } from 'vant'

// 分类数据
const categories = ref([
  { id: 1, name: '吃', count: '12家餐厅', iconClass: 'van-icon van-icon-coupon-o', color: 'food' },
  { id: 2, name: '喝', count: '8家饮品', iconClass: 'van-icon van-icon-goblet', color: 'drink' },
  { id: 3, name: '玩', count: '45个场所', iconClass: 'van-icon van-icon-game', color: 'play' },
  { id: 4, name: '乐', count: '2场活动', iconClass: 'van-icon van-icon-music', color: 'entertainment' }
])

// 快速入口数据
const quickEntries = ref([
  { id: 1, name: '优惠券', iconClass: 'van-icon van-icon-ticket-o', color: 'ticket' },
  { id: 2, name: '活动', iconClass: 'van-icon van-icon-gift-o', color: 'activity' },
  { id: 3, name: '附近', iconClass: 'van-icon van-icon-location-o', color: 'nearby' },
  { id: 4, name: '收藏', iconClass: 'van-icon van-icon-heart-o', color: 'favorite' }
])

// 推荐数据
const recommendations = ref([
  {
    id: 1,
    name: '星空餐厅',
    description: '精致日式料理 · 500m',
    price: '¥168/人',
    tag: '8折优惠',
    image: 'https://via.placeholder.com/400x200?text=星空餐厅'
  },
  {
    id: 2,
    name: '云端咖啡',
    description: '手冲精品咖啡 · 300m',
    price: '¥35/杯',
    tag: '新店开业',
    image: 'https://via.placeholder.com/400x200?text=云端咖啡'
  }
])
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: calc(#{$spacing-lg} + 50px); // 为底部导航栏留出空间
  overflow-x: hidden;

  // 顶部用户信息栏
  .header-section {
    background: linear-gradient(135deg, $primary-color, #39b5ff);
    padding: 16px 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.8);
      }

      .user-details {
        .greeting {
          font-size: 12px;
          opacity: 0.9;
        }
        .username {
          font-size: 16px;
          font-weight: 500;
          margin-top: 2px;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 20px;
      font-size: 20px;
    }
  }

  // 搜索框
  .search-section {
    padding: 0 16px;
    margin-top: -12px;
    margin-bottom: 12px;

    .search-bar {
      background: white;
      border-radius: 20px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .van-icon {
        color: #999;
      }

      .search-placeholder {
        color: #999;
        font-size: 14px;
      }
    }
  }

  // 体验推荐语
  .experience-tip {
    padding: 0 16px 12px;
    color: #666;
    font-size: 14px;
  }

  // 分类导航
  .category-section {
    background: white;
    padding: 16px;
    margin-bottom: 12px;

    .category-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;

      .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .category-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 8px;
          font-size: 16px;
          color: white;
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transform: rotate(45deg);
            animation: shimmer 2s infinite;
          }

          .van-icon {
            position: relative;
            z-index: 1;
          }

          &:nth-child(1) {
            margin-right: 4px;
          }

          &:nth-child(2) {
            margin-left: -20px;
          }
        }

        .category-name {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .category-count {
          font-size: 11px;
          color: #999;
        }

        // 分类颜色
        .food {
          background: linear-gradient(135deg, #ff6b6b, #ffa500);
        }

        .drink {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
        }

        .play {
          background: linear-gradient(135deg, #48dbfb, #1dd1a1);
        }

        .entertainment {
          background: linear-gradient(135deg, #ff9ff3, #5f27cd);
        }
      }
    }
  }

  // 快速入口
  .quick-entry-section {
    background: white;
    padding: 16px;
    margin-bottom: 12px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .quick-entry-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;

      .quick-entry-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .entry-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 8px;
          font-size: 22px;

          // 快速入口颜色
          &.ticket {
            background: #f0f9ff;
            color: #009688;
          }

          &.activity {
            background: #fff3e0;
            color: #ff9800;
          }

          &.nearby {
            background: #e8f5e9;
            color: #4caf50;
          }

          &.favorite {
            background: #ffebee;
            color: #f44336;
          }
        }

        .entry-name {
          font-size: 13px;
          color: #666;
        }
      }
    }
  }

  // 今日推荐
  .recommendation-section {
    background: white;
    padding: 16px;
    margin-bottom: 12px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .section-title {
        font-size: 16px;
        font-weight: 500;
      }

      .section-more {
        font-size: 14px;
        color: #999;
      }
    }

    .recommendation-list {
      .recommendation-item {
        margin-bottom: 16px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        &:last-child {
          margin-bottom: 0;
        }

        .item-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .item-info {
          padding: 12px;

          .item-name {
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 4px;
          }

          .item-desc {
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;
          }

          .item-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .item-price {
              font-size: 15px;
              font-weight: 500;
              color: #ff6b6b;
            }

            .item-tag {
              font-size: 11px;
              background: #fff5f5;
              color: #ff6b6b;
              padding: 2px 8px;
              border-radius: 10px;
            }
          }
        }
      }
    }
  }

  // 热门活动
  .activities-section {
    background: white;
    padding: 16px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .section-title {
        font-size: 16px;
        font-weight: 500;
      }

      .section-more {
        font-size: 14px;
        color: #999;
      }
    }

    .activities-list {
      .activity-item {
        .activity-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
        }
      }
    }
  }

  // 闪光动画
  @keyframes shimmer {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }
}
</style>
