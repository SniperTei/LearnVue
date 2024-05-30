<script setup>
import { ref, onMounted } from 'vue'
// booklistapi
import { getBookListAPI } from '@/api/books/booksAPI'
import { ElTable, ElTableColumn, ElForm, ElFormItem, ElInput, ElButton, ElPagination } from 'element-plus'
import { useRouter } from 'vue-router'
// userStore
// import { useUserStore } from '@/stores/userStore'
// const userStore = useUserStore()
const tableData = ref([])
const router = useRouter()
const getBookList = async () => {
  console.log('getBookList')
  // 获取图书列表
  const res = await getBookListAPI({ page: pagination.value.currentPage, limit: pagination.value.pageSize, book: queryCondition.value})
  console.log('get book list res:', res)
  if (res.data.code === '000000') {
    tableData.value = res.data.data.list
    pagination.value.total = res.data.data.total
  }
}
onMounted(() => {
  getBookList()
})
const queryBtnClick = () => {
  // 查询按钮点击事件
  getBookList()
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
  getBookList()
}
const handleCurrentChange = (val) => {
  // pagination.value.currentPage = val
  pagination.value.currentPage = val
  getBookList()
}
// 查询条件
const queryCondition = ref({
  title: '',
  author: '',
  publisher: ''
})

const editBtnClick = (bookId) => {
  console.log('editBtnClick:', bookId)
  // 跳转到编辑页面
  router.push({ path: '/booklist/detail/' + bookId })
}

const removeBtnClick = (bookId) => {
  console.log('removeBtnClick:', bookId)
  // 删除图书
  // const res = await removeBookAPI({ bookId: bookId})
  // console.log('remove book res:', res)
  // if (res.data.code === '000000') {
  //   ElMessage.success('删除成功')
  //   getBookList()
  // }
}

</script>

<template>
  <div class="book">
    <!-- Your template content here -->
    <!-- page title -->
    <!-- <h4>图书列表</h4> -->
    <!-- 查询条件 -->
    <el-form :inline="true" class="book-query-condition">
      <el-form-item label="书名">
        <el-input v-model="queryCondition.title" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="queryCondition.author" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="queryCondition.publisher" placeholder="请输入出版社"></el-input>
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
        width="180">
        <!-- index -->
        <template v-slot="scope">
          <span>{{ (pagination.currentPage - 1) * 10 + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="书名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者">
      </el-table-column>
      <el-table-column
        prop="publisher"
        label="出版社">
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="出版时间">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="180">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="editBtnClick(scope.row.bookId)">编辑</el-button>
          <el-button type="text" size="small" @click="removeBtnClick(scope.row.bookId)">删除</el-button>
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
.book {
  /* Your SCSS styles here */
  width: 100%;
  .book-query-condition {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .table-data {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>