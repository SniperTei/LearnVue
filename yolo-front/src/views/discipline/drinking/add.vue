<template>
  <div class="add-drinking-record">
    <div class="page-header">
      <div class="title-section">
        <el-button link @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>返回
        </el-button>
        <h2>新增饮酒记录</h2>
      </div>
    </div>

    <div class="content-container">
      <!-- 酒类选择部分 -->
      <div class="wine-selection">
        <h3>选择酒品</h3>
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索酒品名称"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="selectedType"
            placeholder="酒品类型"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="type in alcoholTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </div>

        <div class="wines-grid">
          <el-card
            v-for="wine in filteredWines"
            :key="wine._id"
            :class="{ 'selected': selectedWine?._id === wine._id }"
            @click="selectWine(wine)"
          >
            <div class="wine-card-content">
              <el-image
                v-if="wine.imageUrl"
                :src="wine.imageUrl"
                fit="cover"
                class="wine-image"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="wine-info">
                <h4>{{ wine.name }}</h4>
                <div class="tags">
                  <el-tag size="small">{{ getCategoryLabel(wine.type) }}</el-tag>
                  <el-tag type="warning" size="small">{{ wine.alcoholContent }}%</el-tag>
                </div>
                <p class="brand">{{ wine.brand }}</p>
              </div>
            </div>
          </el-card>
        </div>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 记录详情表单 -->
      <div class="record-form" v-if="selectedWine">
        <h3>记录详情</h3>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="选择的酒品">
            <div class="selected-wine-info">
              <span class="name">{{ selectedWine.name }}</span>
              <span class="type">{{ getCategoryLabel(selectedWine.type) }}</span>
              <span class="alcohol">{{ selectedWine.alcoholContent }}%</span>
            </div>
          </el-form-item>

          <el-form-item label="饮用数量" prop="amount">
            <el-input-number 
              v-model="form.amount" 
              :min="1" 
              :max="99"
            />
            <el-select 
              v-model="form.unit" 
              style="margin-left: 10px; width: 100px"
            >
              <el-option label="瓶" value="瓶" />
              <el-option label="杯" value="杯" />
              <el-option label="罐" value="罐" />
            </el-select>
          </el-form-item>

          <el-form-item label="心情" prop="mood">
            <el-select v-model="form.mood" placeholder="选择心情" style="width: 100%">
              <el-option
                v-for="item in moodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <div class="mood-option">
                  <el-icon><component :is="item.icon" /></el-icon>
                  <span>{{ item.label }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="场合" prop="occasion">
            <el-select v-model="form.occasion" placeholder="选择场合" style="width: 100%">
              <el-option
                v-for="item in occasionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="地点" prop="location">
            <el-input v-model="form.location" placeholder="输入饮酒地点" />
          </el-form-item>

          <el-form-item label="同饮人" prop="companions">
            <el-select
              v-model="form.companions"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="输入或选择同饮人（可多选）"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="照片" prop="photos">
            <el-upload
              v-model:file-list="fileList"
              action="/api/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <el-dialog v-model="dialogImageVisible" title="预览">
              <img w-full :src="dialogImageUrl" alt="Preview" style="max-width: 100%" />
            </el-dialog>
          </el-form-item>

          <el-form-item label="饮酒时间" prop="drinkTime">
            <el-date-picker
              v-model="form.drinkTime"
              type="datetime"
              placeholder="选择时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="new Date(2000, 1, 1, 20, 0, 0)"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">提交记录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// import { ArrowLeft, Search, Picture, Plus, SmileFilled, FrownFilled, StarFilled, MagicStick, Sunny } from '@element-plus/icons-vue'
import { getAlcoholList } from '@/api/alcoholAPI'
import { createDrink } from '@/api/drinkAPI'

const router = useRouter()

// 酒类数据
const wines = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const searchQuery = ref('')
const selectedType = ref('')
const selectedWine = ref(null)
const loading = ref(false)
const fileList = ref([])
const dialogImageUrl = ref('')
const dialogImageVisible = ref(false)

// 表单数据
const formRef = ref(null)
const form = ref({
  amount: 1,
  unit: '瓶',
  drinkTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
  mood: '',
  occasion: '',
  location: '',
  companions: [],
  photos: [],
  note: ''
})

// 心情选项
const moodOptions = [
  { label: '开心', value: 'happy', icon: 'SmileFilled' },
  { label: '难过', value: 'sad', icon: 'FrownFilled' },
  { label: '兴奋', value: 'excited', icon: 'StarFilled' },
  { label: '放松', value: 'relaxed', icon: 'MagicStick' },
  { label: '平静', value: 'neutral', icon: 'Sunny' }
]

// 场合选项
const occasionOptions = [
  { label: '聚会', value: 'party' },
  { label: '晚餐', value: 'dinner' },
  { label: '社交', value: 'social' },
  { label: '独饮', value: 'alone' },
  { label: '商务', value: 'business' }
]

// 表单验证规则
const rules = {
  amount: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '数量必须大于0', trigger: 'blur' }
  ],
  drinkTime: [
    { required: true, message: '请选择时间', trigger: 'change' }
  ],
  mood: [
    { required: true, message: '请选择心情', trigger: 'change' }
  ],
  occasion: [
    { required: true, message: '请选择场合', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入地点', trigger: 'blur' }
  ]
}

