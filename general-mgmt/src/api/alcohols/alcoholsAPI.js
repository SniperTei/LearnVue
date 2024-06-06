import httpInstance from "@/utils/http"

export const getAlcoholListAPI = ({page, limit, condition}) => {
  return httpInstance({
    url: '/api/v1/alcohols/alcohol-list/',
    method: 'GET',
    params: {
      page,
      limit,
      condition
    }
  })
}