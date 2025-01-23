<template>
  <div class="travel-container">
    <el-tabs v-model="activeTab" class="travel-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="旅行计划" name="plan">
        <TravelPlan v-if="activeTab === 'plan'" />
      </el-tab-pane>
      <el-tab-pane label="旅行游记" name="diary">
        <TravelDiary v-if="activeTab === 'diary'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TravelPlan from './plan/index.vue'
import TravelDiary from './diary/index.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('plan')

const handleTabClick = (tab) => {
  const path = `/entertainment/travel/${tab.props.name}`
  if (route.path !== path) {
    router.push(path)
  }
}

// Sync tab with route
watch(
  () => route.path,
  (path) => {
    if (path.includes('/travel/plan')) {
      activeTab.value = 'plan'
    } else if (path.includes('/travel/diary')) {
      activeTab.value = 'diary'
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.travel-container {
  padding: 20px;
  
  .travel-tabs {
    background-color: white;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    :deep(.el-tabs__content) {
      padding-top: 20px;
    }
  }
}
</style>