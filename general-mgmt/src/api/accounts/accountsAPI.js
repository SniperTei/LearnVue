import httpInstance from "@/utils/http"

export const loginAPI = ({username, password}) => {
  return httpInstance({
    url: '/api/v1/user/login/',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}