<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const queryParams = ref({
  destination: '',
  season: '',
  page: 1,
  pageSize: 6
})

const travelSpots = ref([
  {
    id: 1,
    name: '日本富士山',
    images: [
      'https://via.placeholder.com/400x200',
      'https://via.placeholder.com/400x200'
    ],
    season: '春季',
    type: '自然风光',
    description: '富士山是日本的象征，也是日本的最高峰。春季樱花盛开，景色尤为壮美...',
    price: 5999
  },
  {
    id: 2,
    name: '马尔代夫',
    images: [
      'https://via.placeholder.com/400x200',
      'https://via.placeholder.com/400x200'
    ],
    season: '冬季',
    type: '海岛度假',
    description: '马尔代夫是世界著名的度假胜地，拥有洁白的沙滩、清澈的海水和丰富的海洋生态...',
    price: 12999
  }
])
const total = ref(2)

const handleQuery = () => {
  // TODO: 调用查询接口
  ElMessage.success('查询成功')
}

const handleViewDetail = (spot) => {
  ElMessage.info('查看详情功能开发中...')
}

const handlePageChange = (page) => {
  queryParams.value.page = page
  handleQuery()
}
</script>

<template>
  <div class="travel-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" class="form-inline">
        <el-form-item label="目的地">
          <el-input v-model="queryParams.destination" placeholder="请输入目的地" clearable />
        </el-form-item>
        <el-form-item label="季节">
          <el-select v-model="queryParams.season" placeholder="请选择季节" clearable>
            <el-option label="春季" value="spring" />
            <el-option label="夏季" value="summer" />
            <el-option label="秋季" value="autumn" />
            <el-option label="冬季" value="winter" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="20">
      <el-col :span="8" v-for="spot in travelSpots" :key="spot.id">
        <el-card :body-style="{ padding: '0px' }" class="spot-card">
          <el-carousel height="200px" indicator-position="outside">
            <el-carousel-item v-for="(image, index) in spot.images" :key="index">
              <img :src="image" class="image">
            </el-carousel-item>
          </el-carousel>
          <div class="spot-info">
            <h3>{{ spot.name }}</h3>
            <div class="meta">
              <el-tag size="small">{{ spot.season }}</el-tag>
              <el-tag size="small" type="success">{{ spot.type }}</el-tag>
            </div>
            <div class="description">{{ spot.description }}</div>
            <div class="footer">
              <span class="price">¥{{ spot.price }} 起</span>
              <el-button type="primary" link @click="handleViewDetail(spot)">查看详情</el-button>
            </div>
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
.travel-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  
  .filter-container {
    margin-bottom: 20px;
  }
  
  .spot-card {
    margin-bottom: 20px;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
    
    .image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .spot-info {
      padding: 14px;
      
      h3 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
      
      .meta {
        margin: 8px 0;
        
        .el-tag + .el-tag {
          margin-left: 8px;
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
        margin-bottom: 8px;
      }
      
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .price {
          color: #f56c6c;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
