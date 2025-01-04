<template>
  <div class="game-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" class="form-inline">
        <el-form-item label="游戏名">
          <el-input v-model="queryParams.name" placeholder="请输入游戏名" clearable />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="queryParams.platform" placeholder="请选择平台" clearable>
            <el-option label="PC" value="pc" />
            <el-option label="PS5" value="ps5" />
            <el-option label="Xbox" value="xbox" />
            <el-option label="Switch" value="switch" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="gameList" border style="width: 100%">
      <el-table-column prop="name" label="游戏名" />
      <el-table-column prop="platform" label="平台" width="120">
        <template #default="{ row }">
          <el-tag :type="getPlatformTagType(row.platform)">
            {{ row.platform }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="genre" label="类型" />
      <el-table-column prop="releaseDate" label="发售日期" width="120" />
      <el-table-column prop="price" label="价格" width="120">
        <template #default="{ row }">
          ¥{{ row.price }}
        </template>
      </el-table-column>
      <el-table-column label="评分" width="180">
        <template #default="{ row }">
          <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
        </template>
      </el-table-column>
    </el-table>

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

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const queryParams = ref({
  name: '',
  platform: '',
  page: 1,
  pageSize: 10
})

const gameList = ref([
  {
    name: '塞尔达传说：王国之泪',
    platform: 'Switch',
    genre: '动作冒险',
    releaseDate: '2023-05-12',
    price: 398,
    rating: 4.9
  },
  {
    name: '最终幻想16',
    platform: 'PS5',
    genre: '角色扮演',
    releaseDate: '2023-06-22',
    price: 498,
    rating: 4.7
  }
])
const total = ref(2)

const getPlatformTagType = (platform) => {
  const types = {
    'PC': '',
    'PS5': 'success',
    'Xbox': 'warning',
    'Switch': 'danger'
  }
  return types[platform] || 'info'
}

const handleQuery = () => {
  // TODO: 调用查询接口
  ElMessage.success('查询成功')
}

const handlePageChange = (page) => {
  queryParams.value.page = page
  handleQuery()
}
</script>

<style lang="scss" scoped>
.game-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  
  .filter-container {
    margin-bottom: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
