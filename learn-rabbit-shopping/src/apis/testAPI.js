import http from "@/utils/http";

export function testAPI() {
  return http(
    {
      url: "home/category/head",
      method: "get",
    }
  )
}