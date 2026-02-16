<template>
  <div class="mine-container">
    <!-- 顶部装饰背景 -->
    <div class="hero-bg">
      <div class="gradient-layer"></div>
      <div class="pattern-layer"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- 用户信息卡片 -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-container">
            <img
              :src="userInfo.avatar"
              :alt="userInfo.name"
              class="avatar-image"
            />
            <div class="avatar-ring"></div>
            <div class="avatar-badge">
              <i class="van-icon van-icon-star-o"></i>
            </div>
          </div>
        </div>

        <div class="user-info">
          <div class="user-greeting">
            <span class="greeting-emoji">👋</span>
            <span class="greeting-text">{{ greetingText }}</span>
          </div>
          <h1 class="user-name">{{ userInfo.name }}</h1>
          <p class="user-id">ID: {{ userInfo.id }}</p>

          <!-- 用户标签 -->
          <div class="user-tags">
            <span class="tag vip">VIP会员</span>
            <span class="tag level">Lv.8</span>
          </div>
        </div>

        <button class="edit-profile-btn">
          <i class="van-icon van-icon-edit-o"></i>
        </button>
      </div>

      <!-- 统计数据 -->
      <div class="stats-grid">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- 会员卡片 -->
    <div class="vip-card">
      <div class="vip-bg"></div>
      <div class="vip-content">
        <div class="vip-info">
          <div class="vip-icon">👑</div>
          <div class="vip-details">
            <h3 class="vip-title">VIP会员中心</h3>
            <p class="vip-desc">开通享受更多特权</p>
          </div>
        </div>
        <button class="vip-btn">立即开通</button>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-card">
        <div class="menu-item" v-for="item in menuItems" :key="item.id" @click="handleMenuClick(item)">
          <div class="menu-icon" :class="item.colorClass">
            <i :class="item.icon"></i>
          </div>
          <div class="menu-content">
            <span class="menu-title">{{ item.title }}</span>
            <span class="menu-badge" v-if="item.badge">{{ item.badge }}</span>
          </div>
          <i class="van-icon van-icon-arrow menu-arrow"></i>
        </div>
      </div>
    </div>

    <!-- 设置选项 -->
    <div class="settings-section">
      <div class="settings-card">
        <div class="setting-item" v-for="item in settingItems" :key="item.id" @click="handleSettingClick(item)">
          <div class="setting-icon">
            <i :class="item.icon"></i>
          </div>
          <span class="setting-title">{{ item.title }}</span>
          <i class="van-icon van-icon-arrow setting-arrow"></i>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <!-- 开发环境测试登录按钮 -->
      <button v-if="isDev" class="test-login-btn" @click="handleTestLogin">
        <i class="van-icon van-icon-lock"></i>
        <span>测试登录</span>
      </button>
      <button class="logout-btn" @click="handleLogout">
        <i class="van-icon van-icon-sign-out"></i>
        <span>退出登录</span>
      </button>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-decoration">
      <div class="decoration-line"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import deviceBridge from '@/utils/device.js'

const router = useRouter()
const userStore = useUserStore()

const greetingText = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const userInfo = ref({
  name: userStore.displayName || '探索者',
  id: userStore.userInfo?.id?.toString() || '10086',
  avatar: 'https://via.placeholder.com/120'
})

const stats = ref([
  { label: '收藏', value: 128 },
  { label: '关注', value: 56 },
  { label: '足迹', value: 342 },
  { label: '积分', value: 8960 }
])

const menuItems = ref([
  {
    id: 1,
    title: '我的订单',
    icon: 'van-icon van-icon-cart-o',
    colorClass: 'order',
    badge: '3'
  },
  {
    id: 2,
    title: '我的优惠券',
    icon: 'van-icon van-icon-coupon-o',
    colorClass: 'coupon',
    badge: '5'
  },
  {
    id: 3,
    title: '我的评价',
    icon: 'van-icon van-icon-comment-o',
    colorClass: 'comment'
  },
  {
    id: 4,
    title: '我的收藏',
    icon: 'van-icon van-icon-star-o',
    colorClass: 'favorite'
  }
])

const settingItems = ref([
  {
    id: 1,
    title: '账号设置',
    icon: 'van-icon van-icon-user-o'
  },
  {
    id: 2,
    title: '隐私设置',
    icon: 'van-icon van-icon-lock'
  },
  {
    id: 3,
    title: '消息通知',
    icon: 'van-icon van-icon-bell-o'
  },
  {
    id: 4,
    title: '帮助与反馈',
    icon: 'van-icon van-icon-question-o'
  },
  {
    id: 5,
    title: '关于我们',
    icon: 'van-icon van-icon-info-o'
  }
])

