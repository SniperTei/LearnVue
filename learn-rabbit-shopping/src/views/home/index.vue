<script setup>
import HomeCategory from '@/views/home/components/homeCategory.vue';
import HomeBanner from '@/views/home/components/homeBanner.vue';
import HomeNew from '@/views/home/components/homeNew.vue';
import HomeHot from '@/views/home/components/homeHot.vue';
import HomeProduct from '@/views/home/components/homeProduct.vue';

</script>
<template>
    <div class="container">
      <HomeCategory />
      <HomeBanner />
      <HomeNew></HomeNew>
      <HomeHot></HomeHot>
      <HomeProduct></HomeProduct>
    </div>
</template>

<style scoped lang='scss'>

</style>