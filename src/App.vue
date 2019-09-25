<template>
  <div id="app">
    <Layout
      :config="config"
      :id="config.id"
      v-bind="config.props"
    />
  </div>
</template>

<script>
import layoutConfig from '../config/layout.json'
import { addIds } from './utils/layout.js'
import Layout from './components/Layout.vue'

export default {
  name: 'app',
  components: {
    Layout,
  },
  data() {
    addIds(layoutConfig)

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