const handleMenuClick = (item) => {
  console.log('点击菜单:', item.title)
}

const handleSettingClick = (item) => {
  console.log('点击设置:', item.title)
  if (item.title === '关于我们') {
    // 可以跳转到关于页面
  }
}

const handleLogout = async () => {
  console.log('退出登录')

  try {
    // 清除本地用户信息
    userStore.logout()

    // 调用原生app的退出登录方法
    // 注意：原生端的logout方法会处理跳转到登录页和关闭当前Activity
    const result = await deviceBridge.logout()
    console.log('退出登录结果:', result)
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 检测是否是开发环境
const isDev = import.meta.env.DEV

// 测试登录 - 调用后端API获取token
const handleTestLogin = async () => {
  console.log('开始测试登录...')

  try {
    // 调用后端测试登录接口
    // const response = await fetch('http://localhost:8000/api/v1/users/test-login', {
    const response = await fetch('http://api-test.sniper14.online/api/v1/users/test-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()

    if (result.code === '000000') {
      console.log('测试登录成功:', result.data)

      // 保存用户数据到 userStore
      userStore.setUserData({
        token: result.data.access_token,
        tokenType: result.data.token_type,
        userInfo: {
          id: '2',
          username: 'test',
          email: 'test@example.com',
          mobile: null
        }
      })

      // 显示提示
      alert('测试登录成功！')
    } else {
      console.error('测试登录失败:', result.msg)
      alert(`测试登录失败: ${result.msg}`)
    }
  } catch (error) {
    console.error('测试登录异常:', error)
    alert(`测试登录异常: ${error.message}`)
  }
}

// 从原生app获取用户信息
const fetchUserInfoFromApp = async () => {
  try {
    console.log('Mine: 尝试从原生app获取用户信息...')

    const result = await deviceBridge.getUserInfoFromApp((response) => {
      console.log('Mine: getUserInfoFromApp 回调:', response)
    })

    console.log('Mine: getUserInfoFromApp 结果:', result)

    // 检查返回结果
    if (result && result.code === '000000') {
      // 成功获取用户信息
      const userData = result.data
      console.log('Mine: 成功获取用户信息:', userData)

      // 构建用户数据对象
      const userInfo = {
        token: userData.token || '',
        tokenType: userData.tokenType || 'Bearer',
        userInfo: {
          id: userData.userInfo?.id,
          username: userData.userInfo?.username,
          email: userData.userInfo?.email,
          mobile: userData.userInfo?.mobile
        }
      }

      // 保存到userStore
      userStore.setUserData(userInfo)

      // 更新本地显示的用户信息
      if (userData.userInfo) {
        userInfo.value = {
          name: userData.userInfo.username || userData.userInfo.email || '探索者',
          id: userData.userInfo.id?.toString() || '10086',
          avatar: 'https://via.placeholder.com/120'
        }
      }

      console.log('Mine: 用户信息已保存到store')
    } else {
      // 获取失败或用户未登录
      console.log('Mine: 未获取到用户信息或用户未登录:', result?.msg || '未知错误')
    }
  } catch (error) {
    console.error('Mine: 从原生app获取用户信息失败:', error)
  }
}

// 组件挂载时
onMounted(() => {
  console.log('Mine.vue mounted')

  // 注意：App 登录数据的获取已在 main.js 中统一处理
  // 这里不再重复获取，避免多次调用
  // 如果需要手动刷新登录状态，可以调用 fetchUserInfoFromApp()
})
</script>

<style lang="scss" scoped>
/* ========== 设计系统 ========== */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --vip-gradient: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
}

/* ========== 主容器 ========== */
.mine-container {
  min-height: 100vh;
  background: #f8f9fe;
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
}

/* ========== 顶部装饰背景 ========== */
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 320px;
  overflow: hidden;
}

.gradient-layer {
  position: absolute;
  inset: 0;
  background: var(--primary-gradient);
  border-radius: 0 0 50% 50% / 0 0 60px 60px;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: bg-scroll 20s linear infinite;
  }
}

@keyframes bg-scroll {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.pattern-layer {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.6;
}

.floating-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float-shape 15s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 50%;
  left: 5%;
  animation-delay: -5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 20%;
  animation-delay: -10s;
}

