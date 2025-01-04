<template>
  <div class="recipe-container">
    <div class="page-header">
      <div class="title-stats">
        <h2>菜谱管理</h2>
        <div class="stats">
          <el-tag type="info">总菜谱: {{ recipes.length }}</el-tag>
        </div>
      </div>
      <el-button type="primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon>新增菜谱
      </el-button>
    </div>

    <!-- 菜谱列表 -->
    <div class="recipes-list">
      <el-empty v-if="recipes.length === 0" description="暂无菜谱" />
      <el-card v-else v-for="recipe in recipes" :key="recipe._id" class="recipe-card">
        <div class="recipe-header">
          <div class="title-category">
            <h3>{{ recipe.name }}</h3>
            <el-tag>{{ recipe.category }}</el-tag>
          </div>
          <div class="actions">
            <el-button type="primary" link @click="openEditDialog(recipe)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" link @click="handleDelete(recipe._id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="recipe-content">
          <div class="info">
            <span>烹饪时间: {{ recipe.cookingTime }}分钟</span>
            <span>难度: {{ recipe.difficulty }}</span>
          </div>
          <div class="description">{{ recipe.description }}</div>
        </div>
      </el-card>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜品名称" />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="烹饪时间" prop="cookingTime">
          <el-input-number 
            v-model="form.cookingTime" 
            :min="1" 
            :max="180"
            placeholder="请输入烹饪时间（分钟）"
          />
        </el-form-item>
        
        <el-form-item label="难度" prop="difficulty">
          <el-rate 
            v-model="form.difficulty"
            :max="3"
            :texts="['简单', '中等', '困难']"
            show-text
          />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入菜品描述"
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
const recipes = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜谱')
const isEditing = ref(false)
const editingId = ref(null)
const formRef = ref(null)

// 分类选项
const categories = [
  { label: '家常菜', value: '家常菜' },
  { label: '凉菜', value: '凉菜' },
  { label: '热菜', value: '热菜' },
  { label: '汤羹', value: '汤羹' },
  { label: '主食', value: '主食' },
  { label: '小吃', value: '小吃' },
  { label: '烘焙', value: '烘焙' }
]

// 表单数据
const form = ref({
  name: '',
  category: '',
  cookingTime: 30,
  difficulty: 1,
  description: ''
})

// 表单规则
const rules = {
  name: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  cookingTime: [
    { required: true, message: '请输入烹饪时间', trigger: 'blur' }
  ],
  difficulty: [
    { required: true, message: '请选择难度', trigger: 'change' }
  ]
}

// 打开新增对话框
const openAddDialog = () => {
  dialogTitle.value = '新增菜谱'
  isEditing.value = false
  editingId.value = null
  form.value = {
    name: '',
    category: '',
    cookingTime: 30,
    difficulty: 1,
    description: ''
  }
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (recipe) => {
  dialogTitle.value = '编辑菜谱'
  isEditing.value = true
  editingId.value = recipe._id
  form.value = {
    name: recipe.name,
    category: recipe.category,
    cookingTime: recipe.cookingTime,
    difficulty: recipe.difficulty,
    description: recipe.description
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

// 删除菜谱
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个菜谱吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    console.log('删除菜谱:', id)
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
  // TODO: 加载菜谱数据
})
</script>

<style lang="scss" scoped>
.recipe-container {
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
  
  .recipes-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    
    .recipe-card {
      .recipe-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .title-category {
          h3 {
            margin: 0 0 8px 0;
          }
        }
      }
      
      .recipe-content {
        .info {
          display: flex;
          gap: 16px;
          color: #606266;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .description {
          color: #606266;
          font-size: 14px;
          line-height: 1.4;
        }
      }
    }
  }
}
</style>
