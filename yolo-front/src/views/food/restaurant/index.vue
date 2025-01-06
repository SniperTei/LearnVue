<template>
  <div class="restaurant-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="餐厅名称">
          <el-input v-model="searchForm.name" placeholder="请输入餐厅名称" clearable />
        </el-form-item>
        <el-form-item label="价位等级">
          <el-select v-model="searchForm.priceLevel" placeholder="选择价位等级" clearable style="width: 200px">
            <el-option
              v-for="item in priceLevels"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评分范围">
          <el-input-number
            v-model="searchForm.minRating"
            :min="0"
            :max="5"
            :precision="1"
            :step="0.5"
            placeholder="最低评分"
            style="width: 130px"
          />
          <span class="mx-2">-</span>
          <el-input-number
            v-model="searchForm.maxRating"
            :min="0"
            :max="5"
            :precision="1"
            :step="0.5"
            placeholder="最高评分"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="operation-area">
      <el-button type="primary" @click="handleAdd" v-if="userStore.userInfo.isAdmin">新增餐厅</el-button>
    </div>

    <!-- 列表区域 -->
    <div class="list-area">
      <el-empty
        v-if="!restaurantList.length"
        description="暂无餐厅数据"
        :image-size="200"
      >
        <el-button type="primary" @click="handleAdd" v-if="userStore.userInfo.isAdmin">新增餐厅</el-button>
      </el-empty>
      <template v-else>
        <el-card v-for="item in restaurantList" :key="item._id" class="restaurant-card">
          <div class="restaurant-info">
            <div class="restaurant-header">
              <h2 class="restaurant-name">{{ item.name }}</h2>
              <div class="restaurant-rating">
                <el-rate v-model="item.rating" disabled show-score text-color="#ff9900" />
              </div>
            </div>
            <div class="restaurant-content">
              <div class="restaurant-images" v-if="item.imageUrls && item.imageUrls.length">
                <el-image 
                  v-for="(url, index) in item.imageUrls" 
                  :key="index"
                  :src="url"
                  fit="cover"
                  :preview-src-list="item.imageUrls"
                />
              </div>
              <div class="restaurant-details">
                <p class="address"><i class="el-icon-location"></i> {{ item.address }}</p>
                <p class="description">{{ item.description }}</p>
                <p class="price-level">价位: {{ priceLevels.find(p => p.key === item.priceLevel)?.value || '未知' }}</p>
              </div>
            </div>
          </div>
          <div class="restaurant-actions" v-if="userStore.userInfo.isAdmin">
            <el-button type="primary" link @click="handleEdit(item)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(item)">删除</el-button>
          </div>
        </el-card>
      </template>
    </div>

    <!-- 分页 -->
    <div class="pagination-area">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增餐厅' : '编辑餐厅'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        ref="restaurantFormRef"
        :model="restaurantForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="餐厅名称" prop="name">
          <el-input v-model="restaurantForm.name" placeholder="请输入餐厅名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="restaurantForm.address" placeholder="请输入餐厅地址" />
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="restaurantForm.rating" :max="5" :allow-half="true" show-score />
        </el-form-item>
        <el-form-item label="价位等级" prop="priceLevel">
          <el-select v-model="restaurantForm.priceLevel" placeholder="请选择价位等级" style="width: 100%">
            <el-option
              v-for="item in priceLevels"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="imageUrls">
          <el-upload
            :action="null"
            :auto-upload="false"
            list-type="picture-card"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="fileList"
            :limit="9"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="restaurantForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入餐厅描述"
          />
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
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import {
  getRestaurantList,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '@/api/restaurantAPI'
import { getDictionaries } from '@/api/dictionaryAPI'
import { uploadImages } from '@/api/uploadAPI'

const userStore = useUserStore()

// 价位等级映射
const priceLevels = ref([])

// 搜索表单
const searchForm = reactive({
  name: '',
  priceLevel: '',
  minRating: null,
  maxRating: null
})

// 餐厅表单
const restaurantFormRef = ref(null)
const restaurantForm = ref({
  name: '',
  address: '',
  rating: 5,
  imageUrls: [],
  description: '',
  priceLevel: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入餐厅名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入餐厅地址', trigger: 'blur' }],
  rating: [{ required: true, message: '请选择评分', trigger: 'change' }],
  priceLevel: [{ required: true, message: '请选择价位等级', trigger: 'change' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  imageUrls: [{ type: 'array', message: '请上传至少一张图片', trigger: 'change' }]
}

// 列表数据
const restaurantList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add') // add 或 edit
const currentId = ref('')

// 文件上传相关
const fileList = ref([])
const uploadFiles = ref([])

// 初始化
onMounted(async () => {
  await Promise.all([
    fetchPriceLevels(),
    fetchRestaurantList()
  ])
})

// 获取价位等级
const fetchPriceLevels = async () => {
  try {
    const res = await getDictionaries('RESTAURANT_PRICE_LEVEL')
    priceLevels.value = res.data.RESTAURANT_PRICE_LEVEL
    console.log('价位等级:', res)
  } catch (error) {
    console.error('获取价位等级失败:', error)
  }
}

// 获取餐厅列表
const fetchRestaurantList = async () => {
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      ...searchForm
    }
    const res = await getRestaurantList(params)
    restaurantList.value = res.data.restaurants
    total.value = res.data.total
  } catch (error) {
    console.error('获取餐厅列表失败:', error)
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchRestaurantList()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchRestaurantList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchRestaurantList()
}

// 新增餐厅
const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 编辑餐厅
const handleEdit = (row) => {
  dialogType.value = 'edit'
  currentId.value = row._id
  Object.assign(restaurantForm.value, row)
  fileList.value = row.imageUrls?.map((url, index) => ({
    name: `image-${index}`,
    url
  })) || []
  uploadFiles.value = []
  dialogVisible.value = true
}

// 删除餐厅
const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm('确定要删除该餐厅吗？', '提示', {
      type: 'warning'
    })
    const res = await deleteRestaurant(item._id)
    if (res.code === '000000') {
      ElMessage.success('删除成功')
      await fetchRestaurantList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除餐厅失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 处理文件选择
const handleFileChange = (file, files) => {
  const totalImages = (restaurantForm.value.imageUrls?.length || 0) + files.length
  if (totalImages > 9) {
    ElMessage.warning('图片总数不能超过9张')
    const extraCount = totalImages - 9
    files.splice(files.length - extraCount, extraCount)
  }
  uploadFiles.value = files
}

// 处理文件移除
const handleFileRemove = (file, files) => {
  uploadFiles.value = files
  const index = restaurantForm.value.imageUrls.indexOf(file.url)
  if (index > -1) {
    restaurantForm.value.imageUrls.splice(index, 1)
  }
}

// 超出限制处理
const handleExceed = () => {
  ElMessage.warning('最多只能上传9张图片')
}

// 上传前检查
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传图片
const uploadRestaurantImages = async () => {
  if (!uploadFiles.value.length) return []

  try {
    const formData = new FormData()
    uploadFiles.value.forEach(file => {
      formData.append('files', file.raw)
    })

    const res = await uploadImages(formData)
    if (res.code === '000000') {
        const urls = res.data.urls.map(item => item.url)
        restaurantForm.value.imageUrls = urls
        ElMessage.success('图片上传成功')
        return res.data.urls
    } else {
        ElMessage.error('图片上传失败')
        return []
    }
  } catch (error) {
    console.error('上传图片失败:', error)
    ElMessage.error('图片上传失败')
    return []
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!restaurantFormRef.value) return

  try {
    await restaurantFormRef.value.validate()
    
    // 先上传图片
    const urlItems = await uploadRestaurantImages()
    const imageUrls = urlItems.map(item => item.url)
    if (!imageUrls.length && uploadFiles.value.length > 0) {
      return
    }

    const allImageUrls = [...(restaurantForm.value.imageUrls || []), ...imageUrls]
    if (allImageUrls.length > 9) {
      ElMessage.error('图片总数不能超过9张')
      return
    }

    const data = { 
      ...restaurantForm.value,
      imageUrls: allImageUrls
    }

    if (dialogType.value === 'add') {
      const res = await createRestaurant(data)
      if (res.code === '000000') {
        ElMessage.success('创建成功')
        dialogVisible.value = false
        fetchRestaurantList()
      }
    } else {
      const res = await updateRestaurant(currentId.value, data)
      if (res.code === '000000') {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchRestaurantList()
      }
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  }
}

// 重置表单
const resetForm = () => {
  if (restaurantFormRef.value) {
    restaurantFormRef.value.resetFields()
  }
  Object.keys(restaurantForm.value).forEach(key => {
    restaurantForm.value[key] = key === 'rating' ? 5 : ''
  })
  fileList.value = []
  uploadFiles.value = []
}
</script>

<style lang="scss" scoped>
.restaurant-container {
  padding: 20px;

  .search-area {
    margin-bottom: 20px;
    .mx-2 {
      margin: 0 10px;
    }
  }

  .operation-area {
    margin-bottom: 20px;
  }

  .list-area {
    min-height: 300px;

    :deep(.el-empty) {
      padding: 60px 0;

      .el-empty__image {
        width: 160px;
        height: 160px;
      }

      .el-empty__description {
        margin-top: 20px;
        font-size: 16px;
        color: #909399;
      }

      .el-button {
        margin-top: 20px;
      }
    }

    .restaurant-card {
      margin-bottom: 20px;

      .restaurant-info {
        .restaurant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;

          .restaurant-name {
            margin: 0;
            font-size: 20px;
            font-weight: bold;
          }
        }

        .restaurant-content {
          display: flex;
          gap: 20px;

          .restaurant-images {
            display: flex;
            gap: 10px;
            
            .el-image {
              width: 150px;
              height: 150px;
              border-radius: 8px;
            }
          }

          .restaurant-details {
            flex: 1;
            
            p {
              margin: 8px 0;
            }

            .address {
              color: #666;
            }

            .description {
              color: #333;
              line-height: 1.5;
            }

            .price-level {
              color: #409EFF;
              font-weight: bold;
            }
          }
        }
      }

      .restaurant-actions {
        margin-top: 15px;
        text-align: right;
      }
    }
  }

  .pagination-area {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
}
</style>