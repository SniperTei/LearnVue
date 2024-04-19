<template>
  <div>
    <h1>Welcome to the Test Page!</h1>
    <p>This is a test page in your Vue application.</p>
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  mounted() {
    console.log('Test page mounted.');
  },
  data() {
    return {
      message: 'Hello, World!'
    }
  },
  methods: {
    showMessage() {
      alert(this.message);
    }
  }
}
</script>

<style scoped>
h1 {
  color: blue;
}
p {
  font-size: 18px;
}
</style>