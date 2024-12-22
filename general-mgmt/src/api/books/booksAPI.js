import httpInstance from "@/utils/http"

export const getBookListAPI = ({page, limit, condition}) => {
  return httpInstance({
    url: '/api/v1/book/list/',
    method: 'GET',
    params: {
      page,
      limit,
      condition
    }
  })
}

export const getBookDetailAPI = ({bookId}) => {
  return httpInstance({
    url: `/api/v1/book/detail/${bookId}/`,
    method: 'GET'
  })
}
// 新增图书
export const createBookAPI = ({data}) => {
  return httpInstance({
    url: '/api/v1/book/add/',
    method: 'POST',
    data
  })
}

// 编辑图书
export const updateBookAPI = ({bookId, data}) => {
  return httpInstance({
    url: `/api/v1/book/update/${bookId}/`,
    method: 'PUT',
    data
  })
}

// 删除图书
export const deleteBookAPI = ({bookId}) => {
  return httpInstance({
    url: `/api/v1/book/delete/${bookId}/`,
    method: 'POST'
  })
}