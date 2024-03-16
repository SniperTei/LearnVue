<script setup>
import { getCategoryFilterAPI, getSubCategoryAPI } from '@/apis/category';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import GoodItem from '@/views/home/components/goodItem.vue';

const categoryData = ref([]);
const getFilterData = async () => {
  
  const id = useRoute().params.id;
  const res = await getCategoryFilterAPI(id);
  console.log("filter category res : ", res);
  categoryData.value = res.data.result;
};
onMounted(() => {
  getFilterData();
});
// 获取基础列表数据渲染
const goodList = ref([]);
const reqData = ref({
  page: 1,
  pageSize: 10,
  sortField: 'publishTime',
  categoryId: useRoute().params.id,
});
const getGoodsList = async () => {
  const res = await getSubCategoryAPI(reqData.value);
  console.log("sub category res : ", res);
  goodList.value = res.data.result.items;
};

onMounted(() => {
  getGoodsList();
});

// tab切换回调
const tabChange = () => {
  reqData.value.page = 1;
  getGoodsList();
};

// 加载更多
const scrollDisabled = ref(false);
const loadMore = async () => {
  reqData.value.page++;
  const res = await getSubCategoryAPI(reqData.value)
  goodList.value = [...goodList.value, ...res.data.result.items]
  // 加载完毕 停止监听
  if (res.data.result.items.length < reqData.value.pageSize) {
    scrollDisabled.value = true
  }
};

</script>

<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/category/${categoryData.parentId}` }">{{ categoryData.parentName }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ categoryData.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs v-model="reqData.sortField" @tab-change="tabChange">
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div class="body" v-infinite-scroll="loadMore" v-infinite-scroll-disabled="scrollDisabled">
         <!-- 商品列表-->
         <good-item v-for="item in goodList" :good="item" :key="item.id"></good-item>
          
      </div>
    </div>
  </div>

</template>



<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .goods-item {
    display: block;
    width: 220px;
    margin-right: 20px;
    padding: 20px 30px;
    text-align: center;

    img {
      width: 160px;
      height: 160px;
    }

    p {
      padding-top: 10px;
    }

    .name {
      font-size: 16px;
    }

    .desc {
      color: #999;
      height: 29px;
    }

    .price {
      color: $priceColor;
      font-size: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }


}
</style>