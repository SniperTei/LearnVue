import httpInstance from "@/utils/http"

export const getBookListAPI = ({page, limit}) => {
  return httpInstance({
    url: '/api/v1/books/book-list/',
    method: 'GET',
    params: {
      page,
      limit
    }
  })
}

export const getBookDetailAPI = ({bookId}) => {
  return httpInstance({
    url: `/api/v1/books/book-detail/${bookId}/`,
    method: 'GET'
  })
}