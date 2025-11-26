<template>
  <div class="enjoy-list-container">
    <!-- 搜索筛选栏 -->
    <div class="filter-bar">
      <div class="search-box">
        <van-icon name="search" class="search-icon" />
        <input
          v-model="searchParams.keyword"
          type="text"
          placeholder="搜索标题/标签/内容"
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
      <van-button type="primary" size="small" @click="handleSearch">搜索</van-button>
    </div>

    <!-- 筛选条件栏 -->
    <div class="filter-options">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="searchParams.category"
          :options="categoryOptions"
          placeholder="全部分类"
        />
        <van-dropdown-item
          v-model="searchParams.sharedScope"
          :options="scopeOptions"
          placeholder="全部权限"
        />
        <van-dropdown-item
          v-model="searchParams.relatedRole"
          :options="roleOptions"
          placeholder="全部角色"
        />
      </van-dropdown-menu>
    </div>

    <!-- 记录列表 -->
    <div class="record-list">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="'没有更多了'"
        @load="onLoad"
        class="enjoy-record-list"
      >
        <div
          v-for="item in recordList"
          :key="item.id"
          class="record-item"
        >
          <div class="item-header">
            <h3 class="item-title">{{ item.title }}</h3>
            <div class="star-rating">
              <van-rate v-model="item.starLevel" readonly size="14" />
            </div>
          </div>

          <div class="item-cover">
            <img
              :src="item.cover"
              :alt="item.title"
              class="cover-image"
              @error="handleImageError($event)"
            />
          </div>

          <div class="item-info">
            <div class="category-badge">
              <van-badge
                :color="getCategoryColor(item.category)"
                :text="getCategoryName(item.category)"
              />
            </div>

            <div class="user-info">
              <span class="creator">创建者: {{ item.creatorName }}</span>
              <span v-if="item.relatedUserNames && item.relatedUserNames.length > 0" class="related-users">
                相关: {{ item.relatedUserNames.join(', ') }}
              </span>
            </div>

            <div class="item-time">
              <van-icon name="clock-o" size="12" />
              <span>{{ item.createTime }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <!-- 空状态 -->
    <div v-if="recordList.length === 0 && !loading" class="empty-state">
      <van-empty description="暂无记录" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { List, Rate, Badge, Icon, Empty, DropdownMenu, DropdownItem, Button } from 'vant'
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

const scopeOptions = [
  { text: '全部', value: '' },
  { text: '公开', value: 'public' },
  { text: '私密', value: 'private' },
  { text: '好友可见', value: 'friends' }
]

const roleOptions = [
  { text: '全部', value: '' },
  { text: '制作者', value: 'maker' },
  { text: '参与者', value: 'participant' },
  { text: '评论者', value: 'commenter' }
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
        "cover": "https://yolo-app.com/imgs/tomato-beef-cover.jpg",
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
        "cover": "https://via.placeholder.com/400x200?text=Coffee",
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
        "cover": "https://via.placeholder.com/400x200?text=Board+Game",
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
        "cover": "https://via.placeholder.com/400x200?text=Movie",
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

// 加载数据
const loadData = async () => {
  try {
    // 实际项目中应该调用真实API
    // const response = await request.get('/api/v1/enjoy-record/list', { params: searchParams.value })

    // 使用模拟数据
    const response = mockData

    if (response.code === '000000') {
      const newList = response.data.list.map(item => ({
        ...item,
        cover: item.cover.replace(/`/g, '') // 移除cover URL中的反引号
      }))

      if (searchParams.value.page === 1) {
        recordList.value = newList
      } else {
        recordList.value.push(...newList)
      }

      totalCount.value = response.data.total
      finished.value = recordList.value.length >= totalCount.value
    } else {
      console.error('获取数据失败:', response.msg)
    }
  } catch (error) {
    console.error('请求失败:', error)
  } finally {
    loading.value = false
  }
}

// 列表触底加载
const onLoad = () => {
  if (!finished.value) {
    searchParams.value.page++
    loadData()
  } else {
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
  // 隐藏底部导航栏
  hideTabBar()

  // 从路由参数获取分类
  const categoryFromRoute = route.query.category
  if (categoryFromRoute) {
    searchParams.value.category = categoryFromRoute
  }

  loadData()
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

// 页面离开前恢复tabbar显示
onBeforeUnmount(() => {
  showTabBar()
})

// 隐藏底部导航栏
const hideTabBar = () => {
  // 添加类到body以隐藏tabbar
  document.body.classList.add('hide-tabbar')
}

// 显示底部导航栏
const showTabBar = () => {
  // 移除类以显示tabbar
  document.body.classList.remove('hide-tabbar')
}
</script>

<style lang="scss" scoped>
.enjoy-list-container {
  padding-bottom: 20px; // 不需要为底部导航栏留出空间
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 隐藏底部导航栏 */
:global(.hide-tabbar) .snptabbar {
  display: none !important;
}

.filter-bar {
  display: flex;
  padding: 10px;
  background-color: #fff;
  gap: 10px;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.search-box {
  flex: 1;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 15px;
  padding: 0 10px;
  display: flex;
  align-items: center;
}

.search-icon {
  color: #969799;
  margin-right: 5px;
}

.search-input {
  width: 100%;
  height: 30px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.filter-options {
  background-color: #fff;
  margin-bottom: 10px;
}

.record-list {
  background-color: #f5f5f5;
}

.enjoy-record-list {
  background-color: #f5f5f5;
  padding: 0 10px;
}

.record-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #323233;
  flex: 1;
  margin-right: 10px;
  line-height: 1.4;
}

.star-rating {
  white-space: nowrap;
}

.item-cover {
  margin-bottom: 10px;
}

.cover-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-badge {
  align-self: flex-start;
}

.user-info {
  display: flex;
  gap: 10px;
  font-size: 13px;
  color: #646566;
  flex-wrap: wrap;
}

.item-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #969799;
}

.empty-state {
  padding: 40px 0;
}

// 响应式调整
@media (max-width: 320px) {
  .cover-image {
    height: 150px;
  }

  .item-title {
    font-size: 15px;
  }
}
</style>
