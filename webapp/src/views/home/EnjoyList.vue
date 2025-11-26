<template>
  <div class="enjoy-list-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">生活体验记录</h1>
    </div>

    <!-- 搜索筛选栏 -->
    <div class="filter-bar">
      <div class="search-section">
        <div class="search-box">
          <div class="search-icon">🔍</div>
          <input
            v-model="searchParams.keyword"
            type="text"
            placeholder="搜索标题/标签/内容"
            class="search-input"
            @keyup.enter="handleSearch"
          />
        </div>
        <button @click="handleSearch" class="search-btn">
          搜索
        </button>
      </div>
      
      <!-- 分类筛选 -->
      <div class="category-filter">
        <span class="filter-label">分类:</span>
        <div class="category-options">
          <span
            v-for="option in categoryOptions"
            :key="option.value"
            class="category-option"
            :class="{ active: searchParams.category === option.value }"
            @click="selectCategory(option.value)"
          >
            {{ option.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="record-list">
      <!-- 直接显示数据，不使用van-list组件 -->
      <div v-if="recordList.length > 0">
        <div class="list-header">
          <span class="result-count">找到 {{ totalCount }} 条记录</span>
          <span v-if="searchParams.category" class="active-filter">
            当前筛选: {{ getCategoryName(searchParams.category) }}
          </span>
        </div>
        
        <div
          v-for="item in recordList"
          :key="item.id"
          class="record-item"
        >
          <!-- 封面图 -->
          <div class="item-cover">
            <img 
              :src="item.cover" 
              alt="{{ item.title }}"
              @error="handleImageError"
              class="cover-image"
            />
            <div 
              class="category-tag" 
              :style="{ backgroundColor: getCategoryColor(item.category) }"
            >
              {{ getCategoryName(item.category) }}
            </div>
          </div>
          
          <!-- 内容信息 -->
          <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>
            
            <!-- 星级评分 -->
            <div class="star-rating">
              <span v-for="n in 5" :key="n" class="star">
                {{ n <= item.starLevel ? '★' : '☆' }}
              </span>
            </div>
            
            <!-- 相关人员 -->
            <div class="related-info">
              <span class="creator">由 {{ item.creatorName }} 创建</span>
              <span v-if="item.relatedUserNames && item.relatedUserNames.length > 0">
                · 与 {{ item.relatedUserNames.join('、') }} 一起
              </span>
            </div>
            
            <!-- 时间信息 -->
            <div class="time-info">{{ item.createTime }}</div>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载中...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">📋</div>
        <p class="empty-text">暂无记录</p>
        <p class="empty-hint">去探索美好的生活体验吧</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import placeholderImage from '@/assets/images/placeholder.png'

// 路由
const route = useRoute()

// 搜索参数
const searchParams = ref({
  category: '', // 可选，分类筛选，默认所有
  keyword: '', // 可选，搜索标题/标签/内容
  relatedUserId: '', // 可选，关联用户ID筛选
  relatedRole: '', // 可选，关联角色筛选
  sharedScope: '', // 可选，数据权限筛选，默认所有
  page: 1, // 可选，页码，默认 1
  count: 10 // 可选，页大小，默认 10
})

// 列表数据
const recordList = ref([])
const loading = ref(false)
const finished = ref(false)
const totalCount = ref(0)

// 筛选选项
const categoryOptions = [
  { text: '全部', value: '' },
  { text: '吃', value: 'eat' },
  { text: '喝', value: 'drink' },
  { text: '玩', value: 'play' },
  { text: '乐', value: 'enjoy' }
]

// 模拟数据
const mockData = {
  "code": "000000",
  "msg": "查询成功",
  "data": {
    "total": 28,
    "list": [
      {
        "id": "655f2b8b1234567890abcdef",
        "category": "eat",
        "title": "老婆做的番茄牛腩",
        "cover": "https://via.placeholder.com/400x300?text=美食+番茄牛腩",
        "starLevel": 5,
        "creatorName": "我",
        "relatedUserNames": ["老婆"],
        "createTime": "2025-11-23 10:00:00",
        "status": 1
      },
      {
        "id": "655f2b8b1234567890abcdeg",
        "category": "drink",
        "title": "自制手冲咖啡",
        "cover": "https://via.placeholder.com/400x300?text=Coffee",
        "starLevel": 4,
        "creatorName": "我",
        "relatedUserNames": [],
        "createTime": "2025-11-22 14:30:00",
        "status": 1
      },
      {
        "id": "655f2b8b1234567890abcdex",
        "category": "play",
        "title": "家庭桌游聚会",
        "cover": "https://via.placeholder.com/400x300?text=Board+Game",
        "starLevel": 5,
        "creatorName": "我",
        "relatedUserNames": ["小明", "小红", "小李"],
        "createTime": "2025-11-20 19:00:00",
        "status": 1
      },
      {
        "id": "655f2b8b1234567890abcdey",
        "category": "enjoy",
        "title": "电影院看新片",
        "cover": "https://via.placeholder.com/400x300?text=Movie",
        "starLevel": 3,
        "creatorName": "我",
        "relatedUserNames": ["老婆"],
        "createTime": "2025-11-19 20:30:00",
        "status": 1
      }
    ]
  }
}

// 获取分类名称
const getCategoryName = (category) => {
  const categoryMap = {
    'eat': '吃',
    'drink': '喝',
    'play': '玩',
    'enjoy': '乐'
  }
  return categoryMap[category] || category
}

// 获取分类颜色
const getCategoryColor = (category) => {
  const colorMap = {
    'eat': '#ee0a24',
    'drink': '#1989fa',
    'play': '#ff6b81',
    'enjoy': '#52c41a'
  }
  return colorMap[category] || '#969799'
}

// 处理图片加载失败
const handleImageError = (event) => {
  event.target.src = placeholderImage
}

// 选择分类
const selectCategory = (category) => {
  searchParams.value.category = category
  searchParams.value.page = 1
  finished.value = false
  loadData()
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    
    // 使用模拟数据
    const response = JSON.parse(JSON.stringify(mockData)) // 深拷贝避免引用问题

    if (response.code === '000000') {
      // 使用可靠的占位图片
      const newList = response.data.list.map(item => ({
        ...item,
        cover: item.cover.includes('via.placeholder.com') 
          ? item.cover 
          : `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.title)}`
      }))

      if (searchParams.value.page === 1) {
        recordList.value = newList
      } else {
        recordList.value.push(...newList)
      }

      totalCount.value = response.data.total
      finished.value = recordList.value.length >= totalCount.value
    }
  } catch (error) {
    console.error('请求失败:', error)
    // 添加兜底数据
    if (recordList.value.length === 0) {
      recordList.value = [
        {
          id: 'fallback-1',
          category: 'eat',
          title: '兜底示例 - 美食体验',
          cover: 'https://via.placeholder.com/400x300?text=兜底示例',
          starLevel: 4,
          creatorName: '系统',
          relatedUserNames: [],
          createTime: new Date().toLocaleString(),
          status: 1
        }
      ]
    }
  } finally {
    loading.value = false
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
  if (categoryFromRoute) {
    searchParams.value.category = categoryFromRoute
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
  if (newCategory) {
    searchParams.value.category = newCategory
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

/* 页面标题 */
.page-header {
  background-color: #ffffff;
  padding: 16px 16px 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-align: center;
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
  background: #1989fa;
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
  background: #1677ee;
}

/* 分类筛选样式 */
.category-filter {
  margin-top: 8px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.category-options {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.category-options::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.category-option {
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

.category-option:hover {
  background-color: #e8e8e8;
}

.category-option.active {
  background-color: #1989fa;
  color: white;
}

/* 列表样式 */
.record-list {
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
  color: #1989fa;
  font-size: 13px;
  background-color: #e6f7ff;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 列表项样式 */
.record-item {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.record-item:hover {
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

.record-item:hover .cover-image {
  transform: scale(1.03);
}

.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 500;
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
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.star-rating {
  margin-bottom: 8px;
}

.star {
  color: #ff976a;
  font-size: 16px;
  margin-right: 2px;
}

.related-info {
  font-size: 13px;
  color: #999;
  margin-bottom: 6px;
}

.creator {
  font-weight: 500;
}

.time-info {
  font-size: 12px;
  color: #bbb;
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
  border-top: 3px solid #1989fa;
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
  .enjoy-list-container {
    max-width: 768px;
    margin: 0 auto;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }
  
  .category-options {
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
