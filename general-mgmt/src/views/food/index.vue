<script setup>
import { ref, onMounted } from 'vue'
// foodlistapi
import { getFoodListAPI } from '@/api/food/foodAPI'
import { ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination } from 'element-plus'
import { useRouter } from 'vue-router'
const tableData = ref([])
const router = useRouter()
const getFoodList = async () => {
  console.log('getFoodList')
  // 获取图书列表
  const res = await getFoodListAPI({ page: pagination.value.currentPage, limit: pagination.value.pageSize, condition: queryCondition.value})
  console.log('get food list res:', res)
  if (res.data.code === '000000') {
    tableData.value = res.data.data.list
    pagination.value.total = res.data.data.total
  }
}
onMounted(() => {
  getFoodList()
})
const queryBtnClick = () => {
  // 查询按钮点击事件
  getFoodList()
}
// 分页
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const handleSizeChange = (val) => {
  // pagination.value.pageSize = val
  pagination.value.pageSize = val
  getFoodList()
}
const handleCurrentChange = (val) => {
  // pagination.value.currentPage = val
  pagination.value.currentPage = val
  getFoodList()
}
// 查询条件
const queryCondition = ref({
  title: '',
  author: '',
  publisher: ''
})

const editBtnClick = (foodId) => {
  console.log('editBtnClick:', foodId)
  // 跳转到编辑页面
  // router.push({ path: '/foodlist/detail/' + foodId })
}

const removeBtnClick = (foodId) => {
  console.log('removeBtnClick:', foodId)
  // 删除图书
  // const res = await removefoodAPI({ foodId: foodId})
  // console.log('remove food res:', res)
  // if (res.data.code === '000000') {
  //   ElMessage.success('删除成功')
  //   getfoodList()
  // }
}

</script>

<template>
  <div class="food">
    <!-- Your template content here -->
    <!-- page title -->
    <!-- <h4>图书列表</h4> -->
    <!-- 查询条件 -->
    <el-form :inline="true" class="food-query-condition">
      <el-form-item label="菜名">
        <el-input v-model="queryCondition.name" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="queryCondition.category" placeholder="请输入作者" clearable></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="queryCondition.publisher" placeholder="请输入出版社" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryBtnClick">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 图书列表 -->
    <el-table
      stripe
      class="table-data"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="90">
        <!-- index -->
        <template v-slot="scope">
          <span>{{ (pagination.currentPage - 1) * 10 + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="category"
        label="分类">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格">
      </el-table-column>
      <!-- <el-table-column
        prop="recipe"
        label="菜谱">
      </el-table-column> -->
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="180">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="editBtnClick(scope.row.foodId)">编辑</el-button>
          <el-button type="text" size="small" @click="removeBtnClick(scope.row.foodId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>
</template>

<style lang="scss">
.food {
  /* Your SCSS styles here */
  width: 100%;
  .food-query-condition {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .table-data {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>