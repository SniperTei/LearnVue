<template>
  <div class="drink-list-container">
    <!-- 使用Vant的NavBar组件 -->
    <NavBar
      title="饮料列表"
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
            v-model="searchParams.name"
            type="text"
            placeholder="搜索饮料名称"
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <button @click="handleSearch" class="search-btn">
          搜索
        </button>
      </div>

      <!-- 类型筛选 -->
      <div class="type-filter">
        <span class="filter-label">类型:</span>
        <div class="type-options">
          <span
            v-for="option in typeOptions"
            :key="option.value"
            class="type-option"
            :class="{ active: searchParams.type === option.value }"
            @click="selectType(option.value)"
          >
            {{ option.text }}
          </span>
        </div>
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
    </div>

    <!-- 数据列表展示 -->
    <div class="drink-list">
      <!-- 直接显示数据 -->
      <div v-if="drinkList.length > 0">
        <div class="list-header">
          <span class="result-count">找到 {{ totalCount }} 种饮料</span>
          <span v-if="searchParams.type" class="active-filter">
            当前筛选: {{ getTypeText(searchParams.type) }}
          </span>
        </div>

        <div
          v-for="item in drinkList"
          :key="item.id"
          class="drink-item"
        >
          <!-- 封面图 -->
          <div class="item-cover">
            <img
              :src="item.image"
              alt="{{ item.name }}"
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
            <h3 class="item-title">{{ item.name }}</h3>

            <!-- 标签 -->
            <div class="drink-tags">
              <span v-if="item.type" class="type-badge">{{ item.type }}</span>
              <span v-if="item.flavor" class="flavor-badge">{{ item.flavor }}</span>
              <span v-for="(tag, index) in item.tags" :key="index" class="drink-tag">{{ tag }}</span>
            </div>

            <!-- 简介 -->
            <p class="item-description">{{ item.description }}</p>

            <!-- 相关信息 -->
            <div class="drink-info">
              <span class="brand">🏪 {{ item.brand }}</span>
              <span class="price">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载饮料中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🥤</div>
        <p class="empty-text">暂无饮料记录</p>
        <p class="empty-hint">去发现更多美味饮品吧</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import placeholderImage from '@/assets/images/placeholder.png'
import { NavBar } from 'vant';

// 路由
const route = useRoute()
const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// 搜索参数
const searchParams = ref({
  page: 1, // 页码，默认1
  count: 10, // 每页数量，默认10
  name: '', // 名称模糊查询
  type: '', // 类型精确查询
  flavor: '', // 口味精确查询
  min_price: '', // 最低价格
  max_price: '' // 最高价格
})

// 列表数据
const drinkList = ref([])
const loading = ref(false)
const finished = ref(false)
const totalCount = ref(0)

// 类型筛选选项
const typeOptions = [
  { text: '全部', value: '' },
  { text: '碳酸饮料', value: '碳酸饮料' },
  { text: '果汁', value: '果汁' },
  { text: '茶饮料', value: '茶饮料' },
  { text: '矿泉水', value: '矿泉水' },
  { text: '功能饮料', value: '功能饮料' }
]

// 口味筛选选项
const flavorOptions = [
  { text: '全部', value: '' },
  { text: '甜', value: '甜' },
  { text: '酸', value: '酸' },
  { text: '苦', value: '苦' },
  { text: '无糖', value: '无糖' },
  { text: '低糖', value: '低糖' }
]

// 模拟饮料数据
const mockData = {
  "code": "000000",
  "statusCode": 200,
  "msg": "获取饮料列表成功",
  "data": {
    "drinks": [
      {
        "id": "1",
        "name": "可口可乐",
        "description": "经典碳酸饮料，口感醇厚，甜味适中",
        "image": "https://via.placeholder.com/400x300?text=可口可乐",
        "tags": ["碳酸", "经典", "畅销"],
        "star": 4.6,
        "brand": "可口可乐公司",
        "type": "碳酸饮料",
        "flavor": "甜",
        "price": 3.00,
        "create_time": "2024-01-01T00:00:00"
      },
      {
        "id": "2",
        "name": "雪碧",
        "description": "柠檬味碳酸饮料，清爽解渴",
        "image": "https://via.placeholder.com/400x300?text=雪碧",
        "tags": ["碳酸", "柠檬", "清爽"],
        "star": 4.5,
        "brand": "可口可乐公司",
        "type": "碳酸饮料",
        "flavor": "甜",
        "price": 3.00,
        "create_time": "2024-01-01T12:00:00"
      },
      {
        "id": "3",
        "name": "农夫山泉",
        "description": "天然矿泉水，纯净健康",
        "image": "https://via.placeholder.com/400x300?text=农夫山泉",
        "tags": ["矿泉水", "天然", "健康"],
        "star": 4.8,
        "brand": "农夫山泉",
        "type": "矿泉水",
        "flavor": "",
        "price": 2.00,
        "create_time": "2024-01-02T18:00:00"
      },
      {
        "id": "4",
        "name": "统一绿茶",
        "description": "清爽绿茶，低糖健康",
        "image": "https://via.placeholder.com/400x300?text=统一绿茶",
        "tags": ["茶饮料", "低糖", "健康"],
        "star": 4.3,
        "brand": "统一企业",
        "type": "茶饮料",
        "flavor": "低糖",
        "price": 3.50,
        "create_time": "2024-01-03T10:00:00"
      },
      {
        "id": "5",
        "name": "脉动",
        "description": "维生素功能饮料，补充能量",
        "image": "https://via.placeholder.com/400x300?text=脉动",
        "tags": ["功能饮料", "维生素", "能量"],
        "star": 4.2,
        "brand": "达能集团",
        "type": "功能饮料",
        "flavor": "甜",
        "price": 4.00,
        "create_time": "2024-01-04T09:00:00"
      }
    ],
    "total": 28,
    "page": 1,
    "count": 10
  },
  "timestamp": "2025-11-27 13:44:02"
}

