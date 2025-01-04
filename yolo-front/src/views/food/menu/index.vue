<template>
  <div class="menu-container">
    <div class="page-header">
      <div class="title-stats">
        <h2>菜单管理</h2>
        <div class="stats">
          <el-tag type="info">总菜单: {{ menus.length }}</el-tag>
        </div>
      </div>
      <el-button type="primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon>新增菜单
      </el-button>
    </div>

    <!-- 菜单列表 -->
    <div class="menus-list">
      <el-empty v-if="menus.length === 0" description="暂无菜单" />
      <el-card v-else v-for="menu in menus" :key="menu._id" class="menu-card">
        <div class="menu-header">
          <div class="title-date">
            <h3>{{ menu.name }}</h3>
            <span class="date">{{ new Date(menu.date).toLocaleDateString() }}</span>
          </div>
          <div class="actions">
            <el-button type="primary" link @click="openEditDialog(menu)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" link @click="handleDelete(menu._id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="menu-content">
          <div class="dishes">
            <div v-for="(dishes, meal) in menu.dishes" :key="meal" class="meal-group">
              <h4>{{ meal }}</h4>
              <el-tag 
                v-for="dish in dishes" 
                :key="dish"
                class="dish-tag"
              >
                {{ dish }}
              </el-tag>
            </div>
          </div>
          <div v-if="menu.notes" class="notes">
            备注：{{ menu.notes }}
          </div>
        </div>
      </el-card>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="早餐" prop="breakfast">
          <el-select
            v-model="form.dishes.breakfast"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入或选择早餐菜品"
            style="width: 100%"
          >
            <el-option
              v-for="dish in commonBreakfast"
              :key="dish"
              :label="dish"
              :value="dish"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="午餐" prop="lunch">
          <el-select
            v-model="form.dishes.lunch"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入或选择午餐菜品"
            style="width: 100%"
          >
            <el-option
              v-for="dish in commonLunch"
              :key="dish"
              :label="dish"
              :value="dish"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="晚餐" prop="dinner">
          <el-select
            v-model="form.dishes.dinner"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请输入或选择晚餐菜品"
            style="width: 100%"
          >
            <el-option
              v-for="dish in commonDinner"
              :key="dish"
              :label="dish"
              :value="dish"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ isEditing ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'

// 数据
const menus = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)

// 常见菜品
const commonBreakfast = [
  '包子', '馒头', '油条', '豆浆', '牛奶', '鸡蛋', '面包',
  '粥', '煎饼', '三明治'
]

const commonLunch = [
  '米饭', '炒青菜', '红烧肉', '鱼香肉丝', '宫保鸡丁',
  '番茄炒蛋', '青椒肉丝', '麻婆豆腐', '水煮肉片'
]

const commonDinner = [
  '米饭', '炒青菜', '清炒虾仁', '糖醋排骨', '红烧鱼',
  '蒜蓉生菜', '土豆烧牛肉', '白灼菜心', '炒面'
]

// 表单数据
const form = ref({
  name: '',
  date: new Date(),
  dishes: {
    breakfast: [],
    lunch: [],
    dinner: []
  },
  notes: ''
})

// 表单规则
const rules = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择日期', trigger: 'change' }
  ]
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增菜单'
  isEditing.value = false
  editingId.value = null
  form.value = {
    name: '',
    date: new Date(),
    dishes: {
      breakfast: [],
      lunch: [],
      dinner: []
    },
    notes: ''
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (menu) => {
  dialogTitle.value = '编辑菜单'
  isEditing.value = true
  editingId.value = menu._id
  form.value = {
    name: menu.name,
    date: new Date(menu.date),
    dishes: { ...menu.dishes },
    notes: menu.notes
  }
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    console.log('提交的数据:', form.value)
    // TODO: 调用API
    ElMessage.success(isEditing.value ? '修改成功' : '添加成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 删除菜单
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个菜单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    console.log('删除菜单:', id)
    // TODO: 调用API
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

onMounted(() => {
  // TODO: 加载菜单数据
})
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .title-stats {
      display: flex;
      align-items: center;
      gap: 20px;
      
      h2 {
        margin: 0;
      }
      
      .stats {
        display: flex;
        gap: 10px;
      }
    }
  }
  
  .menus-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    
    .menu-card {
      .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .title-date {
          h3 {
            margin: 0 0 8px 0;
          }
          
          .date {
            color: #606266;
            font-size: 14px;
          }
        }
      }
      
      .menu-content {
        .dishes {
          .meal-group {
            margin-bottom: 12px;
            
            h4 {
              margin: 0 0 8px 0;
              color: #606266;
            }
            
            .dish-tag {
              margin-right: 8px;
              margin-bottom: 8px;
            }
          }
        }
        
        .notes {
          margin-top: 12px;
          color: #606266;
          font-size: 14px;
          line-height: 1.4;
        }
      }
    }
  }
}
</style>
