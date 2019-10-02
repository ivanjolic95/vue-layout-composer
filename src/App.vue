<template>
  <div id="app">
    <MetodaGrid
      :displayComponents="displayComponents"
      :config="config"
      @change:config="onConfigChange($event)"
      editable
    />
  </div>
</template>

<script>
import config from '../config/layout.json'
import MetodaGrid from './components/MetodaGrid'

import Item from './components/Item'

export default {
  name: 'app',
  components: {
    MetodaGrid,
  },
  data() {
    return {
      displayComponents: {
        'Item': Item,
      },
      config,
    }
  },
  methods: {
    onConfigChange(event) {
      console.log(event)
    },
  },
}
</script>

<style>
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