// 获取类型文本
const getTypeText = (type) => {
  const option = typeOptions.find(opt => opt.value === type)
  return option ? option.text : type
}

// 处理图片加载失败
const handleImageError = (event) => {
  event.target.src = placeholderImage
}

// 选择类型
const selectType = (type) => {
  searchParams.value.type = type
  searchParams.value.page = 1
  finished.value = false
  loadData()
}

// 选择口味
const selectFlavor = (flavor) => {
  searchParams.value.flavor = flavor
  searchParams.value.page = 1
  finished.value = false
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true

    // 只传递支持的参数
    const requestParams = { ...searchParams.value }

    try {
      console.log("请求参数:", requestParams)

      // 使用模拟数据
      const response = JSON.parse(JSON.stringify(mockData))
      console.log('模拟数据响应:', response)

      if (response.code === '000000') {
        processResponseData(response)
      }
    } catch (apiError) {
      console.log('数据获取失败，使用默认模拟数据:', apiError)
      // 使用模拟数据
      const response = JSON.parse(JSON.stringify(mockData))
      processResponseData(response)
    }
  } catch (error) {
    console.error('请求失败:', error)
    // 添加兜底数据
    if (drinkList.value.length === 0) {
      drinkList.value = [
        {
          id: 'fallback-1',
          name: '示例饮料',
          description: '这是一种示例饮料，展示了基本信息。',
          image: 'https://via.placeholder.com/400x300?text=示例饮料',
          tags: ['示例', '饮料'],
          star: 4.5,
          brand: '示例品牌',
          type: '示例类型',
          flavor: '示例口味',
          price: 3.50
        }
      ]
      totalCount.value = 1
    }
  } finally {
    loading.value = false
  }
}

// 处理响应数据
const processResponseData = (response) => {
  if (response.data && response.data.drinks) {
    // 使用可靠的占位图片
    const newList = response.data.drinks.map(item => ({
      ...item,
      image: item.image && item.image.includes('http')
        ? item.image
        : `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name || '饮料')}`
    }))

    if (searchParams.value.page === 1) {
      drinkList.value = newList
    } else {
      drinkList.value.push(...newList)
    }

    totalCount.value = response.data.total || 0
    finished.value = drinkList.value.length >= totalCount.value
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
  if (categoryFromRoute && categoryFromRoute === 'drink') {
    console.log('从饮料分类进入')
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
  if (newCategory && newCategory === 'drink') {
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
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.drink-list-container {
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
  background: #1890ff; /* 饮料主题使用蓝色系 */
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
.type-filter,
.flavor-filter {
  margin-top: 8px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.type-options,
.flavor-options {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.type-options::-webkit-scrollbar,
.flavor-options::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.type-option,
.flavor-option {
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

.type-option:hover,
.flavor-option:hover {
  background-color: #e8e8e8;
}

.type-option.active,
.flavor-option.active {
  background-color: #1890ff;
  color: white;
}

/* 列表样式 */
.drink-list {
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
.drink-item {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.drink-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.drink-item:hover .cover-image {
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
.drink-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.type-badge {
  background-color: #1890ff;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.flavor-badge {
  background-color: #52c41a;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.drink-tag {
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

.drink-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.brand {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #ff4d4f;
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
  .drink-list-container {
    max-width: 768px;
    margin: 0 auto;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }

  .type-options,
  .flavor-options {
    overflow-x: visible;
    flex-wrap: wrap;
  }
}

/* 修复iOS上的安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .drink-list-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