// 酒类类型选项
const alcoholTypes = [
  { label: '啤酒', value: 'beer' },
  { label: '白酒', value: 'baijiu' },
  { label: '红酒', value: 'red_wine' },
  { label: '洋酒', value: 'foreign_wine' },
  { label: '清酒', value: 'sake' },
  { label: '烧酒', value: 'shochu' }
]

// 获取类型标签
const getCategoryLabel = (value) => {
  const category = alcoholTypes.find(type => type.value === value)
  return category ? category.label : value
}

// 过滤后的酒类列表
const filteredWines = computed(() => {
  return wines.value.filter(wine => {
    const matchName = searchQuery.value ? 
      wine.name.toLowerCase().includes(searchQuery.value.toLowerCase()) : true
    const matchType = selectedType.value ? 
      wine.type === selectedType.value : true
    return matchName && matchType
  })
})

// 加载酒类列表
const loadWines = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    };
    
    const data = await getAlcoholList(params);
    wines.value = data.alcohols;
    total.value = data.pagination.total;
  } catch (error) {
    console.error('加载酒类列表失败:', error);
    ElMessage.error(error.message || '加载失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 选择酒品
const selectWine = (wine) => {
  selectedWine.value = wine
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadWines()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  loadWines()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadWines()
}

// 图片上传相关方法
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogImageVisible.value = true
}

const handleUploadSuccess = (response, file) => {
  form.value.photos.push(response.url)
}

const handleRemove = (file) => {
  const index = form.value.photos.indexOf(file.url)
  if (index > -1) {
    form.value.photos.splice(index, 1)
  }
}

// 提交表单
const submitForm = async () => {
  if (!selectedWine.value) {
    ElMessage.warning('请先选择一个酒品')
    return
  }

  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    const data = {
      alcoholId: selectedWine.value._id,
      amount: form.value.amount,
      unit: form.value.unit,
      drinkTime: form.value.drinkTime,
      mood: form.value.mood,
      occasion: form.value.occasion,
      location: form.value.location,
      companions: form.value.companions,
      photos: form.value.photos,
      note: form.value.note
    };

    await createDrink(data);
    ElMessage.success('记录添加成功');
    router.back();
  } catch (error) {
    console.error('提交表单失败:', error);
    ElMessage.error(error.message || '提交失败，请重试');
  }
}

// 初始化
loadWines()
</script>

<style lang="scss" scoped>
.add-drinking-record {
  padding: 20px;

  .page-header {
    margin-bottom: 24px;

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        margin: 0;
      }
    }
  }

  .content-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;

    .wine-selection {
      h3 {
        margin: 0 0 16px 0;
      }

      .search-bar {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;

        .el-select {
          width: 200px;
        }
      }

      .wines-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 20px;

        .el-card {
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
          }

          &.selected {
            border-color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9);
          }

          .wine-card-content {
            .wine-image {
              width: 100%;
              height: 150px;
              border-radius: 4px;
              margin-bottom: 12px;
            }

            .image-slot {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 150px;
              background: #f5f7fa;
              color: #909399;
              font-size: 24px;
            }

            .wine-info {
              h4 {
                margin: 0 0 8px 0;
                font-size: 16px;
                line-height: 1.4;
              }

              .tags {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
              }

              .brand {
                margin: 0;
                font-size: 14px;
                color: #606266;
              }
            }
          }
        }
      }

      .pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }
    }

    .record-form {
      background: #fff;
      padding: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

      h3 {
        margin: 0 0 20px 0;
      }

      .selected-wine-info {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        background: var(--el-color-primary-light-9);
        border-radius: 4px;

        .name {
          font-weight: 500;
        }

        .type, .alcohol {
          color: #606266;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
