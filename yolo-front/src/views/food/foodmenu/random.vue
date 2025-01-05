<template>
  <div class="random-menu-container">
    <div class="random-form">
      <h2>今天吃啥？</h2>
      <div class="form-content">
        <el-input-number
          v-model="foodCount"
          :min="1"
          :max="10"
          :step="1"
          size="large"
          style="width: 180px"
        />
        <el-button type="primary" size="large" @click="getRandomFood" :loading="loading">
          随机推荐
        </el-button>
      </div>
    </div>

    <div class="food-list" v-if="recommendedFoods.length">
      <el-row :gutter="20">
        <el-col v-for="food in recommendedFoods" :key="food._id" :span="8">
          <el-card :body-style="{ padding: '0px' }" class="food-card">
            <el-image
              :src="food.imageUrl"
              fit="cover"
              class="food-image"
              :preview-src-list="[food.imageUrl]"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="food-info">
              <h3 class="food-name">{{ food.name }}</h3>
              <div class="food-type">{{ getFoodTypeLabel(food.type) }}</div>
              <div class="food-description">{{ food.description }}</div>
              <div class="food-price">
                <span class="price-symbol">¥</span>
                <span class="price-number">{{ food.price }}</span>
              </div>
              <div class="food-chef">厨师：{{ food.chef }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="empty-state" v-else-if="!loading">
      <el-empty description="还没有推荐菜品，快来试试吧！" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Picture } from '@element-plus/icons-vue';
import { getRandomFoodMenu } from '@/api/foodMenuAPI';

const foodCount = ref(1);
const loading = ref(false);
const recommendedFoods = ref([]);

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

// 获取菜品类型显示名称
const getFoodTypeLabel = (value) => {
  const type = foodTypes.find(t => t.value === value);
  return type ? type.label : value;
};

// 获取随机推荐菜品
const getRandomFood = async () => {
  loading.value = true;
  try {
    const data = await getRandomFoodMenu(foodCount.value);
    recommendedFoods.value = data.result;
    ElMessage.success('今天就吃这些吧！');
  } catch (error) {
    console.error('获取随机菜品失败:', error);
    ElMessage.error('获取推荐菜品失败，请重试');
    recommendedFoods.value = [];
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.random-menu-container {
  padding: 20px;
}

.random-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 30px;
}

.random-form h2 {
  margin: 0 0 20px;
  color: #303133;
  font-size: 24px;
}

.form-content {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.food-list {
  margin-top: 30px;
}

.food-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.food-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.food-image {
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

.food-info {
  padding: 14px;
}

.food-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.food-type {
  margin-top: 8px;
  color: #409EFF;
  font-size: 14px;
}

.food-description {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.food-price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin: 8px 0;
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 14px;
  margin-right: 4px;
}

.price-number {
  font-size: 20px;
}

.food-chef {
  color: #666;
  font-size: 14px;
}

.empty-state {
  margin-top: 60px;
}
</style>
