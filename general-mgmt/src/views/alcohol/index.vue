<script setup>
import { ref, onMounted } from 'vue'
import { getAlcoholListAPI } from '@/api/alcohols/alcoholsAPI'

const tableData = ref([])
// 酒种类
const alcoholTypeList = [
  { label: '白酒', value: 'baijiu' },
  { label: '啤酒', value: 'beer' },
  { label: '红酒', value: 'wine' },
  { label: '洋酒', value: 'spirits' }
]

const getAlcohosList = async () => {
  const res = await getAlcoholListAPI({ page: pagination.value.currentPage, limit: pagination.value.pageSize, condition: queryCondition.value})
  console.log('get alcohol list res:', res)
  if (res.data.code === '000000') {
    tableData.value = res.data.data.list
    pagination.value.total = res.data.data.total
  }
}

const queryBtnClick = () => {
  // 查询按钮点击事件
  getAlcohosList()
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
  getAlcohosList()
}
const handleCurrentChange = (val) => {
  // pagination.value.currentPage = val
  pagination.value.currentPage = val
  getAlcohosList()
}
// 查询条件
const queryCondition = ref({
  alcohol_name: '',
  alcohol_type: '',
  publisher: ''
})

onMounted(() => {
  getAlcohosList()
})

</script>

<template>
  <div class="alcohol">
    <div class="alcohol-calendar">
      <!-- 查询条件 -->
      <el-form :inline="true" :model="queryCondition" class="demo-form-inline">
        <el-form-item label="酒精名称">
          <el-input v-model="queryCondition.alcohol_name" placeholder="请输入酒名"></el-input>
        </el-form-item>
        <el-form-item label="酒种类">
          <!-- <el-input v-model="queryCondition.alcohol_type" placeholder="请输入酒种类"></el-input> -->
          <el-select v-model="queryCondition.alcohol_type" clearable size="default" style="width: 200px;">
            <el-option
              v-for="item in alcoholTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryBtnClick">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 查询结果 -->
      <el-table
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
          prop="alcohol_name"
          label="酒名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="alcohol_type"
          label="酒种类"
          width="180">
          <!-- <template #default="{ row }">
            <span v-if="row.alcohol_type === 'baijiu'">白酒</span>
            <span v-else-if="row.alcohol_type === 'beer'">啤酒</span>
            <span v-else>红酒</span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="alcohol_subtype"
          label="子种类"
          width="180">
        </el-table-column>
        <el-table-column
          prop="nan_rating"
          label="楠的打分"
          width="180">
        </el-table-column>
        <el-table-column
          prop="nan_review"
          label="楠的评价"
          width="240">
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          width="180">
          <template #default="{ row }">
            <el-button type="primary" size="mini" @click="editBtnClick(row.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeBtnClick(row.id)">删除</el-button>
          </template>
        </el-table-column> -->
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
    <div class="alcohol-datalist"></div>
  </div>
</template>

<style lang="scss" scoped>

</style>