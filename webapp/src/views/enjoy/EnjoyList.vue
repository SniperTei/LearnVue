<template>
  <div class="enjoy-list-container">
    <!-- 使用Vant的NavBar组件 -->
    <NavBar
      title="饭店列表"
      left-text=""
      left-arrow
      @click-left="goBack"
      fixed
      placeholder
    />

    <!-- 搜索筛选栏 -->
    <div class="filter-bar">
      <div class="search-section">
        <div class="search-box">
          <div class="search-icon">🔍</div>
          <input
            v-model="searchParams.title"
            type="text"
            placeholder="搜索饭店名称"
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <button @click="handleSearch" class="search-btn">
          搜索
        </button>
      </div>

      <!-- 菜系筛选 -->
      <div class="cuisine-filter">
        <span class="filter-label">菜系:</span>
        <div class="cuisine-options">
          <span
            v-for="option in cuisineOptions"
            :key="option.value"
            class="cuisine-option"
            :class="{ active: searchParams.cuisine === option.value }"
            @click="selectCuisine(option.value)"
          >
            {{ option.text }}
          </span>
        </div>
      </div>

      <!-- 评分筛选 -->
      <div class="rating-filter">
        <span class="filter-label">最低评分:</span>
        <div class="rating-options">
          <span
            v-for="score in ratingOptions"
            :key="score"
            class="rating-option"
            :class="{ active: searchParams.min_star === score }"
            @click="selectMinRating(score)"
          >
            {{ score }}星及以上
          </span>
        </div>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="enjoy-list">
      <!-- 直接显示数据 -->
      <div v-if="enjoyList.length > 0">
        <div class="list-header">
          <span class="result-count">找到 {{ totalCount }} 家饭店</span>
          <span v-if="searchParams.cuisine" class="active-filter">
            当前筛选: {{ getCuisineText(searchParams.cuisine) }}
          </span>
        </div>

        <div
          v-for="item in enjoyList"
          :key="item.id"
          class="enjoy-item"
          @click="navigateToDetail(item.id)"
        >
          <!-- 封面图 -->
          <div class="item-cover">
            <img
              :src="item.cover"
              alt="{{ item.title }}"
              @error="handleImageError"
              class="cover-image"
            />
            <div class="rating-tag">
              <span class="rating-star">★</span>
              <span class="rating-score">{{ item.star }}</span>
            </div>
          </div>

          <!-- 内容信息 -->
          <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>

            <!-- 标签 -->
            <div class="enjoy-tags">
              <span v-if="item.cuisine" class="cuisine-badge">{{ item.cuisine }}</span>
              <span v-for="(tag, index) in item.tags" :key="index" class="enjoy-tag">{{ tag }}</span>
            </div>

            <!-- 简介 -->
            <p class="item-description">{{ item.content }}</p>

            <!-- 相关信息 -->
            <div class="enjoy-info">
              <span class="location">📍 {{ item.location }}</span>
              <span class="create-time">{{ formatTime(item.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载饭店信息...</p>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🏨</div>
        <p class="empty-text">暂无饭店记录</p>
        <p class="empty-hint">去发现更多美食饭店吧</p>
      </div>

      <!-- 新增按钮 -->
      <Button
        type="primary"
        class="create-btn"
        @click="navigateToCreate"
        round
      >
        新增饭店
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import placeholderImage from '@/assets/images/placeholder.png'
import { getEnjoyList } from '@/api/enjoyApi.js'
import { NavBar, Button } from 'vant';

// 路由
const route = useRoute()
const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// 搜索参数 - 适配API文档中的参数
const searchParams = ref({
  page: 1, // 页码，默认1
  count: 10, // 每页数量，默认10
  title: '', // 标题模糊查询
  content: '', // 内容模糊查询
  location: '', // 位置查询
  min_star: '', // 最低评分
  max_star: '', // 最高评分
  cuisine: '', // 菜系精确查询
  tag: '' // 标签包含查询
})

// 列表数据
const enjoyList = ref([])
const loading = ref(false)
const finished = ref(false)
const totalCount = ref(0)

// 菜系筛选选项
const cuisineOptions = [
  { text: '全部', value: '' },
  { text: '川菜', value: '川菜' },
  { text: '粤菜', value: '粤菜' },
  { text: '湘菜', value: '湘菜' },
  { text: '江浙菜', value: '江浙菜' },
  { text: '西餐', value: '西餐' },
  { text: '日料', value: '日料' },
  { text: '韩料', value: '韩料' }
]

// 评分筛选选项
const ratingOptions = [0, 3, 4, 4.5]

// 模拟数据 - 调整为API响应格式
const mockData = {
  "code": "000000",
  "statusCode": 200,
  "msg": "获取饭店列表成功",
  "data": {
    "enjoys": [
      {
        "id": 1,
        "title": "老川菜馆",
        "content": "正宗川菜，麻辣鲜香，环境优雅，服务周到。",
        "cover": "https://via.placeholder.com/400x300?text=老川菜馆",
        "images": ["https://via.placeholder.com/400x300?text=老川菜馆-1.jpg"],
        "tags": ["川菜", "正宗", "环境优雅", "服务周到"],
        "star": 4.8,
        "location": "北京市朝阳区建国路88号",
        "cuisine": "川菜",
        "created_by": 1,
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
      },
      {
        "id": 2,
        "title": "粤式茶餐厅",
        "content": "正宗粤菜，点心精致，价格实惠。",
        "cover": "https://via.placeholder.com/400x300?text=粤式茶餐厅",
        "images": [],
        "tags": ["粤菜", "点心", "实惠", "人气旺"],
        "star": 4.7,
        "location": "上海市浦东新区陆家嘴环路168号",
        "cuisine": "粤菜",
        "created_by": 1,
        "created_at": "2024-01-01T12:00:00",
        "updated_at": "2024-01-01T12:00:00"
      },
      {
        "id": 3,
        "title": "日式料理店",
        "content": "新鲜食材，传统做法，环境清幽。",
        "cover": "https://via.placeholder.com/400x300?text=日式料理店",
        "images": [],
        "tags": ["日料", "新鲜", "传统", "清幽"],
        "star": 4.9,
        "location": "广州市天河区天河路385号",
        "cuisine": "日料",
        "created_by": 1,
        "created_at": "2024-01-02T18:00:00",
        "updated_at": "2024-01-02T18:00:00"
      }
    ],
    "total": 25,
    "page": 1,
    "count": 10
  },
  "timestamp": "2025-11-27 13:44:02"
}

// 获取菜系文本
const getCuisineText = (cuisine) => {
  const option = cuisineOptions.find(opt => opt.value === cuisine)
  return option ? option.text : cuisine
}

// 处理图片加载失败
const handleImageError = (event) => {
  event.target.src = placeholderImage
}

// 选择菜系
const selectCuisine = (cuisine) => {
  searchParams.value.cuisine = cuisine
  searchParams.value.page = 1
  finished.value = false
  loadData()
}

// 选择最低评分
const selectMinRating = (score) => {
  searchParams.value.min_star = score === 0 ? '' : score
  searchParams.value.page = 1
  finished.value = false
  loadData()
}

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    // 只传递API支持的参数
    const requestParams = { ...searchParams.value }
    // page = 1 count = 10
    requestParams.page = 1
    requestParams.count = 10

    try {
      console.log("请求参数:", requestParams)

      // 调用真实API，直接传递对象参数
      const response = await getEnjoyList(requestParams)

      if (response.code === '000000') {
        processResponseData(response)
      }
    } catch (apiError) {
      console.log('API调用失败，使用模拟数据:', apiError)
      // 使用模拟数据
      // const response = JSON.parse(JSON.stringify(mockData))
      // processResponseData(response)
    }
  } catch (error) {
    console.error('请求失败:', error)
    // 添加兜底数据
    if (enjoyList.value.length === 0) {
      enjoyList.value = [
        {
          id: 'fallback-1',
          title: '示例饭店',
          content: '这是一家示例饭店，展示了基本信息。',
          cover: 'https://via.placeholder.com/400x300?text=示例饭店',
          tags: ['示例', '饭店'],
          star: 4.5,
          location: '示例地址',
          cuisine: '示例菜系',
          created_at: new Date().toISOString()
        }
      ]
      totalCount.value = 1
    }
  } finally {
    loading.value = false
  }
}

// 处理响应数据 - 适配API响应格式
const processResponseData = (response) => {
  if (response.data && response.data.enjoys) {
    // 使用可靠的占位图片
    const newList = response.data.enjoys.map(item => ({
      ...item,
      cover: item.cover && item.cover.includes('http')
        ? item.cover
        : `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.title || '饭店')}`
    }))

    if (searchParams.value.page === 1) {
      enjoyList.value = newList
    } else {
      enjoyList.value.push(...newList)
    }

    totalCount.value = response.data.total || 0
    finished.value = enjoyList.value.length >= totalCount.value
  }
}

// 搜索
const handleSearch = () => {
  searchParams.value.page = 1
  finished.value = false
  loadData()
}

// 初始化
onMounted(() => {
  // 加载数据
  loadData()

  // 尝试隐藏底部导航栏
  setTimeout(() => {
    hideTabBar()
  }, 100)
})

// 组件卸载时恢复tabbar显示
onBeforeUnmount(() => {
  showTabBar()
})

// 隐藏底部导航栏
const hideTabBar = () => {
  if (document && document.body) {
    document.body.classList.add('hide-tabbar')
  }

  // 也直接隐藏SNPTabBar组件
  const tabBar = document.querySelector('.snptabbar')
  if (tabBar) {
    tabBar.style.display = 'none'
  }
}

// 显示底部导航栏
  const showTabBar = () => {
    if (document && document.body) {
      document.body.classList.remove('hide-tabbar')
    }

    // 也直接显示SNPTabBar组件
    const tabBar = document.querySelector('.snptabbar')
    if (tabBar) {
      tabBar.style.display = ''
    }
  }

  // 跳转到详情页
  const navigateToDetail = (enjoyId) => {
    router.push(`/enjoy/detail/${enjoyId}`)
  }

  // 跳转到新增页面
  const navigateToCreate = () => {
    router.push('/enjoy/create')
  }
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.enjoy-list-container {
  padding: 0;
  margin: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

/* 筛选栏样式 - 增加上边距，避免被固定导航栏遮挡 */
.filter-bar {
  margin-top: 46px; /* 适配Vant NavBar的高度 */
}

/* 筛选栏样式 */
.filter-bar {
  background-color: #ffffff;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 52px;
  z-index: 10;
}

.search-section {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 18px;
  padding: 8px 14px;
  flex: 1;
}

.search-icon {
  margin-right: 8px;
  color: #999;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 6px 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
}

.search-btn {
  background: #1890ff; /* 饭店主题使用蓝色系 */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.search-btn:hover {
  background: #40a9ff;
}

/* 筛选样式 */
.cuisine-filter,
.rating-filter {
  margin-top: 8px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.cuisine-options,
.rating-options {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.cuisine-options::-webkit-scrollbar,
.rating-options::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.cuisine-option,
.rating-option {
  flex-shrink: 0;
  padding: 6px 14px;
  background-color: #f5f5f5;
  border-radius: 16px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.cuisine-option:hover,
.rating-option:hover {
  background-color: #e8e8e8;
}

.cuisine-option.active,
.rating-option.active {
  background-color: #1890ff;
  color: white;
}

/* 列表样式 */
.enjoy-list {
  padding: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.result-count {
  color: #666;
  font-weight: 500;
}

.active-filter {
  color: #1890ff;
  font-size: 13px;
  background-color: #e6f7ff;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 列表项样式 */
.enjoy-item {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.enjoy-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.enjoy-item {
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
}

.item-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.enjoy-item:hover .cover-image {
  transform: scale(1.03);
}

.rating-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-star {
  color: #ffd700;
  font-size: 14px;
}

.rating-score {
  font-size: 14px;
}

.item-content {
  padding: 14px 16px 16px;
}

.item-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
  line-height: 1.4;
}

/* 标签样式 */
.enjoy-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.cuisine-badge {
  background-color: #1890ff;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.enjoy-tag {
  background-color: #f5f5f5;
  color: #666;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.item-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.enjoy-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
}

.create-time {
  font-size: 12px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

/* 新增按钮样式 */
.create-btn {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  background-color: #1890ff;
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  z-index: 10;
}

/* 适配iOS安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .create-btn {
    bottom: calc(80px + env(safe-area-inset-bottom));
  }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px;
  color: #666;
}

.empty-hint {
  font-size: 14px;
  margin: 0;
  color: #999;
}

/* 媒体查询适配不同屏幕 */
@media (min-width: 768px) {
  .enjoy-list-container {
    max-width: 768px;
    margin: 0 auto;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }

  .cuisine-options,
  .rating-options {
    overflow-x: visible;
    flex-wrap: wrap;
  }
}

/* 修复iOS上的安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .enjoy-list-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
