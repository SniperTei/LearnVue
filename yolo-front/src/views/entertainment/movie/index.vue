<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const queryParams = ref({
  name: '',
  type: '',
  page: 1,
  pageSize: 8
})

const movieList = ref([
  {
    id: 1,
    name: '盗梦空间',
    poster: 'https://via.placeholder.com/300x400',
    rating: 4.5,
    year: '2010',
    description: '在这部精彩绝伦的科幻动作片中，莱昂纳多·迪卡普里奥饰演的柯布是一位技术高超的盗梦者...'
  },
  {
    id: 2,
    name: '星际穿越',
    poster: 'https://via.placeholder.com/300x400',
    rating: 4.8,
    year: '2014',
    description: '一部关于爱、生存与希望的史诗级科幻电影...'
  }
])
const total = ref(2)

const handleQuery = () => {
  // TODO: 调用查询接口
  ElMessage.success('查询成功')
}

const handlePageChange = (page) => {
  queryParams.value.page = page
  handleQuery()
}
</script>

<template>
  <div class="movie-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" class="form-inline">
        <el-form-item label="电影名">
          <el-input v-model="queryParams.name" placeholder="请输入电影名" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
            <el-option label="动作" value="action" />
            <el-option label="喜剧" value="comedy" />
            <el-option label="科幻" value="sci-fi" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="20">
      <el-col :span="6" v-for="movie in movieList" :key="movie.id">
        <el-card :body-style="{ padding: '0px' }" class="movie-card">
          <img :src="movie.poster" class="poster">
          <div class="movie-info">
            <h3>{{ movie.name }}</h3>
            <div class="meta">
              <el-rate v-model="movie.rating" disabled show-score text-color="#ff9900" />
              <span class="year">{{ movie.year }}</span>
            </div>
            <div class="description">{{ movie.description }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      class="pagination"
      :current-page="queryParams.page"
      :page-size="queryParams.pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.movie-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  
  .filter-container {
    margin-bottom: 20px;
  }
  
  .movie-card {
    margin-bottom: 20px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    
    .poster {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }
    
    .movie-info {
      padding: 14px;
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
      
      .meta {
        margin: 8px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .year {
          color: #909399;
          font-size: 14px;
        }
      }
      
      .description {
        color: #606266;
        font-size: 14px;
        line-height: 1.4;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
