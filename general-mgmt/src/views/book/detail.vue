<script setup>
import { ref, onMounted } from 'vue'
// booklistapi
import { getBookDetailAPI } from '@/api/books/booksAPI'
import { useRoute } from 'vue-router'

const route = useRoute()
// const bookId = ref($route.params.bookId)
// 获取url路径上拼接的bookId
const params = ref(route.params)
// console.log('detail params:', params)
const bookDetail = ref({})

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
    <el-form :model="bookDetail" label-width="80px">
      <el-form-item label="书名">
        <el-input v-model="bookDetail.title" disabled></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="bookDetail.author" disabled></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="bookDetail.publisher" disabled></el-input>
      </el-form-item>
      <el-form-item label="出版日期">
        <el-input v-model="bookDetail.pubdate" disabled></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="bookDetail.price" disabled></el-input>
      </el-form-item>
      <!-- <el-form-item label="库存">
        <el-input v-model="bookDetail.stock" disabled></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="简介">
        <el-input v-model="bookDetail.introduction" type="textarea" disabled></el-input>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<style lang="scss">
.book-detail {
  /* Your SCSS styles here */
  width: 100%;
  // background-color: red;
}
</style>