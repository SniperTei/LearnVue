<template>
  <div class="menu-management">
    <el-card class="menu-card">
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd">新增菜单</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="menuList"
        border
        style="width: 100%"
      >
        <el-table-column prop="title" label="菜单名称" min-width="120" />
        <el-table-column prop="code" label="菜单编码" min-width="150" />
        <el-table-column prop="path" label="路径" min-width="150" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="{ row }">
            <i :class="row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column prop="isFolder" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isFolder ? 'primary' : 'success'">
              {{ row.isFolder ? '目录' : '菜单' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 菜单表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formType === 'add' ? '新增菜单' : '编辑菜单'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formData.title" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单编码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入菜单编码"
            :disabled="formType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标类名">
            <template #append>
              <i :class="formData.icon || 'fa-solid fa-icons'"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="类型" prop="isFolder">
          <el-radio-group v-model="formData.isFolder">
            <el-radio :label="true">目录</el-radio>
            <el-radio :label="false">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="1" :max="99" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenuTree, createMenu, updateMenu, deleteMenu } from '@/api/menuAPI'

// 数据
const loading = ref(false)
const menuList = ref([])
const dialogVisible = ref(false)
const formType = ref('add')
const formRef = ref(null)
const formData = ref({
  title: '',
  code: '',
  path: '',
  icon: '',
  isFolder: false,
  sort: 1
})

// 表单校验规则
const formRules = {
  title: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入菜单编码', trigger: 'blur' },
    { pattern: /^[a-z][a-z0-9_]*$/, message: '只能包含小写字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路径', trigger: 'blur' },
    { pattern: /^\//, message: '路径必须以/开头', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: '请输入图标', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' }
  ]
}

// 获取菜单列表
const fetchMenuList = async () => {
  loading.value = true
  try {
    const res = await getMenuTree()
    if (res.code === '000000') {
      menuList.value = res.data
    }
  } catch (error) {
    console.error('Error fetching menus:', error)
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 新增菜单
const handleAdd = () => {
  formType.value = 'add'
  formData.value = {
    title: '',
    code: '',
    path: '',
    icon: '',
    isFolder: false,
    sort: 1
  }
  dialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row) => {
  formType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除菜单
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该菜单吗？删除后不可恢复！',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await deleteMenu(row.code)
      if (res.code === '000000') {
        ElMessage.success('删除成功')
        fetchMenuList()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      console.error('Error deleting menu:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const api = formType.value === 'add' ? createMenu : updateMenu
    const res = formType.value === 'add' 
      ? await api(formData.value)
      : await api(formData.value.code, formData.value)
    
    if (res.code === '000000') {
      ElMessage.success(formType.value === 'add' ? '创建成功' : '更新成功')
      dialogVisible.value = false
      fetchMenuList()
    } else {
      ElMessage.error(res.msg || (formType.value === 'add' ? '创建失败' : '更新失败'))
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    ElMessage.error(formType.value === 'add' ? '创建失败' : '更新失败')
  }
}

// 初始化
onMounted(() => {
  fetchMenuList()
})
</script>

<style scoped>
.menu-management {
  padding: 20px;
}

.menu-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-card__header) {
  padding: 10px 20px;
}

:deep(.el-table [class*=fa-]) {
  margin-right: 5px;
  font-size: 16px;
}

:deep(.el-input-group__append [class*=fa-]) {
  margin: 0 5px;
  font-size: 16px;
}
</style>