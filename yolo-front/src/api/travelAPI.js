import http from '@/utils/http'

// Travel Plans APIs
export function getTravelPlans(params) {
  return http.get('/api/v1/travel-plans/list', { params })
}

export function getTravelPlanDetail(id) {
  return http.get(`/api/v1/travel-plans/query/${id}`)
}

export function createTravelPlan(data) {
  return http.post('/api/v1/travel-plans/create', data)
}

export function updateTravelPlan(id, data) {
  return http.put(`/api/v1/travel-plans/update/${id}`, data)
}

export function deleteTravelPlan(id) {
  return http.delete(`/api/v1/travel-plans/delete/${id}`)
}

export function publishTravelPlan(id) {
  return http.post(`/api/v1/travel-plans/publish/${id}`)
}

export function unpublishTravelPlan(id) {
  return http.post(`/api/v1/travel-plans/unpublish/${id}`)
}

// Travel Diaries APIs
export function getTravelDiaries(params) {
  return http.get('/api/v1/travel-diaries/list', { params })
}

export function getTravelDiaryDetail(id) {
  return http.get(`/api/v1/travel-diaries/query/${id}`)
}

export function createTravelDiary(data) {
  return http.post('/api/v1/travel-diaries/create', data)
}

export function updateTravelDiary(id, data) {
  return http.put(`/api/v1/travel-diaries/update/${id}`, data)
}

export function deleteTravelDiary(id) {
  return http.delete(`/api/v1/travel-diaries/delete/${id}`)
}

export function likeTravelDiary(id) {
  return http.post(`/api/v1/travel-diaries/like/${id}`)
}
