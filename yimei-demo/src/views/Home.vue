<template>
  <div class="home-container">
    <!-- 顶部用户信息 -->
    <div class="header-section">
      <div class="user-info">
        <div class="user-name">김연호</div>
        <div class="page-title">업무</div>
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
        >
          <template #content>
            <div class="card-content">
              <span class="card-title">업무</span>
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
              <span class="card-title">회의</span>
              <van-icon name="todo-list" size="28" />
            </div>
          </template>
        </van-card>
      </div>

      <!-- 快捷操作按钮 -->
      <div class="quick-actions">
        <div class="action-btn" @click="handleQuickAction('add')">
          <van-icon name="plus" size="24" class="action-icon" />
          <span class="action-text">담기</span>
        </div>
        <div class="action-btn" @click="handleQuickAction('view')">
          <van-icon name="eye" size="24" class="action-icon" />
          <span class="action-text">보기</span>
        </div>
        <div class="action-btn" @click="handleQuickAction('memo')">
          <van-icon name="star-o" size="24" class="action-icon" />
          <span class="action-text">메모</span>
        </div>
      </div>

      <!-- 日程区域 -->
      <div class="schedule-section">
        <div class="section-header">
          <span class="section-title">공지사항</span>
          <span class="date-text">12.10.2024</span>
        </div>
        <van-card class="notice-card" :border="false" :shadow="false">
          <div class="notice-content">테스트 노트</div>
        </van-card>
      </div>

      <!-- 待办事项区域 -->
      <div class="todo-section">
        <div class="section-header">
          <span class="section-title">교육 뱃지</span>
        </div>
        <div class="todo-items">
          <div class="todo-item completed">
            <div class="todo-check">
              <van-icon name="success" size="24" class="check-icon" />
            </div>
            <div class="todo-text">엽상 1</div>
          </div>
          <div class="todo-item completed">
            <div class="todo-check">
              <van-icon name="success" size="24" class="check-icon" />
            </div>
            <div class="todo-text">엽상 1</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar route v-model="active">
      <van-tabbar-item icon="home-o" to="/">홈</van-tabbar-item>
      <van-tabbar-item icon="briefcase-o">업무</van-tabbar-item>
      <van-tabbar-item icon="calendar-o">스케줄</van-tabbar-item>
      <van-tabbar-item icon="user-o">내정보</van-tabbar-item>
      <van-tabbar-item icon="setting-o">설정</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon, Card, Tabbar, TabbarItem } from 'vant';

const router = useRouter();
const active = ref(0);

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
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
}

/* 顶部样式 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px;
  background-color: #ffffff;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #323233;
}

.header-icon {
  color: #323233;
}

/* 主要内容区域 */
.main-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 功能卡片 */
.feature-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.feature-card {
  border-radius: 12px;
  overflow: hidden;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-card {
  background-color: #e8f5e9;
}

.meeting-card {
  background-color: #e0f2f1;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #323233;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.action-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e8f5e9;
  border-radius: 50%;
  color: #07c160;
}

.action-text {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
}

/* 日程区域 */
.schedule-section {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.date-text {
  font-size: 14px;
  color: #969799;
}

.notice-card {
  background-color: #f7f8fa;
  border-radius: 8px;
  padding: 12px;
}

.notice-content {
  font-size: 14px;
  color: #323233;
}

/* 待办区域 */
.todo-section {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
}

.todo-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.todo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #f7f8fa;
}

.todo-item.completed {
  background-color: #e8f5e9;
}

.todo-check {
  margin-bottom: 8px;
}

.check-icon {
  color: #07c160;
}

.todo-text {
  font-size: 14px;
  color: #323233;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .main-content {
    padding: 12px;
  }
  
  .feature-cards {
    gap: 10px;
  }
  
  .feature-card {
    height: 90px;
  }
  
  .quick-actions {
    padding: 16px;
    gap: 12px;
  }
  
  .action-icon {
    width: 45px;
    height: 45px;
  }
}
</style>