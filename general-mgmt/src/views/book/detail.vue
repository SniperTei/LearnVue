<script setup>
import { ref, onMounted, computed } from 'vue'
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

const editType = ref(constant.EDIT_TYPE.EDIT);

const getBookDetail = async () => {
  console.log('getBookDetail')
  let bookId = params.value.bookId
  console.log('bookId:', bookId)
  // 获取图书详情
  const res = await getBookDetailAPI({ bookId: bookId})
  console.log('get book detail res:', res)
  bookDetail.value = res.data.data
}

const editBtnClick = () => {
  console.log('editBtnClick')
  editType.value = constant.EDIT_TYPE.EDIT
}

const saveBtnClick = () => {
  console.log('saveBtnClick')
  editType.value = constant.EDIT_TYPE.READ_ONLY
}

// 使用 computed 定义计算属性
const isEditMode = computed(() => {
  return editType.value === constant.EDIT_TYPE.EDIT
});

onMounted(() => {
  // 获取图书详情
  getBookDetail()
})

</script>

<template>
  <div class="book-detail">
    <!-- 只读模式 -->
    <!-- 书封面 -->
    <!-- <el-card class="box-card book-img" v-if="editType === constant.EDIT_TYPE.READ_ONLY">
      <img src="https://img3.doubanio.com/view/subject/l/public/s3365739.jpg" class="image" />
    </el-card> -->
    <!-- 书详情 -->
    <!-- <el-card class="box-card book-info" v-if="editType === constant.EDIT_TYPE.READ_ONLY">
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
      <el-row class="book-info-property">
        <el-col :span="8">类型:</el-col>
        <el-col :span="16">{{ bookDetail.typeDesc }}</el-col>
      </el-row>
    </el-card> -->
    <!-- 编辑模式 -->
     <!-- 书封面 -->
    <el-card class="box-card book-img">
      <!-- 上传 -->
      <el-upload
        class="upload-demo"
        list-type="picture-card">
        <i class="el-icon-plus"></i>
        <!-- action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePictureCardPreview"
        :onRemove="handleRemove"
        :onSuccess="handleSuccess"
        :file-list="fileList" -->
      </el-upload>
    </el-card>
    <!-- 书详情 -->
    <el-card class="box-card book-info">
      <template v-slot:header>
        <div class="clearfix">
          <div class="book-info-header">
            <span>图书详情</span>
            <!-- 保存 -->
            <el-button type="primary" v-if="isEditMode" @click="saveBtnClick">保存</el-button>
            <!-- 编辑 -->
            <el-button type="primary" v-if="!isEditMode" @click="editBtnClick">编辑</el-button>
          </div>
        </div>
      </template>
      <el-form class="book-info-form">
        <el-form-item label="书名" class="book-info-form-item">
          <el-input v-model="bookDetail.title" placeholder="请输入书名" :disabled="!isEditMode"></el-input>
        </el-form-item>
        <el-form-item label="作者" class="book-info-form-item">
          <el-input v-model="bookDetail.author" placeholder="请输入作者" :disabled="!isEditMode"></el-input>
        </el-form-item>
        <el-form-item label="出版社" class="book-info-form-item">
          <el-input v-model="bookDetail.publisher" placeholder="请输入出版社" :disabled="!isEditMode"></el-input>
        </el-form-item>
        <el-form-item label="出版日期" class="book-info-form-item">
          <el-date-picker
            v-model="bookDetail.pubdate"
            type="date"
            placeholder="选择日期"
            :disabled="!isEditMode">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="价格" class="book-info-form-item">
          <el-input v-model="bookDetail.price" placeholder="请输入价格" :disabled="!isEditMode"></el-input>
        </el-form-item>
        <el-form-item label="类型" class="book-info-form-item">
          <el-select v-model="bookDetail.type" placeholder="请选择类型" :disabled="!isEditMode">
            <el-option
              v-for="item in constant.BOOK_TYPE"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: red;
  }
  .book-info {
    width: 100%;
    // height: 300px;
    margin: 20px;
    .book-info-header {
      display: flex;
      justify-content: space-between;
    }
  }
  .book-info-property {
    margin: 10px;
  }
  .book-info-form {
    margin: 10px;
    .book-info-form-item {
      width: 200px;
    }
  }
  // background-color: red;
}
</style>