<script setup>
// import { ref } from 'vue'
</script>

<template>
  <div class="alcohol">
    <div class="alcohol-calendar">
      <el-calendar>
        <template #date-cell="{ data }">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
            {{ data.isSelected ? '✔️' : '' }}
          </p>
        </template>
      </el-calendar>
    </div>
    <div class="alcohol-datalist"></div>
  </div>
</template>

<style lang="scss" scoped>

</style>