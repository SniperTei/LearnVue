<template>
  <div class="business-item" @click="$emit('click')">
    <div class="item-content">
      <div class="item-info">
        <div class="item-title">{{ item.title }}</div>
        <div class="item-tag">{{ item.tag }}</div>
      </div>
      <div class="item-image">
        <img :src="item.image" :alt="item.title" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 定义组件属性
defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      tag: '',
      image: ''
    })
  }
});
</script>

<style lang="scss" scoped>
// @import '../../styles/variables.scss';
@use '../../styles/variables.scss' as *;

.business-item {
  background-color: $bg-primary;
  border-radius: $border-radius;
  margin-bottom: $spacing-small;
  padding: $spacing-base;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:active {
    background-color: #f5f5f5;
  }

  .item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .item-info {
      flex: 1;
      margin-right: $spacing-base;

      .item-title {
        font-size: 16px;
        font-weight: 500;
        color: $text-primary;
        margin-bottom: 4px;
      }

      .item-tag {
        font-size: 12px;
        color: $primary-color;
      }
    }

    .item-image {
      width: 80px;
      height: 80px;
      background-color: $bg-secondary;
      border-radius: $border-radius-small;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
