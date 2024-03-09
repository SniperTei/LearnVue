<script setup>
import LayoutNav from '@/views/layout/components/layoutNav.vue';
import LayoutHeader from '@/views/layout/components/layoutHeader.vue';
import LayoutFooter from '@/views/layout/components/layoutFooter.vue';
// import LayoutFixed from './components/LayoutFixed.vue'

// import { useCategoryStore } from '@/stores/categoryStore';
import { onMounted } from 'vue';

// const categoryStore = useCategoryStore()
onMounted(() => {
    // categoryStore.getCategory()
})

</script>
<template>
    <!-- <LayoutFixed></LayoutFixed> -->
    <LayoutNav></LayoutNav>
    <LayoutHeader></LayoutHeader>
    <RouterView></RouterView>
    <LayoutFooter></LayoutFooter>
</template>