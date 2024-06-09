<script setup>
import { ref, onMounted, computed } from 'vue'
import { getDrinkListAPI } from '@/api/drinks/drinksAPI'
import { getAlcoholListAPI } from '@/api/alcohols/alcoholsAPI';
import { ElCalendar } from 'element-plus'

const drinkList = ref([])
const getDrinkList = async () => {
  const res = await getDrinkListAPI({ page: pagination.value.currentPage, limit: pagination.value.pageSize, condition: queryCondition.value})
  if (res.data.code === '000000') {
    drinkList.value = res.data.data.list
  }
}
const alcoholList = ref([])
const getAlcohosList = async () => {
const res = await getAlcoholListAPI({page: 1, limit: 20, condition: {}})
  if (res.data.code === '000000') {
    alcoholList.value = res.data.data.list
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
// const drinkDialogVisible = ref(false)
const drinkForm = ref({
  drinker_username: '',
  alcohol_name: '',
  drink_amount: '',
  drink_unit: '',
  visible: false
})

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
  getAlcohosList()
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

// 点击日期事件
const dateClick0 = (data) => {
  console.log('dateClick:', data)
  // 弹窗
  drinkForm.value.visible = true
}

const handleClose = (() =>  {
  console.log('handleClose')
  // dialogVisible.value = false
  drinkForm.value.visible = false
})

</script>

<template>
  <div class="alcohol">
    <!-- <el-button @click="testBtnClick">test</el-button> -->
    <div>
      <el-calendar class="alcohol-canendar">
        <template #date-cell="{ data }">
          <div @click="dateClick0(data)">
            <div>{{ data.day.split('-').slice(1).join('-') }}</div>
              <div v-for="(value, key) in drinkDict[data.day]" :key="key" class="drink-date-item">
                <el-tooltip :content="drinkDict[data.day][key].join(', ')">
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
  <el-dialog title="喝酒事件" v-model="drinkForm.visible" width="400px" :before-close="handleClose">
    <!-- 喝酒人，喝的酒名， 喝的数量，喝的单位 -->
    <el-form>
      <el-form-item label="喝酒人">
        <el-select v-model="drinkForm.drinker_username">
          <el-option label="郑楠" value="teinan"></el-option>
          <el-option label="朴金燕" value="jinyan"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="酒名">
        <el-input v-model="drinkForm.alcohol_name"></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="drinkForm.drink_amount"></el-input>
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="drinkForm.drink_unit"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- el-dialog弹窗 -->
  <!-- <el-dialog
      title="添加饮品"
      v-model:visible="visibleFlag"
      width="30%"
      :before-close="handleClose">
      <el-form :model="drinkForm" label-width="80px">
        <el-form-item label="饮酒人">
          <el-input v-model="drinkForm.drinker_username" placeholder="请输入饮酒人"></el-input>
        </el-form-item>
        <el-form-item label="饮品名称">
          <el-input v-model="drinkForm.alcohol_name" placeholder="请输入饮品名称"></el-input>
        </el-form-item>
        <el-form-item label="饮品量">
          <el-input v-model="drinkForm.drink_amount" placeholder="请输入饮品量"></el-input>
        </el-form-item>
        <el-form-item label="饮品单位">
          <el-input v-model="drinkForm.drink_unit" placeholder="请输入饮品单位"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="drinkForm.visible = false">取 消</el-button>
          <el-button type="primary" @click="addDrink">确 定</el-button>
        </div>
      </template>
    </el-dialog> -->
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