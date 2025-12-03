<template>
  <div class="fun-container">
    <!-- 使用Vant的NavBar组件 -->
    <NavBar
      title="娱乐休闲"
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
            placeholder="搜索娱乐活动"
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

      <!-- 适用人数筛选 -->
      <div class="people-filter">
        <span class="filter-label">适用人数:</span>
        <div class="people-options">
          <span
            v-for="option in peopleOptions"
            :key="option.value"
            class="people-option"
            :class="{ active: searchParams.people === option.value }"
            @click="selectPeople(option.value)"
          >
            {{ option.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="fun-list">
      <!-- 直接显示数据 -->
      <div v-if="funList.length > 0">
        <div class="list-header">
          <span class="result-count">找到 {{ totalCount }} 个娱乐项目</span>
          <span v-if="searchParams.type" class="active-filter">
            当前筛选: {{ getTypeText(searchParams.type) }}
          </span>
        </div>

        <div
          v-for="item in funList"
          :key="item.id"
          class="fun-item"
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
            <div class="fun-tags">
              <span v-if="item.type" class="type-badge">{{ item.type }}</span>
              <span v-if="item.people" class="people-badge">{{ item.people }}人</span>
              <span v-for="(tag, index) in item.tags" :key="index" class="fun-tag">{{ tag }}</span>
            </div>

            <!-- 简介 -->
            <p class="item-description">{{ item.description }}</p>

            <!-- 相关信息 -->
            <div class="fun-info">
              <span class="location">📍 {{ item.location }}</span>
              <span class="price">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载娱乐项目...</p>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🎮</div>
        <p class="empty-text">暂无娱乐记录</p>
        <p class="empty-hint">去发现更多有趣的活动吧</p>
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
  people: '', // 适用人数
  location: '', // 地点模糊查询
  min_price: '', // 最低价格
  max_price: '' // 最高价格
})

// 列表数据
const funList = ref([])
const loading = ref(false)
const finished = ref(false)
const totalCount = ref(0)

// 类型筛选选项
const typeOptions = [
  { text: '全部', value: '' },
  { text: '电影', value: '电影' },
  { text: '游戏', value: '游戏' },
  { text: 'KTV', value: 'KTV' },
  { text: '密室逃脱', value: '密室逃脱' },
  { text: '桌游', value: '桌游' },
  { text: '运动', value: '运动' },
  { text: '展览', value: '展览' }
]

// 人数筛选选项
const peopleOptions = [
  { text: '不限', value: '' },
  { text: '1-2人', value: '2' },
  { text: '3-5人', value: '5' },
  { text: '6-10人', value: '10' },
  { text: '10人以上', value: '10+' }
]

