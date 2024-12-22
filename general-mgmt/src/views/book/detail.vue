<script setup>
import { ref, onMounted } from 'vue'
// booklistapi
import { getBookDetailAPI } from '@/api/books/booksAPI'
import { useRoute } from 'vue-router'
// 常量
import constant from '@/config/constant'

const route = useRoute()
// const bookId = ref($route.params.bookId)
// 获取url路径上拼接的bookId
const params = ref(route.params)
// console.log('detail params:', params)
const bookDetail = ref({})

const editType = ref(constant.editType.READ_ONLY);

const getBookDetail = async () => {
  console.log('getBookDetail')
  let bookId = params.value.bookId
  console.log('bookId:', bookId)
  // 获取图书详情
  const res = await getBookDetailAPI({ bookId: bookId})
  console.log('get book detail res:', res)
  bookDetail.value = res.data.data
}

onMounted(() => {
  // 获取图书详情
  getBookDetail()
})
</script>

<template>
  <div class="book-detail">
    <!-- Your template content here -->
    <!-- 书封面 -->
    <el-card class="box-card book-img">
      <img src="https://img3.doubanio.com/view/subject/l/public/s3365739.jpg" class="image" />
    </el-card>
    <!-- 书详情 -->
    <el-card class="box-card book-info">
      <template v-slot:header>
        <div  class="clearfix">
          <span>图书详情</span>
        </div>
      </template>
      <el-row class="book-info-property">
        <el-col :span="8">书名：</el-col>
        <el-col :span="16">{{ bookDetail.title }}</el-col>
      </el-row>
      <el-row class="book-info-property">
        <el-col :span="8">作者：</el-col>
        <el-col :span="16">{{ bookDetail.author }}</el-col>
      </el-row>
      <el-row class="book-info-property">
        <el-col :span="8">出版社：</el-col>
        <el-col :span="16">{{ bookDetail.publisher }}</el-col>
      </el-row>
      <el-row class="book-info-property">
        <el-col :span="8">出版日期：</el-col>
        <el-col :span="16">{{ bookDetail.pubdate }}</el-col>
      </el-row>
      <el-row class="book-info-property">
        <el-col :span="8">价格:</el-col>
        <el-col :span="16">{{ bookDetail.price }}元</el-col>
      </el-row>
      <!-- 类型 -->
      <el-row class="book-info-property">
        <el-col :span="8">类型:</el-col>
        <el-col :span="16">{{ bookDetail.typeDesc }}</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.book-detail {
  /* Your SCSS styles here */
  width: 100%;
  height: 100%;
  display: flex;
  .book-img {
    width: 300px;
    height: 300px;
    margin: 20px;
    // background-color: red;
  }
  .book-info {
    width: 100%;
    height: 300px;
    margin: 20px;
    // background-color: blue;
  }
  .book-info-property {
    margin: 10px;
  }
  // background-color: red;
}
</style>