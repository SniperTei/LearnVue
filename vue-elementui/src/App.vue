<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <PersonalZoneSelect :options="options" placement="top" effect="light" v-model="selectedValue"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import PersonalZoneSelect from './components/personalZoneSelect.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    PersonalZoneSelect
  },
  data() {
    return {
      options: [
        {
          value: '1',
          label: 'Option 1'
        },
        {
          value: '2',
          label: 'Option 2'
        },
        {
          value: '3',
          label: 'Option 3'
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
