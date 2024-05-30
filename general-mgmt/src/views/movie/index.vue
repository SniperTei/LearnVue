<script setup>
import { ref, onMounted } from 'vue'
// movie api
import { getMovieListAPI, deleteMovieAPI } from '@/api/movies/moviesAPI'
import { ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination } from 'element-plus'
import { useRouter } from 'vue-router'
const tableData = ref([])
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const queryCondition = ref({
  title: '',
  genre: '',
  country: '',
  release_year: '',
  jyp_viewed: '',
  sniper_viewed: ''
})
const router = useRouter()
const getMovieList = async () => {
  console.log('getMovieList')
  // 获取电影列表
  const res = await getMovieListAPI({ page: pagination.value.currentPage, limit: pagination.value.pageSize, movie: queryCondition.value})
  console.log('get movie list res:', res)
  if (res.data.code === '000000') {
    tableData.value = res.data.data.list
    pagination.value.total = res.data.data.total
  }
}

const queryBtnClick = () => {
  console.log('queryBtnClick')
  pagination.value.currentPage = 1
  getMovieList()
}

const handleSizeChange = (val) => {
  console.log('handleSizeChange', val)
  pagination.value.pageSize = val
  getMovieList()
}

const handleCurrentChange = (val) => {
  console.log('handleCurrentChange', val)
  pagination.value.currentPage = val
  getMovieList()
}

const detailBtnClick = (movieId) => {
  console.log('detailBtnClick', movieId)
  router.push({ path: `/movielist/detail/${movieId}` })
}

const removeBtnClick = (movieId) => {
  console.log('removeBtnClick', movieId)
  // 删除电影
  deleteMovieAPI({ movieId: movieId }).then(res => {
    console.log('delete movie res:', res)
    getMovieList()
  })
}

onMounted(() => {
  getMovieList()
})
</script>

<template>
  <div class="movie">
    <!-- title -->
    <!-- <div class="title-container">
      <div>电影列表</div>
    </div> -->
    <!-- query condition -->
    <el-form :inline="true" :model="queryCondition" class="movie-query-condition">
      <el-form-item label="电影名称">
        <el-input v-model="queryCondition.title" placeholder="请输入电影名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="导演">
        <el-input v-model="queryCondition.director" placeholder="请输入导演"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="主演">
        <el-input v-model="queryCondition.actors" placeholder="请输入主演"></el-input>
      </el-form-item> -->
      <el-form-item label="类型">
        <el-input v-model="queryCondition.genre" placeholder="请输入类型"></el-input>
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="queryCondition.country" placeholder="请输入地区"></el-input>
      </el-form-item>
      <el-form-item label="上映日期">
        <el-input v-model="queryCondition.release_year" placeholder="请输入上映日期"></el-input>
      </el-form-item>
      <!-- jyp是否看过 -->
      <el-form-item label="jyp看过日期" style="width: 240px;">
        <el-select v-model="queryCondition.jyp_viewed">
          <el-option label="看过" value="1"></el-option>
          <el-option label="没看过" value="0"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="Sniper是否看过">
        <el-input v-model="queryCondition.sniper_viewed" placeholder="请输入Sniper是否看过"></el-input>
      </el-form-item> -->
      <!-- sniper是否看过 -->
      <el-form-item label="sniper看过日期" style="width: 240px;">
        <el-select v-model="queryCondition.sniper_viewed">
          <el-option label="看过" value="1"></el-option>
          <el-option label="没看过" value="0"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="JYP是否看过">
        <el-input v-model="queryCondition.jyp_viewed" placeholder="请输入JYP是否看过"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="queryBtnClick">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- Your template content here -->
    <el-table :data="tableData" style="width: 100%" class="table-data">
      <el-table-column prop="title" label="电影名称"></el-table-column>
      <!-- <el-table-column prop="director" label="导演"></el-table-column> -->
      <el-table-column prop="actors" label="主演"></el-table-column>
      <el-table-column prop="genre" label="类型"></el-table-column>
      <el-table-column prop="country" label="地区"></el-table-column>
      <el-table-column prop="release_date" label="上映日期"></el-table-column>
      <el-table-column prop="jyp_viewed" label="JYP是否看过">
        <template #default="{ row }">
          <el-tag v-if="row.jyp_viewed === 1" type="success">看过</el-tag>
          <el-tag v-else type="danger">没看过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sniper_viewed" label="Sniper是否看过">
        <template #default="{ row }">
          <el-tag v-if="row.sniper_viewed === 1" type="success">看过</el-tag>
          <el-tag v-else type="danger">没看过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="时长">
        <template #default="{ row }">
          {{ row.duration }} 分钟
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="detailBtnClick(row.movieId)">详情</el-button>
          <el-button type="text" @click="removeBtnClick(row.movieId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<style lang="scss">
.movie {
  /* Your SCSS styles here */
  width: 100%;
  height: 100%;
  // .title-container {
  //   font-size: 20px;
  //   text-align: left;
  //   padding: 20px;
  // }
  .movie-query-condition {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .table-data {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>