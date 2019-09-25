<template>
  <div id="app">
    <Layout :config="config" />
  </div>
</template>

<script>
import layoutConfig from '../config/layout.json'
import layoutUtils from './utils/layout.js'
import Layout from './components/Layout.vue'

export default {
  name: 'app',
  components: {
    Layout,
  },
  data() {
    return {
      config: layoutConfig,
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
