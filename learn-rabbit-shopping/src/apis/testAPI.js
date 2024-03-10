import httpInstance from "@/utils/http";

export function testAPI() {
  return httpInstance(
    {
      url: "home/category/head",
      method: "get",
    }
  )
}