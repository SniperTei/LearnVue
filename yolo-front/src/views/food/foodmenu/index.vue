
<template>
  <div class="food-menu-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="菜品类型">
          <el-select v-model="searchForm.type" placeholder="选择菜品类型" clearable>
            <el-option
              v-for="item in foodTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="厨师">
          <el-input v-model="searchForm.chef" placeholder="输入厨师名称" clearable />
        </el-form-item>
        <el-form-item label="价格区间">
          <el-input-number
            v-model="searchForm.minPrice"
            :min="0"
            :precision="2"
            placeholder="最低价"
            style="width: 130px"
          />
          <span class="mx-2">-</span>
          <el-input-number
            v-model="searchForm.maxPrice"
            :min="0"
            :precision="2"
            placeholder="最高价"
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
      <el-button type="primary" @click="handleAdd" v-if="userStore.userInfo.isAdmin">新增菜品</el-button>
      <el-button type="success" @click="goToRandom">今天吃啥</el-button>
    </div>

    <!-- 菜品列表 -->
    <div class="menu-list">
      <el-row :gutter="20">
        <el-col v-for="item in foodMenus" :key="item._id" :span="6">
          <el-card :body-style="{ padding: '0px' }" class="menu-card">
            <el-image
              :src="item.imageUrl"
              fit="cover"
              class="menu-image"
              :preview-src-list="[item.imageUrl]"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="menu-info">
              <h3 class="menu-name">{{ item.name }}</h3>
              <div class="menu-type">{{ getFoodTypeLabel(item.type) }}</div>
              <div class="menu-description">{{ item.description }}</div>
              <div class="menu-price">¥{{ item.price }}</div>
              <div class="menu-chef">厨师：{{ item.chef }}</div>
              <div class="menu-actions" v-if="userStore.userInfo.isAdmin">
                <el-button type="primary" link @click="handleEdit(item)">编辑</el-button>
                <el-button type="danger" link @click="handleDelete(item._id)">删除</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination-area">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[8, 12, 16, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑/新增对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑菜品' : '新增菜品'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="max-width: 460px"
      >
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="菜品类型" prop="type">
          <el-select v-model="form.type" placeholder="选择菜品类型">
            <el-option
              v-for="item in foodTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜品描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="厨师" prop="chef">
          <el-input v-model="form.chef" />
        </el-form-item>
        <el-form-item label="图片" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/v1/common/uploadImg"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Picture, Plus } from '@element-plus/icons-vue';
import { getFoodMenuList, createFoodMenu, updateFoodMenu, deleteFoodMenu } from '@/api/foodMenuAPI';

// 菜品类型选项
const foodTypes = [
  { label: '素菜', value: 'vegetarian' },
  { label: '荤菜', value: 'meat' },
  { label: '凉菜', value: 'cold_dish' },
  { label: '汤', value: 'soup' },
  { label: '下饭菜', value: 'side_dish' },
  { label: '主食', value: 'staple_food' },
  { label: '减脂餐', value: 'diet_food' }
];

// 搜索表单
const searchForm = ref({
  type: '',
  chef: '',
  minPrice: null,
  maxPrice: null
});

// 分页信息
const pagination = ref({
  page: 1,
  limit: 8,
  total: 0
});

// 菜品列表
const foodMenus = ref([]);
const loading = ref(false);

// 表单相关
const dialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const formRef = ref(null);
const form = ref({
  name: '',
  type: '',
  description: '',
  imageUrl: '',
  price: 0,
  chef: ''
});

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜品类型', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
};

// 上传相关
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
};

// 获取菜品类型显示名称
const getFoodTypeLabel = (value) => {
  const type = foodTypes.find(t => t.value === value);
  return type ? type.label : value;
};

// 加载菜品列表
const loadFoodMenus = async () => {
  loading.value = true;
  
  const params = {
    page: pagination.value.page,
    limit: pagination.value.limit,
    ...searchForm.value
  };
  
  await getFoodMenuList(params)
    .then(data => {
      foodMenus.value = data.foodMenus;
      pagination.value = {
        page: data.pagination.currentPage,
        limit: data.pagination.limit,
        total: data.pagination.total
      };
    })
    .finally(() => {
      loading.value = false;
    });
};

// 搜索
const handleSearch = () => {
  pagination.value.page = 1;
  loadFoodMenus();
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    type: '',
    chef: '',
    minPrice: null,
    maxPrice: null
  };
  handleSearch();
};

// 分页处理
const handleSizeChange = (val) => {
  pagination.value.limit = val;
  loadFoodMenus();
};

const handleCurrentChange = (val) => {
  pagination.value.page = val;
  loadFoodMenus();
};

// 新增菜品
const handleAdd = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    name: '',
    type: '',
    description: '',
    imageUrl: '',
    price: 0,
    chef: ''
  };
  dialogVisible.value = true;
};

// 编辑菜品
const handleEdit = (item) => {
  isEditing.value = true;
  editingId.value = item._id;
  form.value = { ...item };
  dialogVisible.value = true;
};

// 删除菜品
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定要删除这个菜品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => deleteFoodMenu(id))
    .then(() => {
      ElMessage.success('删除成功');
      loadFoodMenus();
    })
    .catch(error => {
      if (error !== 'cancel') {
        console.error('删除失败:', error);
      }
    });
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate();
  
  if (isEditing.value) {
    await updateFoodMenu(editingId.value, form.value)
      .then(() => {
        ElMessage.success('修改成功');
        dialogVisible.value = false;
        loadFoodMenus();
      });
  } else {
    await createFoodMenu(form.value)
      .then(() => {
        ElMessage.success('添加成功');
        dialogVisible.value = false;
        loadFoodMenus();
      });
  }
};

// 上传相关方法
const handleUploadSuccess = (res) => {
  if (res.code === '000000') {
    form.value.imageUrl = res.data.urls[0].url;
  }
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！');
    return false;
  }
  return true;
};

// 跳转到随机推荐页面
const router = useRouter();
const goToRandom = () => {
  router.push({ name: 'RandomMenu' });
};

// 初始化
const userStore = useUserStore();

onMounted(() => {
  loadFoodMenus();
});
</script>

<style scoped>
.food-menu-container {
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

.operation-area {
  margin-bottom: 20px;
}

.menu-list {
  margin-bottom: 20px;
}

.menu-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.menu-image {
  width: 100%;
  height: 200px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  background: #f5f7fa;
  color: #909399;
}

.menu-info {
  padding: 14px;
}

.menu-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.menu-type {
  margin-top: 8px;
  color: #409EFF;
  font-size: 14px;
}

.menu-description {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.menu-price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin: 8px 0;
}

.menu-chef {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.menu-actions {
  border-top: 1px solid #eee;
  padding-top: 10px;
  text-align: right;
}

.pagination-area {
  margin-top: 20px;
  text-align: right;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.mx-2 {
  margin: 0 8px;
}
</style>