// 模拟娱乐数据
const mockData = {
  "code": "000000",
  "statusCode": 200,
  "msg": "获取娱乐项目列表成功",
  "data": {
    "funItems": [
      {
        "id": "1",
        "name": "星际影城",
        "description": "豪华IMAX影城，提供最新电影放映，舒适的观影环境",
        "image": "https://via.placeholder.com/400x300?text=星际影城",
        "tags": ["电影", "IMAX", "休闲"],
        "star": 4.7,
        "type": "电影",
        "people": "不限",
        "location": "市中心",
        "price": 45.00,
        "create_time": "2024-01-01T00:00:00"
      },
      {
        "id": "2",
        "name": "欢乐桌游吧",
        "description": "提供百余种桌游，专业的游戏指导，适合朋友聚会",
        "image": "https://via.placeholder.com/400x300?text=欢乐桌游吧",
        "tags": ["桌游", "聚会", "社交"],
        "star": 4.5,
        "type": "桌游",
        "people": "3-5人",
        "location": "大学城",
        "price": 68.00,
        "create_time": "2024-01-01T12:00:00"
      },
      {
        "id": "3",
        "name": "星际密室逃脱",
        "description": "高科技密室逃脱，多种主题场景，挑战你的智商",
        "image": "https://via.placeholder.com/400x300?text=星际密室逃脱",
        "tags": ["密室", "解谜", "刺激"],
        "star": 4.8,
        "type": "密室逃脱",
        "people": "4-6人",
        "location": "商业广场",
        "price": 128.00,
        "create_time": "2024-01-02T18:00:00"
      },
      {
        "id": "4",
        "name": "乐动KTV",
        "description": "专业音响设备，海量曲库，私人包厢设计",
        "image": "https://via.placeholder.com/400x300?text=乐动KTV",
        "tags": ["K歌", "聚会", "音乐"],
        "star": 4.6,
        "type": "KTV",
        "people": "5-10人",
        "location": "娱乐中心",
        "price": 298.00,
        "create_time": "2024-01-03T10:00:00"
      },
      {
        "id": "5",
        "name": "未来游戏体验馆",
        "description": "VR游戏、体感游戏、主机游戏一站式体验",
        "image": "https://via.placeholder.com/400x300?text=未来游戏体验馆",
        "tags": ["游戏", "VR", "科技"],
        "star": 4.9,
        "type": "游戏",
        "people": "不限",
        "location": "科技园区",
        "price": 88.00,
        "create_time": "2024-01-04T09:00:00"
      },
      {
        "id": "6",
        "name": "现代艺术展",
        "description": "当代艺术家作品展览，沉浸式艺术体验",
        "image": "https://via.placeholder.com/400x300?text=现代艺术展",
        "tags": ["艺术", "展览", "文化"],
        "star": 4.4,
        "type": "展览",
        "people": "不限",
        "location": "美术馆",
        "price": 50.00,
        "create_time": "2024-01-05T14:00:00"
      }
    ],
    "total": 32,
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

// 选择人数
const selectPeople = (people) => {
  searchParams.value.people = people
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
    if (funList.value.length === 0) {
      funList.value = [
        {
          id: 'fallback-1',
          name: '示例娱乐活动',
          description: '这是一个示例娱乐活动，展示了基本信息。',
          image: 'https://via.placeholder.com/400x300?text=示例娱乐',
          tags: ['示例', '娱乐'],
          star: 4.5,
          type: '示例类型',
          people: '不限',
          location: '示例地点',
          price: 88.00
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
  if (response.data && response.data.funItems) {
    // 使用可靠的占位图片
    const newList = response.data.funItems.map(item => ({
      ...item,
      image: item.image && item.image.includes('http')
        ? item.image
        : `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name || '娱乐')}`
    }))

    if (searchParams.value.page === 1) {
      funList.value = newList
    } else {
      funList.value.push(...newList)
    }

    totalCount.value = response.data.total || 0
    finished.value = funList.value.length >= totalCount.value
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
  if (categoryFromRoute && categoryFromRoute === 'fun') {
    console.log('从娱乐分类进入')
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
  if (newCategory && newCategory === 'fun') {
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
.fun-container {
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
  background: #722ed1; /* 娱乐主题使用紫色系 */
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
  background: #9254de;
}

/* 筛选样式 */
.type-filter,
.people-filter {
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
.people-options {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.type-options::-webkit-scrollbar,
.people-options::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.type-option,
.people-option {
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
.people-option:hover {
  background-color: #e8e8e8;
}

.type-option.active,
.people-option.active {
  background-color: #722ed1;
  color: white;
}

/* 列表样式 */
.fun-list {
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
  color: #722ed1;
  font-size: 13px;
  background-color: #f9f0ff;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 列表项样式 */
.fun-item {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.fun-item:hover {
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

.fun-item:hover .cover-image {
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
.fun-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.type-badge {
  background-color: #722ed1;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.people-badge {
  background-color: #13c2c2;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.fun-tag {
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

.fun-info {
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
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  border-top: 3px solid #722ed1;
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
  .fun-container {
    max-width: 768px;
    margin: 0 auto;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }

  .type-options,
  .people-options {
    overflow-x: visible;
    flex-wrap: wrap;
  }
}

/* 修复iOS上的安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .fun-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>