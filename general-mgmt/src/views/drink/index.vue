<script setup>
import { ref, onMounted, computed } from 'vue'
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

// 计算属性
const drinkDict = computed(() => {
  // 3层字典， key是日期， value是字典， key是人， value是饮品列表
  const dict = {}
  drinkList.value.forEach(item => {
    if (!dict[item.drink_date]) {
      dict[item.drink_date] = {}
    }
    if (!dict[item.drink_date][item.drinker_username]) {
      dict[item.drink_date][item.drinker_username] = []
    }
    let value = item.drink_location + ' ' + item.alcohol_name + ' ' + item.drink_amount + item.drink_unit
    dict[item.drink_date][item.drinker_username].push(value)
  })
  return dict
})


</script>

<template>
  <div class="alcohol">
    <div>
      <el-calendar class="alcohol-canendar">
        <template #date-cell="{ data }">
          <div>
            <div>{{ data.day.split('-').slice(1).join('-') }}</div>
              <div v-for="(value, key) in drinkDict[data.day]" :key="key" class="drink-date-item">
                <el-tooltip :content="drinkDict[data.day][key]">
                  <el-tag>{{ key }}</el-tag>
                </el-tooltip>
              </div>
          </div>
          <!-- <div>
            <div>{{ data.day.split('-').slice(1).join('-') }}</div>
            <div v-for="(drinkItem, index) in drinkList" :key="index" class="drink-date-item">
              <el-tag v-if="drinkItem.drink_date===data.day">{{ drinkItem.drinker_username }}</el-tag>
            </div>
          </div> -->
        </template>
      </el-calendar>
    </div>
    <div class="alcohol-datalist">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.alcohol {
  display: flex;
  .alcohol-calendar {
    width: 100%;
    margin-right: 10px;
    .drink-date-item {
      display: flex;
      flex-direction: row;
      // margin-top: 5px;
    }
    .is-selected {
      background-color: #f0f0f0;
    }
  }
}
</style>