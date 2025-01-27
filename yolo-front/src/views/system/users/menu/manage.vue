<template>
  <div class="menu-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单权限管理</span>
          <el-button type="primary" @click="handleAddMenu">新建菜单</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="code"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="title" label="菜单名称" min-width="180" />
        <el-table-column prop="code" label="菜单编码" min-width="180" />
        <el-table-column prop="path" label="路径" min-width="180" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEditMenu(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDeleteMenu(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 菜单表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新建菜单' : '编辑菜单'"
      width="500px"
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
            :disabled="dialogType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentCode">
          <el-select
            v-model="formData.parentCode"
            placeholder="请选择父级菜单"
            clearable
          >
            <el-option
              v-for="menu in flatMenuList"
              :key="menu.code"
              :label="menu.title"
              :value="menu.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="1000" />
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuTree
} from '@/api/menuAPI'

// 数据
const loading = ref(false)
const menuList = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const formData = ref({
  title: '',
  code: '',
  path: '',
  icon: '',
  parentCode: null,
  sort: 0
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
  ]
}

// 计算属性：扁平化的菜单列表（用于父级菜单选择）
const flatMenuList = computed(() => {
  const flatten = (items) => {
    return items.reduce((acc, item) => {
      acc.push(item)
      if (item.children && item.children.length > 0) {
        acc.push(...flatten(item.children))
      }
      return acc
    }, [])
  }
  return flatten(menuList.value)
})

// 获取菜单树
const fetchMenuTree = async () => {
  loading.value = true
  try {
    const res = await getMenuTree()
    if (res.code === '000000' && res.data) {
      menuList.value = res.data
    } else {
      ElMessage.error(res.msg || '获取菜单列表失败')
    }
  } catch (error) {
    console.error('Error fetching menu tree:', error)
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

// 新建菜单
const handleAddMenu = () => {
  dialogType.value = 'add'
  formData.value = {
    title: '',
    code: '',
    path: '',
    icon: '',
    parentCode: null,
    sort: 0
  }
  dialogVisible.value = true
}

// 编辑菜单
const handleEditMenu = (row) => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除菜单
const handleDeleteMenu = (row) => {
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
        fetchMenuTree()
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
    const api = dialogType.value === 'add' ? createMenu : updateMenu
    const res = await api(
      dialogType.value === 'edit' ? formData.value.code : undefined,
      formData.value
    )
    
    if (res.code === '000000') {
      ElMessage.success(dialogType.value === 'add' ? '创建成功' : '更新成功')
      dialogVisible.value = false
      fetchMenuTree()
    } else {
      ElMessage.error(res.msg || (dialogType.value === 'add' ? '创建失败' : '更新失败'))
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    ElMessage.error(dialogType.value === 'add' ? '创建失败' : '更新失败')
  }
}

// 初始化
onMounted(() => {
  fetchMenuTree()
})
</script>

<style scoped>
.menu-management {
  padding: 20px;
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
</style>
