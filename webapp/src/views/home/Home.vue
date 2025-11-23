<template>
  <div class="home-container">
    <van-nav-bar title="首页" />
    <div class="content-wrapper">
      <h1 class="page-title">欢迎使用移动端H5应用</h1>
      <div class="feature-cards">
        <div class="feature-card" v-for="feature in features" :key="feature.id">
          <h3 class="card-title">{{ feature.title }}</h3>
          <p class="card-desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>
    <van-tabbar v-model="active" route>
      <van-tabbar-item name="home" icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item name="learn" icon="medal-o" to="/learn">学习</van-tabbar-item>
      <van-tabbar-item name="pending" icon="ellipsis" to="/pending">待定</van-tabbar-item>
      <van-tabbar-item name="mine" icon="user-o" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Tabbar, TabbarItem } from 'vant'

const features = ref([
  { id: 1, title: '功能一', description: '这是功能一的详细描述' },
  { id: 2, title: '功能二', description: '这是功能二的详细描述' },
  { id: 3, title: '功能三', description: '这是功能三的详细描述' }
])

const active = ref('home')
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  display: flex;
  flex-direction: column;

  .content-wrapper {
    flex: 1;
    padding: $spacing-lg;
    padding-bottom: calc(#{$spacing-lg} + 50px); // 为底部导航栏留出空间

    .page-title {
      font-size: $font-size-xl;
      color: $text-primary;
      text-align: center;
      margin-bottom: $spacing-xl;
    }

    .feature-cards {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;

      .feature-card {
        background-color: $bg-primary;
        border-radius: $border-radius;
        padding: $spacing-md;
        box-shadow: $shadow-sm;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: $shadow-md;
        }

        .card-title {
          font-size: $font-size-lg;
          color: $primary-color;
          margin-bottom: $spacing-small;
        }

        .card-desc {
          font-size: $font-size-md;
          color: $text-secondary;
          line-height: 1.6;
        }
      }
    }
  }

  :deep(.van-tabbar) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }

  :deep(.van-tabbar-item--active .van-tabbar-item__text) {
    color: $primary-color;
  }
}
</style>
