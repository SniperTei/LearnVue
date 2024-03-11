import { ref, onMounted } from "vue";
import { getCategoryAPI } from "@/apis/category";
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

export function useCategory() {
  // 分类数据
  const categoryData = ref([]);
  // 拿参数用的
  const route = useRoute();
  const getCategory = async (id = route.params.id) => {
    const res = await getCategoryAPI(id);
    console.log(" category res : ", res);
    categoryData.value = res.data.result;
  };

  onMounted(() => {
    getCategory();
  });

  onBeforeRouteUpdate((to) => {
    const id = to.params.id;
    getCategory(id);
  });

  return { categoryData };
}