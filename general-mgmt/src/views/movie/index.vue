<script setup>
import { ref, onMounted } from 'vue'
// movie api
import { getMovieListAPI } from '@/api/movies/moviesAPI'
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
  director: '',
  actor: '',
  type: '',
  region: '',
  releaseDate: '',
})
// const router = useRouter()
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

onMounted(() => {
  getMovieList()
})
</script>

<template>
  <div class="movie">
    <!-- query condition -->
    <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
      <el-form-item label="电影名称">
        <el-input v-model="queryCondition.title" placeholder="请输入电影名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="导演">
        <el-input v-model="queryCondition.director" placeholder="请输入导演"></el-input>
      </el-form-item> -->
      <el-form-item label="主演">
        <el-input v-model="queryCondition.actors" placeholder="请输入主演"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="queryCondition.type" placeholder="请输入类型"></el-input>
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="queryCondition.genre" placeholder="请输入地区"></el-input>
      </el-form-item>
      <el-form-item label="上映日期">
        <el-input v-model="queryCondition.release_date" placeholder="请输入上映日期"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryBtnClick">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- Your template content here -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="电影名称"></el-table-column>
      <!-- <el-table-column prop="director" label="导演"></el-table-column> -->
      <el-table-column prop="actors" label="主演"></el-table-column>
      <el-table-column prop="genre" label="类型"></el-table-column>
      <el-table-column prop="country" label="地区"></el-table-column>
      <el-table-column prop="release_date" label="上映日期"></el-table-column>
      <el-table-column prop="duration" label="时长">
        <template #default="{ row }">
          {{ row.duration }} 分钟
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="editBtnClick(row.id)">编辑</el-button>
          <el-button type="text" @click="removeBtnClick(row.id)">删除</el-button>
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
}
</style>