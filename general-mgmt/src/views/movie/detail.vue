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

const comments = [
  {
    id: 1,
    username: 'Sniper',
    comment: '这是一部好电影',
  },
  {
    id: 2,
    username: 'JYP',
    comment: '这是一部好电影2',
  }
]

const rate = 4

</script>

<template>
  <div class="movie-detail">
    <div class="movie-detail-info">
      <!-- 电影封面 -->
      <el-card class="box-card movie-img">
        <img src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561545034.jpg" class="image" />
      </el-card>
      <!-- 描述列表电影详情 -->
      <el-descriptions
        class="margin-top"
        title="电影详情"
        column="1"
        size="large"
        border
      >
        <el-descriptions-item label="电影名称">{{ movieDetail.title }}</el-descriptions-item>
        <el-descriptions-item label="导演">{{ movieDetail.director }}</el-descriptions-item>
        <el-descriptions-item label="演员">{{ movieDetail.actors }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ movieDetail.genre }}</el-descriptions-item>
        <el-descriptions-item label="地区">{{ movieDetail.country }}</el-descriptions-item>
        <el-descriptions-item label="上映日期">{{ movieDetail.release_date }}</el-descriptions-item>
        <el-descriptions-item label="评分">{{ movieDetail.rating }}</el-descriptions-item>
        <el-descriptions-item label="评分人数">{{ movieDetail.rating_count }}</el-descriptions-item>
        <el-descriptions-item label="简介">{{ movieDetail.summary }}</el-descriptions-item>
        <el-descriptions-item label="JYP是否看过">
          <el-button :type="movieDetail.jyp_viewed ? 'primary' : 'danger'" @click="jypViewedBtnClick">{{ movieDetail.jyp_viewed ? 'JYP看过' : 'JYP没看过' }}</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="Sniper是否看过">
          <el-button :type="movieDetail.sniper_viewed ? 'primary' : 'danger'" @click="snpViewedBtnClick">{{ movieDetail.sniper_viewed ? 'Sniper看过' : 'Sniper没看过' }}</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 评论 -->
    <div class="movie-comments">
      <div class="movie-comments-info">
        <!-- 用户头像 -->
        <div class="movie-comments-avatar">
          <el-avatar
            shape="square"
            size="large"
            src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561545034.jpg"
          ></el-avatar>
          <!-- 用户昵称 -->
          <div class="movie-comments-nickname">Sniper</div>
        </div>
        <!-- 评论内容 -->
        <div class="movie-comments-content">
          <el-card class="box-card movie-comment">
            <p>{{ comments[0].comment }}</p>
          </el-card>
        </div>
      </div>
      <!-- 时间 & 评分 -->
      <div class="movie-comments-time-rate">
        <el-tag type="info">2021-09-01 12:00:00</el-tag>
        <el-rate v-model="rate" disabled></el-rate>
      </div>
    </div>
    <!-- 快速发布评论 -->
    <el-card class="box-card movie-comment-write">
      <el-input
        type="textarea"
        autosize
        placeholder="请输入评论"
        v-model="comment"
      ></el-input>
      <el-button type="primary" @click="commentBtnClick">评论</el-button>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.movie-detail {
  width: 100%;
  .movie-detail-info {
    width: 100%;
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
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
  .movie-comments {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: aqua;
    margin-top: 10px;
    margin-bottom: 10px;
    .movie-comments-info {
      width: 100%;
      display: flex;
      background-color: blueviolet;
      .movie-comments-avatar {
        margin: 10px;
        background-color: chartreuse;
        width: 100px;
        .movie-comments-nickname {
          margin-top: 5px;
        }
      }
      .movie-comments-content {
        margin: 20px;
        .movie-comment {
          width: 100%;
        }
      }
    }
    .movie-comments-time-rate {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

</style>