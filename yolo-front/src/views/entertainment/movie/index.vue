<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMovieList, toggleLike, addToWantToWatch, removeFromWantToWatch, deleteMovie, markAsWatched } from '@/api/movieAPI'
import { Star, StarFilled, View, Plus, Delete, Edit } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const queryParams = ref({
  page: 1,
  limit: 8,
  title: '',
  genres: '',
  director: '',
  actors: ''
})

const movieList = ref([])
const total = ref(0)
const totalPages = ref(0)

const genreOptions = [
  { label: '动作', value: '动作' },
  { label: '喜剧', value: '喜剧' },
  { label: '科幻', value: '科幻' },
  { label: '剧情', value: '剧情' },
  { label: '冒险', value: '冒险' },
  { label: '悬疑', value: '悬疑' },
  { label: '恐怖', value: '恐怖' },
  { label: '爱情', value: '爱情' }
]

const loadMovies = async () => {
  try {
    loading.value = true
    const result = await getMovieList(queryParams.value)
    
    if (result.code === '000000' && result.data) {
      movieList.value = result.data.movies
      total.value = result.data.total
      totalPages.value = result.data.totalPages
    } else {
      ElMessage.error(result.msg || '获取电影列表失败')
    }
  } catch (error) {
    console.error('Error loading movies:', error)
    ElMessage.error('获取电影列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  queryParams.value.page = 1
  try {
    loading.value = true
    const result = await getMovieList(queryParams.value)
    
    if (result.code === '000000' && result.data) {
      movieList.value = result.data.movies
      total.value = result.data.total
      totalPages.value = result.data.totalPages
    } else {
      ElMessage.error(result.msg || '搜索电影失败')
    }
  } catch (error) {
    console.error('Error searching movies:', error)
    ElMessage.error('搜索电影失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  queryParams.value.page = page
  loadMovies()
}

const handleToggleLike = async (movie) => {
  try {
    const result = await toggleLike(movie.id)
    if (result.code === '000000') {
      movie.likeStatus = result.data.likeStatus
      ElMessage.success(movie.likeStatus === 'Y' ? '收藏成功' : '取消收藏成功')
    } else {
      ElMessage.error(result.msg || '操作失败')
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    ElMessage.error('操作失败')
  }
}

const handleToggleWantToWatch = async (movie) => {
  try {
    const result = movie.wantToWatchStatus === 'Y' 
      ? await removeFromWantToWatch(movie.id)
      : await addToWantToWatch(movie.id)
    
    if (result.code === '000000') {
      movie.wantToWatchStatus = result.data.wantToWatchStatus
      ElMessage.success(movie.wantToWatchStatus === 'Y' ? '添加到想看列表' : '从想看列表移除')
    } else {
      ElMessage.error(result.msg || '操作失败')
    }
  } catch (error) {
    console.error('Error toggling want to watch:', error)
    ElMessage.error('操作失败')
  }
}

const handleViewDetail = (id) => {
  router.push(`/entertainment/movie/detail/${id}`)
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该电影？', '提示', {
      type: 'warning'
    })
    
    const result = await deleteMovie(id)
    if (result.code === '000000') {
      ElMessage.success('删除成功')
      loadMovies()
    } else {
      ElMessage.error(result.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting movie:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleEdit = (id) => {
  router.push(`/entertainment/movie/detail/${id}`)
}

const handleAdd = () => {
  router.push('/entertainment/movie/detail')
}

const handleMarkAsWatched = async (movie) => {
  try {
    const result = await markAsWatched(movie.id, { watchDate: new Date().toISOString() })
    if (result.code === '000000') {
      movie.watchStatus = 'Y'
      ElMessage.success('标记为已看')
    } else {
      ElMessage.error(result.msg || '操作失败')
    }
  } catch (error) {
    console.error('Error marking as watched:', error)
    ElMessage.error('操作失败')
  }
}

const resetQuery = () => {
  queryParams.value = {
    page: 1,
    limit: 8,
    title: '',
    genres: '',
    director: '',
    actors: ''
  }
  loadMovies()
}

onMounted(() => {
  loadMovies()
})
</script>

<template>
  <div class="movie-container">
    <div class="filter-container">
      <el-form :inline="true" :model="queryParams" class="form-inline">
        <el-form-item label="电影名">
          <el-input 
            v-model="queryParams.title" 
            placeholder="请输入电影名" 
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select 
            v-model="queryParams.genres" 
            placeholder="请选择类型" 
            clearable
          >
            <el-option 
              v-for="option in genreOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="导演">
          <el-input 
            v-model="queryParams.director" 
            placeholder="请输入导演" 
            clearable
          />
        </el-form-item>
        <el-form-item label="演员">
          <el-input 
            v-model="queryParams.actors" 
            placeholder="请输入演员" 
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">
            搜索
          </el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="success" @click="handleAdd">新增电影</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <el-col 
        :xs="24" :sm="12" :md="8" :lg="6" 
        v-for="movie in movieList" 
        :key="movie.id"
      >
        <el-card :body-style="{ padding: '0px' }" class="movie-card">
          <div class="poster-wrapper">
            <img :src="movie.imageUrl" class="poster" @click="handleViewDetail(movie.id)">
            <div class="poster-overlay">
              <el-button 
                circle
                :icon="movie.likeStatus === 'Y' ? StarFilled : Star"
                @click="handleToggleLike(movie)"
                :type="movie.likeStatus === 'Y' ? 'warning' : ''"
                title="收藏"
              />
              <el-button 
                circle
                :icon="movie.wantToWatchStatus === 'Y' ? Delete : Plus"
                @click="handleToggleWantToWatch(movie)"
                :type="movie.wantToWatchStatus === 'Y' ? 'danger' : ''"
                title="想看"
              />
              <el-button
                circle
                :icon="View"
                @click="handleMarkAsWatched(movie)"
                :type="movie.watchStatus === 'Y' ? 'success' : ''"
                title="看过"
              />
              <el-button
                circle
                :icon="Edit"
                @click="handleEdit(movie.id)"
                type="primary"
                title="编辑"
              />
              <el-button
                circle
                :icon="Delete"
                @click="handleDelete(movie.id)"
                type="danger"
                title="删除"
              />
            </div>
          </div>
          <div class="movie-info">
            <h3 class="title" @click="handleViewDetail(movie.id)">
              {{ movie.title }}
            </h3>
            <div class="meta">
              <el-rate 
                v-model="movie.rating" 
                disabled 
                show-score 
                text-color="#ff9900"
                score-template="{value}"
              />
              <span class="date">{{ new Date(movie.publishDate).getFullYear() }}</span>
            </div>
            <div class="tags">
              <el-tag 
                v-for="genre in movie.genres" 
                :key="genre"
                size="small"
                effect="plain"
              >
                {{ genre }}
              </el-tag>
            </div>
            <div class="description">{{ movie.synopsis }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty 
      v-if="!loading && !movieList.length" 
      description="暂无电影" 
    />

    <el-pagination
      v-if="total > 0"
      class="pagination"
      v-model:current-page="queryParams.page"
      :page-size="queryParams.limit"
      :total="total"
      :pager-count="7"
      layout="total, prev, pager, next"
      background
      @current-change="handlePageChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.movie-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  
  .filter-container {
    margin-bottom: 24px;
    
    .el-form {
      .el-form-item {
        margin-bottom: 16px;
      }
    }
  }
  
  .movie-card {
    margin-bottom: 24px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      
      .poster-overlay {
        opacity: 1;
      }
    }
    
    .poster-wrapper {
      position: relative;
      overflow: hidden;
      
      .poster {
        width: 100%;
        height: 360px;
        object-fit: cover;
        cursor: pointer;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
        }
      }
      
      .poster-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transition: opacity 0.3s;
      }
    }
    
    .movie-info {
      padding: 16px;
      
      .title {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        cursor: pointer;
        
        &:hover {
          color: #409eff;
        }
      }
      
      .meta {
        margin: 8px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .date {
          color: #909399;
          font-size: 14px;
        }
      }
      
      .tags {
        margin: 8px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .description {
        color: #606266;
        font-size: 14px;
        line-height: 1.6;
        height: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  
  .pagination {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  }
  
  .poster-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .poster-wrapper:hover .poster-overlay {
    opacity: 1;
  }
  
  .el-button.is-circle {
    margin: 0 4px;
  }
}
</style>
