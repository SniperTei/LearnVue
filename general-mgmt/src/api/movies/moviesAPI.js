import httpInstance from "@/utils/http"

export const getMovieListAPI = ({page, limit, condition}) => {
  return httpInstance({
    url: '/api/v1/movies/movie-list/',
    method: 'GET',
    params: {
      page,
      limit,
      condition
    }
  })
}

export const getMovieDetailAPI = ({movieId}) => {
  return httpInstance({
    url: `/api/v1/movies/movie-detail/${movieId}/`,
    method: 'GET'
  })
}

// 修改movie
export const updateMovieAPI = (params) => {
  console.log('params: ', params)
  return httpInstance({
    url: `/api/v1/movies/movie-update/${params.movieId}/`,
    method: 'PUT',
    params
  })
}

// 删除movie
// export const deleteMovieAPI = ({movieId}) => {
//   return httpInstance({
//     url: `/api/v1/movies/movie-delete/${movieId}/`,
//     method: 'DELETE'
//   })
// }
export const deleteMovieAPI = ({movieId}) => {
  return httpInstance({
    url: `/api/v1/movies/movie-delete/${movieId}/`,
    method: 'POST'
  })
}