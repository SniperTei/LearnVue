import httpInstance from "@/utils/http"

export const getDrinkListAPI = ({page, limit, condition}) => {
  return httpInstance({
    url: '/api/v1/drink/list/',
    method: 'GET',
    params: {
      page,
      limit,
      condition
    }
  })
}

export const addDrinkAPI = (data) => {
  return httpInstance({
    url: '/api/v1/drink/add/',
    method: 'POST',
    data
  })
}