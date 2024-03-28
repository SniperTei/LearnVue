<template>
  <div class="error-page">
    <h1>Oops! Something went wrong.</h1>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  props: {
    errorMessage: {
      type: String,
      default: 'An error occurred.'
    }
  }
}
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  text-align: center;
  color: #333;
}
</style>