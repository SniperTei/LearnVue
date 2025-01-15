import http from '@/utils/http'

// 电影管理 API
export const createMovie = (data) => {
  return http.post('/api/v1/movies/create', data)
}

export const getMovieList = (params = {}) => {
  return http.get('/api/v1/movies/list', { ...params })
}

export const getMovieDetail = (movieId) => {
  return http.get(`/api/v1/movies/query/${movieId}`)
}

export const updateMovie = (movieId, data) => {
  return http.put(`/api/v1/movies/update/${movieId}`, data)
}

export const deleteMovie = (movieId) => {
  return http.delete(`/api/v1/movies/delete/${movieId}`)
}

// 用户观影记录 API
export const getUserMovieRecord = (movieId) => {
  return http.get(`/api/v1/user-movies/query/${movieId}`)
}

export const getUserMovieList = (params) => {
  return http.get('/api/v1/user-movies/list', { params })
}

export const markAsWatched = (movieId, data) => {
  return http.post(`/api/v1/user-movies/watch/${movieId}`, data)
}

export const addToWantToWatch = (movieId) => {
  return http.post(`/api/v1/user-movies/want-to-watch/${movieId}`)
}

export const removeFromWantToWatch = (movieId) => {
  return http.delete(`/api/v1/user-movies/want-to-watch/${movieId}`)
}

export const toggleLike = (movieId) => {
  return http.post(`/api/v1/user-movies/toggle-like/${movieId}`)
}

export const updateRating = (movieId, data) => {
  return http.put(`/api/v1/user-movies/rating/${movieId}`, data)
}

export const updateReview = (movieId, data) => {
  return http.put(`/api/v1/user-movies/review/${movieId}`, data)
}

export const getUserMovieStats = () => {
  return http.get('/api/v1/user-movies/stats')
}