@keyframes float-shape {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -20px) rotate(90deg); }
  50% { transform: translate(-10px, 10px) rotate(180deg); }
  75% { transform: translate(15px, 15px) rotate(270deg); }
}

/* ========== 用户信息卡片 ========== */
.profile-card {
  position: relative;
  z-index: 2;
  margin: 20px 16px;
  padding: 24px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.avatar-section {
  margin-right: 16px;
}

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 22px;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  object-fit: cover;
}

.avatar-ring {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 26px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  animation: pulse-ring-2 2s ease-out infinite;
}

@keyframes pulse-ring-2 {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.avatar-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(245, 175, 25, 0.4);

  .van-icon {
    font-size: 14px;
    color: white;
  }
}

.user-info {
  flex: 1;
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.greeting-emoji {
  font-size: 18px;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(14deg); }
  20%, 40% { transform: rotate(-8deg); }
  50% { transform: rotate(0deg); }
}

.greeting-text {
  font-size: 13px;
  color: #718096;
  font-weight: 500;
}

.user-name {
  font-size: 24px;
  font-weight: 800;
  color: #2d3748;
  margin: 0 0 4px;
}

.user-id {
  font-size: 13px;
  color: #a0aec0;
  margin: 0 0 12px;
}

.user-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;

  &.vip {
    background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
    color: white;
  }

  &.level {
    background: #eef2ff;
    color: #667eea;
  }
}

.edit-profile-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: #f7fafc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:active {
    background: #edf2f7;
    transform: scale(0.95);
  }

  .van-icon {
    font-size: 18px;
    color: #718096;
  }
}

/* ========== 统计数据 ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #edf2f7;
}

.stat-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
}

/* ========== VIP卡片 ========== */
.vip-card {
  position: relative;
  margin: 0 16px 20px;
  padding: 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.vip-bg {
  position: absolute;
  inset: 0;
  background: var(--vip-gradient);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
  }
}

.vip-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vip-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vip-icon {
  font-size: 32px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

.vip-details {
  .vip-title {
    font-size: 18px;
    font-weight: 800;
    color: white;
    margin: 0 0 4px;
  }

  .vip-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
}

.vip-btn {
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #f12711;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
}

/* ========== 功能菜单 ========== */
.menu-section {
  padding: 0 16px 20px;
}

.menu-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 68px;
    right: 20px;
    height: 1px;
    background: #edf2f7;
  }

  &:active {
    background: #f7fafc;
  }
}

.menu-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 22px;

  &.order {
    background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
    color: #ff6b6b;
  }

  &.coupon {
    background: linear-gradient(135deg, #fff8f0 0%, #ffe8d6 100%);
    color: #ffa500;
  }

  &.comment {
    background: linear-gradient(135deg, #f0fff4 0%, #d4edda 100%);
    color: #4ecdc4;
  }

  &.favorite {
    background: linear-gradient(135deg, #fff0f5 0%, #ffd6e7 100%);
    color: #ff9ff3;
  }
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.menu-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background: #ff6b6b;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
}

.menu-arrow {
  font-size: 16px;
  color: #cbd5e0;
}

/* ========== 设置选项 ========== */
.settings-section {
  padding: 0 16px 20px;
}

.settings-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 52px;
    right: 20px;
    height: 1px;
    background: #edf2f7;
  }

  &:active {
    background: #f7fafc;
  }
}

.setting-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  .van-icon {
    font-size: 18px;
    color: #718096;
  }
}

.setting-title {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #4a5568;
}

.setting-arrow {
  font-size: 16px;
  color: #cbd5e0;
}

/* ========== 退出登录 ========== */
.logout-section {
  padding: 0 16px;
}

.test-login-btn {
  width: 100%;
  padding: 16px;
  background: #4caf50;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;

  &:active {
    background: #45a049;
    transform: scale(0.98);
  }

  .van-icon {
    font-size: 18px;
  }
}

.logout-btn {
  width: 100%;
  padding: 16px;
  background: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #ff6b6b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:active {
    background: #fff5f5;
    transform: scale(0.98);
  }

  .van-icon {
    font-size: 18px;
  }
}

/* ========== 底部装饰 ========== */
.bottom-decoration {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  z-index: 100;
}

.decoration-line {
  width: 100%;
  height: 100%;
  background: inherit;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
