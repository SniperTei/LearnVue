<template>
  <div class="food-list-container">
    <!-- 使用Vant的NavBar组件 -->
    <NavBar
      title="美食探索"
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
            placeholder="搜索美食名称"
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <button @click="handleSearch" class="search-btn">
          搜索
        </button>
      </div>

      <!-- 口味筛选 -->
      <div class="flavor-filter">
        <span class="filter-label">口味:</span>
        <div class="flavor-options">
          <span
            v-for="option in flavorOptions"
            :key="option.value"
            class="flavor-option"
            :class="{ active: searchParams.flavor === option.value }"
            @click="selectFlavor(option.value)"
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
    <div class="food-list">
      <!-- 直接显示数据 -->
      <div v-if="foodList.length > 0">
        <div class="list-header">
          <span class="result-count">找到 {{ totalCount }} 道美食</span>
          <span v-if="searchParams.flavor" class="active-filter">
            当前筛选: {{ getFlavorText(searchParams.flavor) }}
          </span>
        </div>

        <div
          v-for="item in foodList"
          :key="item.id"
          class="food-item"
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
            <div class="food-tags">
              <span v-if="item.flavor" class="flavor-badge">{{ item.flavor }}</span>
              <span v-for="(tag, index) in item.tags" :key="index" class="food-tag">{{ tag }}</span>
            </div>

            <!-- 简介 -->
            <p class="item-description">{{ item.content }}</p>

            <!-- 相关信息 -->
            <div class="food-info">
              <span class="maker">👨‍🍳 {{ item.maker }}</span>
              <span class="create-time">{{ formatTime(item.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载美食中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🍽️</div>
        <p class="empty-text">暂无美食记录</p>
        <p class="empty-hint">去发现更多美味佳肴吧</p>
      </div>
      
      <!-- 新增按钮 -->
      <Button 
        type="primary" 
        class="create-btn"
        @click="navigateToCreate"
        round
      >
        新增美食
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import placeholderImage from '@/assets/images/placeholder.png'
import { getFoodList } from '@/api/foodApi.js'
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
  maker: '', // 制作者精确查询
  min_star: '', // 最低评分
  max_star: '', // 最高评分
  flavor: '', // 口味精确查询
  tag: '' // 标签包含查询
})

// 列表数据
const foodList = ref([])
const loading = ref(false)
const finished = ref(false)
const totalCount = ref(0)

// 口味筛选选项
const flavorOptions = [
  { text: '全部', value: '' },
  { text: '麻辣', value: '麻辣' },
  { text: '酸甜', value: '酸甜' },
  { text: '咸鲜', value: '咸鲜' },
  { text: '清淡', value: '清淡' },
  { text: '香辣', value: '香辣' }
]

// 评分筛选选项
const ratingOptions = [0, 3, 4, 4.5]

// 模拟数据 - 调整为API响应格式（使用PostgreSQL的整数ID）
const mockData = {
  "code": "000000",
  "statusCode": 200,
  "msg": "获取食品列表成功",
  "data": {
    "foods": [
      {
        "id": 1,
        "title": "麻婆豆腐",
        "content": "经典川菜，麻辣鲜香，豆腐嫩滑，肉末鲜香。",
        "cover": "https://via.placeholder.com/400x300?text=麻婆豆腐",
        "images": ["https://via.placeholder.com/400x300?text=麻婆豆腐-1.jpg"],
        "tags": ["川菜", "豆腐", "麻辣", "下饭菜"],
        "star": 4.8,
        "maker": "老川菜馆",
        "flavor": "麻辣",
        "created_by": 1,
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
      },
      {
        "id": 2,
        "title": "宫保鸡丁",
        "content": "鸡肉鲜嫩，花生酥脆，口味麻辣酸甜。",
        "cover": "https://via.placeholder.com/400x300?text=宫保鸡丁",
        "images": [],
        "tags": ["川菜", "鸡肉", "麻辣", "经典"],
        "star": 4.7,
        "maker": "老川菜馆",
        "flavor": "麻辣",
        "created_by": 1,
        "created_at": "2024-01-01T12:00:00",
        "updated_at": "2024-01-01T12:00:00"
      },
      {
        "id": 3,
        "title": "白切鸡",
        "content": "广东名菜，鸡肉嫩滑，蘸料鲜香。",
        "cover": "https://via.placeholder.com/400x300?text=白切鸡",
        "images": [],
        "tags": ["粤菜", "鸡肉", "清淡", "经典"],
        "star": 4.9,
        "maker": "粤式餐厅",
        "flavor": "咸鲜",
        "created_by": 1,
        "created_at": "2024-01-02T18:00:00",
        "updated_at": "2024-01-02T18:00:00"
      },
      {
        "id": 4,
        "title": "糖醋排骨",
        "content": "酸甜可口，肉质酥烂，色泽红亮。",
        "cover": "https://via.placeholder.com/400x300?text=糖醋排骨",
        "images": [],
        "tags": ["苏菜", "排骨", "酸甜", "家常菜"],
        "star": 4.6,
        "maker": "江南小厨",
        "flavor": "酸甜",
        "created_by": 1,
        "created_at": "2024-01-03T10:00:00",
        "updated_at": "2024-01-03T10:00:00"
      }
    ],
    "total": 35,
    "page": 1,
    "count": 10
  },
  "timestamp": "2025-11-27 13:44:02"
}

// 获取口味文本
const getFlavorText = (flavor) => {
  const option = flavorOptions.find(opt => opt.value === flavor)
  return option ? option.text : flavor
}

// 处理图片加载失败
const handleImageError = (event) => {
  event.target.src = placeholderImage
}

// 选择口味
const selectFlavor = (flavor) => {
  searchParams.value.flavor = flavor
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
      const response = await getFoodList(requestParams)

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
    if (foodList.value.length === 0) {
      foodList.value = [
        {
          id: 'fallback-1',
          title: '示例美食',
          content: '这是一道美味的示例菜品，展示了基本信息。',
          cover: 'https://via.placeholder.com/400x300?text=示例美食',
          tags: ['示例', '美食'],
          star: 4.5,
          maker: '示例厨师',
          flavor: '示例口味',
          create_time: new Date().toISOString()
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
  if (response.data && response.data.foods) {
    // 使用可靠的占位图片
    const newList = response.data.foods.map(item => ({
      ...item,
      cover: item.cover && item.cover.includes('http')
        ? item.cover
        : `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.title || '美食')}`
    }))

    if (searchParams.value.page === 1) {
      foodList.value = newList
    } else {
      foodList.value.push(...newList)
    }

    totalCount.value = response.data.total || 0
    finished.value = foodList.value.length >= totalCount.value
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
  // 从路由参数获取分类
  const categoryFromRoute = route.query.category
  if (categoryFromRoute && categoryFromRoute === 'eat') {
    // 如果是从Home.vue的'吃'分类过来，不需要特殊处理
    console.log('从美食分类进入')
  }

  // 加载数据
  loadData()

  // 尝试隐藏底部导航栏
  setTimeout(() => {
    hideTabBar()
  }, 100)
})

// 监听路由参数变化
watch(() => route.query.category, (newCategory) => {
  if (newCategory && newCategory === 'eat') {
    searchParams.value.page = 1
    finished.value = false
    loadData()
  }
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
  const navigateToDetail = (foodId) => {
    router.push(`/food/detail/${foodId}`)
  }
  
  // 跳转到新增页面
  const navigateToCreate = () => {
    router.push('/food/create')
  }
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.food-list-container {
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
  background: #fa541c; /* 食物主题使用橙色系 */
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
  background: #d4380d;
}

/* 筛选样式 */
.flavor-filter,
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

.flavor-options,
.rating-options {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.flavor-options::-webkit-scrollbar,
.rating-options::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.flavor-option,
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

.flavor-option:hover,
.rating-option:hover {
  background-color: #e8e8e8;
}

.flavor-option.active,
.rating-option.active {
  background-color: #fa541c;
  color: white;
}

/* 列表样式 */
.food-list {
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
  color: #fa541c;
  font-size: 13px;
  background-color: #fff2e8;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 列表项样式 */
.food-item {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.food-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.food-item {
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

.food-item:hover .cover-image {
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
.food-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.flavor-badge {
  background-color: #fa541c;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.food-tag {
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

.food-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.maker {
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
  border-top: 3px solid #fa541c;
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
  background-color: #fa541c;
  border: none;
  box-shadow: 0 4px 12px rgba(250, 84, 28, 0.4);
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
  .food-list-container {
    max-width: 768px;
    margin: 0 auto;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }

  .flavor-options,
  .rating-options {
    overflow-x: visible;
    flex-wrap: wrap;
  }
}

/* 修复iOS上的安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .food-list-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
