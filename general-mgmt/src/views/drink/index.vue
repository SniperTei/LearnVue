<script setup>
import { ref, onMounted } from 'vue'
import { getDrinkListAPI } from '@/api/drinks/drinksAPI'
import { ElCalendar } from 'element-plus'

const drinkList = ref([])
const getDrinkList = async () => {
  const res = await getDrinkListAPI({ page: pagination.value.currentPage, limit: pagination.value.pageSize, condition: queryCondition.value})
  if (res.data.code === '000000') {
    drinkList.value = res.data.data.list
  }
}
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 本月1日
const firstDay = new Date(new Date().setDate(1))
// 本月最后一日
const lastDay = new Date(new Date(firstDay).setMonth(firstDay.getMonth() + 1) - 1)

// const handleSizeChange = (val) => {
//   // pagination.value.pageSize = val
//   pagination.value.pageSize = val
//   getBookList()
// }
// const handleCurrentChange = (val) => {
//   // pagination.value.currentPage = val
//   pagination.value.currentPage = val
//   getBookList()
// }
// 查询条件
const queryCondition = ref({
  startDate: firstDay,
  endDate: lastDay,
})

onMounted(() => {
  getDrinkList()
})
</script>

<template>
  <div class="alcohol">
    <div class="alcohol-calendar">
      <el-calendar>
        <template #date-cell="{ data }">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
            {{ data.isSelected ? '✔️' : '' }}
          </p>
        </template>
      </el-calendar>
    </div>
    <div class="alcohol-datalist"></div>
  </div>
</template>

<style lang="scss" scoped>

</style>