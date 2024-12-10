import httpInstance from "@/utils/http"

export const getFoodListAPI = ({page, limit, condition}) => {
  return httpInstance({
    url: '/api/v1/food/list/',
    method: 'GET',
    params: {
      page,
      limit,
      condition
    }
  })
}

// export const getBookDetailAPI = ({bookId}) => {
//   return httpInstance({
//     url: `/api/v1/books/book-detail/${bookId}/`,
//     method: 'GET'
//   })
// }