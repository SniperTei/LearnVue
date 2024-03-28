<script setup>
import { ref } from 'vue'
// import { useUserStore } from '@/stores/userStore'
// const userStore = useUserStore()
const tableData = ref([
  {
    id: '1',
    date: '2016-05-02',
    name: '王小虎',
    author: '张三',
    publisher: '清华大学出版社'
  },
  {
    id: '2',
    date: '2016-05-04',
    name: '王小虎',
    author: '李四',
    publisher: '北京大学出版社'
  },
  {
    id: '3',
    date: '2016-05-01',
    name: '王小虎',
    author: '王五',
    publisher: '上海交通大学出版社'
  },
  {
    id: '4',
    date: '2016-05-03',
    name: '王小虎',
    author: '赵六',
    publisher: '浙江大学出版社'
  },
  {
    id: '5',
    date: '2016-05-03',
    name: '王小龙',
    author: '赵六',
    publisher: '浙江大学出版社'
  },
  
])
</script>

<template>
  <div class="book">
    <!-- Your template content here -->
    Book Page
    <!-- 图书列表 -->
    <el-table
      stripe
      class="table"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
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
        prop="date"
        label="出版时间">
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss">
.book {
  /* Your SCSS styles here */
  width: 100%;
  // background-color: red;
}
</style>