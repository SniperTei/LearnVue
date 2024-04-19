<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <ZNSelect :options="options" placement="top" effect="light" v-model="selectedValue"/>
    select value is : {{ selectedValue }}
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import ZNSelect from './components/ZNSelect.vue';

export default {
  name: 'App',
  components: {
    ZNSelect
  },
  data() {
    return {
      options: [
        {
          value: '1',
          label: 'Option 1',
          name: '选项1'
        },
        {
          value: '2',
          label: 'Option 2',
          name: '选项2'
        },
        {
          value: '3',
          label: 'Option 3',
          name: '选项3'
        }
      ],
      selectedValue: '2'
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
