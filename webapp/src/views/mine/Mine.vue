<template>
  <div class="mine-container">
    <van-nav-bar title="我的" />

    <!-- 个人信息区域 -->
    <div class="user-info-section">
      <div class="avatar-wrapper">
        <van-image
          round
          :src="userInfo.avatar"
          fit="cover"
          class="user-avatar"
        />
      </div>
      <div class="user-details">
        <h2 class="user-name">{{ userInfo.name }}</h2>
        <p class="user-id">ID: {{ userInfo.id }}</p>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="function-section">
      <van-list>
        <van-cell
          title="设置"
          icon="setting-o"
          :right-icon="'arrow'"
          @click="goToSetting"
        />
        <van-cell
          title="关于"
          icon="info-o"
          :right-icon="'arrow'"
          @click="goToAbout"
        />
      </van-list>
    </div>

    <!-- 退出按钮 -->
    <div class="logout-section">
      <van-button
        type="default"
        class="logout-btn"
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Image, List, Cell, Button } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟用户信息
const userInfo = ref({
  name: '用户名',
  id: '123456',
  avatar: 'https://img.yzcdn.cn/vant/cat.jpeg'
})

// 跳转到设置页面
const goToSetting = () => {
  // 这里可以添加跳转到设置页面的逻辑
  console.log('跳转到设置页面')
}

// 跳转到关于页面
const goToAbout = () => {
  // 这里可以添加跳转到关于页面的逻辑
  console.log('跳转到关于页面')
}

// 处理退出登录
const handleLogout = () => {
  // 这里可以添加退出登录的逻辑
  console.log('退出登录')
}
</script>

<style lang="scss" scoped>
.mine-container {
  min-height: 100vh;
  background-color: $bg-secondary;
  display: flex;
  flex-direction: column;

  // 个人信息区域样式
  .user-info-section {
    display: flex;
    align-items: center;
    padding: $spacing-xl;
    background-color: $primary-color;
    color: white;

    .avatar-wrapper {
      margin-right: $spacing-lg;

      .user-avatar {
        width: 80px;
        height: 80px;
      }
    }

    .user-details {
      .user-name {
        font-size: $font-size-xl;
        margin-bottom: $spacing-small;
        font-weight: bold;
      }

      .user-id {
        font-size: $font-size-sm;
        opacity: 0.8;
      }
    }
  }

  // 功能列表区域样式
  .function-section {
    margin: $spacing-lg 0;
    background-color: $bg-primary;

    :deep(.van-cell) {
      &::after {
        left: 48px;
      }
    }
  }

  // 退出按钮区域样式
  .logout-section {
    padding: $spacing-lg;
    margin-top: auto;
    padding-bottom: calc(#{$spacing-lg} + 50px); // 为底部导航栏留出空间

    .logout-btn {
      background-color: $text-danger;
      color: white;
      border-radius: $border-radius;
    }
  }
}
</style>
