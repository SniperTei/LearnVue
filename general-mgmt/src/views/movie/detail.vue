<script setup>
import { ref, onMounted } from 'vue'
// movie api
import { getMovieDetailAPI, updateMovieAPI } from '@/api/movies/moviesAPI'
import { useRoute } from 'vue-router'

const route = useRoute()

const movieDetail = ref({})
const getMovieDetail = async () => {
  console.log('getMovieDetail')
  let movieId = route.params.movieId
  console.log('movieId:', movieId)
  // 获取电影详情
  const res = await getMovieDetailAPI({ movieId: movieId})
  console.log('get movie detail res:', res)
  movieDetail.value = res.data.data
}

const updateMovie = async (movieDetailParam) => {
  // console.log('updateMovie : movieDetail.value:', movieDetailParam)
  // 更新电影
  const res = await updateMovieAPI(movieDetailParam)
  console.log('update movie res:', res)
  getMovieDetail()
}

const jypViewedBtnClick = () => {
  console.log('jypViewedBtnClick')
  let movieDetailParam = JSON.parse(JSON.stringify(movieDetail.value))
  console.log('movieDetailParam:', movieDetailParam)
  movieDetailParam.jyp_viewed = movieDetailParam.jyp_viewed ? 0 : 1;
  updateMovie(movieDetailParam)
}

const snpViewedBtnClick = () => {
  console.log('snpViewedBtnClick')
  let movieDetailParam = JSON.parse(JSON.stringify(movieDetail.value))
  movieDetailParam.sniper_viewed = movieDetailParam.sniper_viewed ? 0 : 1;
  updateMovie(movieDetailParam)
}

onMounted(() => {
  // 获取电影详情
  getMovieDetail()
})

</script>

<template>
  <div class="movie-detail">
    <!-- 电影封面 -->
    <el-card class="box-card movie-img">
      <img src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561545034.jpg" class="image" />
    </el-card>
    <!-- 电影详情 -->
    <el-card class="box-card movie-info">
      <template v-slot:header>
        <div  class="clearfix">
          <span>电影详情</span>
        </div>
      </template>
      <el-row class="movie-info-property">
        <el-col :span="8">电影名称：</el-col>
        <el-col :span="16">{{ movieDetail.title }}</el-col>
      </el-row>
      <el-row class="movie-info-property">
        <el-col :span="8">导演：</el-col>
        <el-col :span="16">{{ movieDetail.director }}</el-col>
      </el-row>
      <el-row class="movie-info-property">
        <el-col :span="8">演员：</el-col>
        <el-col :span="16">{{ movieDetail.actors }}</el-col>
      </el-row>
      <el-row class="movie-info-property">
        <el-col :span="8">类型：</el-col>
        <el-col :span="16">{{ movieDetail.genre }}</el-col>
      </el-row>
      <el-row class="movie-info-property">
        <el-col :span="8">地区：</el-col>
        <el-col :span="16">{{ movieDetail.country }}</el-col>
      </el-row>
      <el-row class="movie-info-property">
        <el-col :span="8">上映日期：</el-col>
        <el-col :span="16">{{ movieDetail.release_date }}</el-col>
      </el-row>
      <el-row class="movie-info-property">
        <el-col :span="8">评分:</el-col>
        <el-col :span="16">{{ movieDetail.rating }}</el-col>
      </el-row>
      <!-- JYP是否看过 el-button按钮 -->
      <el-button :type="movieDetail.jyp_viewed ? 'primary' : 'danger'" @click="jypViewedBtnClick">{{ movieDetail.jyp_viewed ? 'JYP看过' : 'JYP没看过' }}</el-button>
      <!-- Sniper是否看过 -->
      <el-button :type="movieDetail.sniper_viewed ? 'primary' : 'danger'" @click="snpViewedBtnClick">{{ movieDetail.sniper_viewed ? 'Sniper看过' : 'Sniper没看过' }}</el-button>
      <!-- <el-row class="movie-info-property">
        <el-col :span="8">是否看过:</el-col>
        <el-col :span="16">{{ movieDetail.jyp_viewed ? '看过' : '没看过' }}</el-col>
      </el-row> -->
      <!-- Sniper是否看过 -->
      <el-row class="movie-info-property">
        <el-col :span="8">是否看过:</el-col>
        <el-col :span="16">{{ movieDetail.sniper_viewed ? '看过' : '没看过' }}</el-col>
      </el-row>

    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.movie-detail {
  width: 100%;
  height: 100%;
  display: flex;
  .movie-img {
    width: 30%;
    margin: 20px;
    .image {
      width: 100%;
    }
  }
  .movie-info {
    width: 60%;
    margin: 20px;
    .movie-info-property {
      margin: 10px 0;
    }
  }
}

</style>