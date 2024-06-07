import httpInstance from "@/utils/http"

export const getDrinkListAPI = ({page, limit, condition}) => {
  return httpInstance({
    url: '/api/v1/drinks/drink-list/',
    method: 'GET',
    params: {
      page,
      limit,
      condition
    }
  })
}