<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTravelDiaries, deleteTravelDiary } from '@/api/travelAPI'

const router = useRouter()
const loading = ref(false)
const diaryList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadDiaries = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    }
    
    const result = await getTravelDiaries(params)
    if (result.code === '000000' && result.data) {
      diaryList.value = result.data.diaries
      total.value = result.data.totalPages * pageSize.value
    } else {
      ElMessage.error(result.msg || '获取游记列表失败')
    }
  } catch (error) {
    console.error('Error loading diaries:', error)
    ElMessage.error('获取游记列表失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadDiaries()
}

const handleCreateDiary = () => {
  router.push('/entertainment/travel/diary/detail')
}

const handleEditDiary = (id) => {
  router.push(`/entertainment/travel/diary/detail/${id}`)
}

const handleViewDiary = (id) => {
  router.push(`/entertainment/travel/diary/detail/${id}?mode=view`)
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇游记吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const result = await deleteTravelDiary(id)
    if (result.code === '000000') {
      ElMessage.success('删除成功')
      loadDiaries()
    } else {
      ElMessage.error(result.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting diary:', error)
      ElMessage.error('删除失败')
    }
  }
}

const formatLocation = (location) => {
  if (!location) return ''
  const { country, city, place } = location
  return [country, city, place].filter(Boolean).join(' · ')
}

const formatTags = (tags) => {
  return tags?.join(', ') || ''
}

onMounted(() => {
  loadDiaries()
})
</script>

<template>
  <div class="travel-diary">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">我的游记</span>
          <el-button type="primary" @click="handleCreateDiary">写游记</el-button>
        </div>
      </template>
      
      <div class="diary-list" v-loading="loading">
        <el-empty v-if="!diaryList.length" description="暂无游记" />
        
        <template v-else>
          <div v-for="diary in diaryList" :key="diary.travelDiaryId" class="diary-item">
            <el-card shadow="hover">
              <div class="diary-content">
                <div class="diary-header">
                  <h3 class="diary-title" @click="handleViewDiary(diary.travelDiaryId)">
                    {{ diary.title }}
                  </h3>
                  <div class="diary-meta">
                    <span class="location">
                      <el-icon><Location /></el-icon>
                      {{ formatLocation(diary.location) }}
                    </span>
                    <span class="time">
                      <el-icon><Clock /></el-icon>
                      {{ new Date(diary.createdAt).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
                
                <div class="diary-body">
                  <p class="diary-text">{{ diary.content }}</p>
                  
                  <div v-if="diary.images?.length" class="diary-images">
                    <el-image
                      v-for="(image, index) in diary.images.slice(0, 3)"
                      :key="index"
                      :src="image.url"
                      :alt="image.caption"
                      fit="cover"
                      :preview-src-list="diary.images.map(img => img.url)"
                    />
                  </div>
                  
                  <div v-if="diary.tags?.length" class="diary-tags">
                    <el-tag
                      v-for="tag in diary.tags"
                      :key="tag"
                      size="small"
                      effect="plain"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="diary-footer">
                  <el-button
                    type="primary"
                    link
                    @click="handleEditDiary(diary.travelDiaryId)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    link
                    @click.stop="handleDelete(diary.travelDiaryId)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
          
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              @current-change="handlePageChange"
              layout="prev, pager, next"
              background
            />
          </div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.travel-diary {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }
  
  .diary-list {
    min-height: 200px;
  }
  
  .diary-item {
    margin-bottom: 20px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .diary-content {
      .diary-header {
        margin-bottom: 16px;
        
        .diary-title {
          margin: 0 0 8px;
          font-size: 18px;
          color: #303133;
          cursor: pointer;
          transition: color 0.3s ease;
          
          &:hover {
            color: #409eff;
          }
        }
        
        .diary-meta {
          display: flex;
          gap: 16px;
          color: #909399;
          font-size: 14px;
          
          .location, .time {
            display: flex;
            align-items: center;
            gap: 4px;
            
            .el-icon {
              font-size: 16px;
            }
          }
        }
      }
      
      .diary-body {
        .diary-text {
          margin: 0 0 16px;
          color: #606266;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .diary-images {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          
          .el-image {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            overflow: hidden;
          }
        }
        
        .diary-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
          
          .el-tag {
            margin: 0;
          }
        }
      }
      
      .diary-footer {
        display: flex;
        justify-content: flex-end;
        padding-top: 12px;
        border-top: 1px solid #ebeef5;
      }
    }
  }
  
  .pagination {
    margin-top: 32px;
    display: flex;
    justify-content: center;
  }
}
</style>
