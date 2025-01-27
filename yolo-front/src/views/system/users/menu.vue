<template>
  <div class="user-menu-management">
    <el-card class="menu-card">
      <template #header>
        <div class="card-header">
          <span>用户菜单权限管理 - {{ currentUser?.username }}</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleSave" :loading="saving">
              保存权限
            </el-button>
          </div>
        </div>
      </template>

      <div v-loading="loading" class="menu-tree">
        <el-tree
          ref="treeRef"
          :data="menuTree"
          show-checkbox
          node-key="code"
          :props="{ label: 'title', children: 'children' }"
          @check="handleCheck"
        >
          <template #default="{ node, data }">
            <span class="menu-node">
              <i v-if="data.icon" :class="data.icon"></i>
              <span>{{ node.label }}</span>
              <el-tag 
                size="small" 
                :type="data.isFolder ? 'primary' : 'success'"
                class="menu-type"
              >
                {{ data.isFolder ? '目录' : '菜单' }}
              </el-tag>
            </span>
          </template>
        </el-tree>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getUserMenus, updateUserMenus } from '@/api/userAPI'
import { getAllMenus } from '@/api/menuAPI'

const route = useRoute()
const userId = route.query.userId

const loading = ref(false)
const saving = ref(false)
const currentUser = ref(null)
const menuTree = ref([])
const treeRef = ref(null)
const checkedMenus = ref([])

// 构建菜单树
const buildMenuTree = (menus) => {
  const menuMap = new Map()
  const tree = []

  // 先创建所有节点的映射
  menus.forEach(menu => {
    menuMap.set(menu.code, { ...menu, children: [] })
  })

  // 构建树结构
  menus.forEach(menu => {
    const node = menuMap.get(menu.code)
    if (menu.parentCode) {
      const parent = menuMap.get(menu.parentCode)
      if (parent) {
        parent.children.push(node)
      }
    } else {
      tree.push(node)
    }
  })

  // 按sort排序
  const sortNodes = (nodes) => {
    nodes.sort((a, b) => a.sort - b.sort)
    nodes.forEach(node => {
      if (node.children?.length) {
        sortNodes(node.children)
      }
    })
  }
  sortNodes(tree)

  return tree
}

// 获取所有菜单和用户当前权限
const fetchData = async () => {
  loading.value = true
  try {
    const [menusRes, userMenusRes] = await Promise.all([
      getAllMenus(),
      getUserMenus(userId)
    ])

    if (menusRes.code === '000000' && userMenusRes.code === '000000') {
      menuTree.value = buildMenuTree(menusRes.data)
      currentUser.value = userMenusRes.data.user
      
      // 设置已选中的菜单
      if (treeRef.value) {
        treeRef.value.setCheckedKeys(userMenusRes.data.menuCodes || [])
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 处理菜单选中状态变化
const handleCheck = () => {
  if (!treeRef.value) return
  checkedMenus.value = treeRef.value.getCheckedKeys()
}

// 保存用户菜单权限
const handleSave = async () => {
  if (!userId || !checkedMenus.value.length) return

  saving.value = true
  try {
    const res = await updateUserMenus(userId, checkedMenus.value)
    if (res.code === '000000') {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (error) {
    console.error('Error saving user menus:', error)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 初始化
onMounted(() => {
  if (userId) {
    fetchData()
  } else {
    ElMessage.error('缺少用户ID参数')
  }
})
</script>

<style scoped>
.user-menu-management {
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

.menu-tree {
  padding: 10px 0;
}

.menu-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-node [class*="fa-"] {
  width: 16px;
  font-size: 16px;
}

.menu-type {
  margin-left: 8px;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-card__header) {
  padding: 10px 20px;
}
</style>
