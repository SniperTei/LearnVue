import httpInstance from "@/utils/http"

export const getBookListAPI = ({page, limit, book}) => {
  return httpInstance({
    url: '/api/v1/books/book-list/',
    method: 'GET',
    params: {
      page,
      limit,
      book
    }
  })
}

export const getBookDetailAPI = ({bookId}) => {
  return httpInstance({
    url: `/api/v1/books/book-detail/${bookId}/`,
    method: 'GET'
  })
}