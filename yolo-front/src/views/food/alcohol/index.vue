<template>
    <div class="alcohol-container">
      <div class="page-header">
        <div class="title-stats">
          <h2>酒类管理</h2>
          <div class="stats">
            <el-tag type="info">总数量: {{ pagination.total }}</el-tag>
          </div>
        </div>
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>新增酒类
        </el-button>
      </div>
  
      <!-- 酒类列表 -->
      <div class="alcohols-list" v-loading="loading">
        <el-empty v-if="alcohols.length === 0" description="暂无酒类" />
        <el-card v-else v-for="alcohol in alcohols" :key="alcohol.alcoholId" class="alcohol-card">
          <div class="alcohol-header">
            <div class="title-info">
              <h3>{{ alcohol.name }}</h3>
              <div class="tags">
                <el-tag>{{ getCategoryLabel(alcohol.type) }}</el-tag>
                <el-tag type="warning">{{ alcohol.alcoholContent }}%</el-tag>
                <el-tag type="info">{{ alcohol.brand }}</el-tag>
              </div>
            </div>
            <div class="actions">
              <el-button type="primary" link @click="openEditDialog(alcohol)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" link @click="handleDelete(alcohol.alcoholId)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="alcohol-content">
            <div class="image" v-if="alcohol.imageUrl">
              <el-image 
                :src="alcohol.imageUrl" 
                fit="cover"
                :preview-src-list="[alcohol.imageUrl]"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="details">
              <div class="info">
                <span class="info-item">
                  <el-icon><Goblet /></el-icon>
                  容量: {{ alcohol.volume }}{{ alcohol.volumeUnit }}
                </span>
                <span class="info-item">
                  <el-icon><Timer /></el-icon>
                  创建时间: {{ formatDate(alcohol.createdAt) }}
                </span>
                <span class="info-item">
                  <el-icon><User /></el-icon>
                  创建者: {{ alcohol.createdBy }}
                </span>
              </div>
              <div class="description" v-if="alcohol.description">
                <el-icon><InfoFilled /></el-icon>
                {{ alcohol.description }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
  
      <!-- 分页 -->
      <div class="pagination" v-if="pagination.total > 0">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.limit"
          :total="pagination.total"
          @current-change="handlePageChange"
          layout="prev, pager, next"
        />
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
          <el-form-item label="酒名" prop="name">
            <el-input v-model="form.name" placeholder="请输入酒名" />
          </el-form-item>
          
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
              <el-option
                v-for="category in categories"
                :key="category.value"
                :label="category.label"
                :value="category.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="form.brand" placeholder="请输入品牌" />
          </el-form-item>
          
          <el-form-item label="酒精度数" prop="alcoholContent">
            <el-input-number 
              v-model="form.alcoholContent" 
              :min="0" 
              :max="100"
              :precision="1"
              :step="0.1"
              style="width: 180px"
            />
            <span class="unit">%</span>
          </el-form-item>
          
          <el-form-item label="容量" prop="volume">
            <el-input-number 
              v-model="form.volume" 
              :min="0"
              :step="50"
              style="width: 180px"
            />
            <el-select v-model="form.volumeUnit" style="width: 80px; margin-left: 10px">
              <el-option
                v-for="unit in volumeUnits"
                :key="unit.value"
                :label="unit.label"
                :value="unit.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入描述"
            />
          </el-form-item>
          
          <el-form-item label="图片链接" prop="imageUrl">
            <el-input v-model="form.imageUrl" placeholder="请输入图片链接（可选）" />
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
  import { Delete, Edit, Plus, Picture, Goblet, Timer, User, InfoFilled } from '@element-plus/icons-vue'
  import { createAlcohol, getAlcoholList, updateAlcohol, deleteAlcohol } from '@/api/alcoholAPI'
  
  // 数据
  const alcohols = ref([])
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增酒类')
  const isEditing = ref(false)
  const editingId = ref(null)
  const formRef = ref(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0
  })
  
  // 分类选项
  const categories = [
    { label: '啤酒', value: 'beer' },
    { label: '白酒', value: 'baijiu' },
    { label: '红酒', value: 'red_wine' },
    { label: '洋酒', value: 'foreign_wine' },
    { label: '清酒', value: 'sake' },
    { label: '烧酒', value: 'shochu' }
  ]
  
  // 容量单位选项
  const volumeUnits = [
    { label: '毫升', value: 'ml' },
    { label: '升', value: 'L' }
  ]
  
  // 表单数据
  const form = ref({
    name: '',
    type: '',
    brand: '',
    alcoholContent: 40.0,
    volume: 500,
    volumeUnit: 'ml',
    description: '',
    imageUrl: ''
  })
  
  // 表单规则
  const rules = {
    name: [
      { required: true, message: '请输入酒名', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择类型', trigger: 'change' }
    ],
    brand: [
      { required: true, message: '请输入品牌', trigger: 'blur' }
    ],
    alcoholContent: [
      { required: true, message: '请输入酒精度数', trigger: 'blur' }
    ],
    volume: [
      { required: true, message: '请输入容量', trigger: 'blur' }
    ],
    volumeUnit: [
      { required: true, message: '请选择容量单位', trigger: 'change' }
    ]
  }
  
  // 加载酒类列表
  const loadalcohols = async () => {
    loading.value = true;
    
    await getAlcoholList({
      page: pagination.value.page,
      limit: pagination.value.limit
    })
      .then(res => {
        alcohols.value = res.data.alcohols || [];
        
        // 更新分页信息
        const paginationData = res.data.pagination || {};
        pagination.value = {
          page: paginationData.currentPage || 1,
          limit: paginationData.limit || 10,
          total: paginationData.total || 0
        };
        
        if (alcohols.value.length === 0) {
          ElMessage.info('暂无数据');
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
  
  // 处理分页变化
  const handlePageChange = (newPage) => {
    pagination.value.page = newPage;
    loadalcohols();
  }
  
  // 打开新增对话框
  const openAddDialog = () => {
    dialogTitle.value = '新增酒类';
    isEditing.value = false;
    editingId.value = null;
    form.value = {
      name: '',
      type: '',
      brand: '',
      alcoholContent: 40.0,
      volume: 500,
      volumeUnit: 'ml',
      description: '',
      imageUrl: ''
    };
    dialogVisible.value = true;
  }
  
  // 打开编辑对话框
  const openEditDialog = (alcohol) => {
    dialogTitle.value = '编辑酒类';
    isEditing.value = true;
    editingId.value = alcohol.alcoholId;
    form.value = {
      name: alcohol.name,
      type: alcohol.type,
      brand: alcohol.brand,
      alcoholContent: alcohol.alcoholContent,
      volume: alcohol.volume,
      volumeUnit: alcohol.volumeUnit,
      description: alcohol.description,
      imageUrl: alcohol.imageUrl
    };
    dialogVisible.value = true;
  }
  
  // 提交表单
  const submitForm = async () => {
    if (!formRef.value) return;
    
    await formRef.value.validate();
    
    const data = { ...form.value };
    
    if (isEditing.value) {
      await updateAlcohol(editingId.value, data)
        .then(() => {
          ElMessage.success('修改成功');
          dialogVisible.value = false;
          loadalcohols();
        });
    } else {
      await createAlcohol(data)
        .then(() => {
          ElMessage.success('添加成功');
          dialogVisible.value = false;
          loadalcohols();
        });
    }
  };
  
  // 删除酒类
  const handleDelete = async (id) => {
    await ElMessageBox.confirm('确定要删除这个酒类记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => deleteAlcohol(id))
      .then(() => {
        ElMessage.success('删除成功');
        loadalcohols();
      })
      .catch(error => {
        if (error !== 'cancel') {
          console.error('删除失败:', error);
        }
      });
  };
  
  // 获取分类显示名称
  const getCategoryLabel = (value) => {
    const category = categories.find(c => c.value === value);
    return category ? category.label : value;
  }
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  onMounted(() => {
    loadalcohols();
  });
  </script>
  
  <style lang="scss" scoped>
  .alcohol-container {
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
    
    .alcohols-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      
      .alcohol-card {
        .alcohol-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          
          .title-info {
            h3 {
              margin: 0 0 12px 0;
              font-size: 18px;
              color: #303133;
            }
            
            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
          }
        }
        
        .alcohol-content {
          .image {
            margin-bottom: 16px;
            
            .el-image {
              width: 100%;
              height: 200px;
              border-radius: 4px;
              overflow: hidden;
            }
            
            .image-error {
              width: 100%;
              height: 200px;
              background-color: #f5f7fa;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #909399;
              font-size: 24px;
            }
          }
          
          .details {
            .info {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-bottom: 16px;
              
              .info-item {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #606266;
                font-size: 14px;
                
                .el-icon {
                  font-size: 16px;
                  color: #909399;
                }
              }
            }
            
            .description {
              color: #606266;
              font-size: 14px;
              line-height: 1.6;
              display: flex;
              align-items: flex-start;
              gap: 8px;
              
              .el-icon {
                margin-top: 3px;
                color: #909399;
              }
            }
          }
        }
      }
    }
    
    .pagination {
      margin-top: 24px;
      text-align: center;
    }
    
    .unit {
      margin-left: 8px;
      color: #606266;
    }
  }
  </style>
  