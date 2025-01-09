import http from '@/utils/http'

export const createTravelPlan = (data) => {
  return http.post('/api/v1/travel-plans/create', data)
}

export const getTravelPlans = (params) => {
  return http.get('/api/v1/travel-plans/list', { params })
}

export const getTravelPlan = (id) => {
  return http.get(`/api/v1/travel-plans/query/${id}`)
}

export const updateTravelPlan = (id, data) => {
  return http.put(`/api/v1/travel-plans/update/${id}`, data)
}

export const deleteTravelPlan = (id) => {
  return http.delete(`/api/v1/travel-plans/delete/${id}`)
}

export const publishTravelPlan = (id) => {
  return http.post(`/api/v1/travel-plans/publish/${id}`)
}

export const unpublishTravelPlan = (id) => {
  return http.post(`/api/v1/travel-plans/unpublish/${id}`)
}

export const getTravelPlanItinerary = (id) => {
  return http.get(`/api/v1/travel-plans/itinerary/${id}`)
}

export const updateTravelPlanItinerary = (id, data) => {
  return http.put(`/api/v1/travel-plans/itinerary/${id}`, data)
}

export const deleteTravelPlanItinerary = (id) => {
  return http.delete(`/api/v1/travel-plans/itinerary/${id}`)
}
