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
export const updateMovieAPI = ({movieId, params}) => {
  return httpInstance({
    url: `/api/v1/movies/movie-detail/${movieId}/`,
    method: 'PUT',
    params
  })
}