<template>
  <div id="app">
    <layout-composer
      :displayComponents="displayComponents"
      :config="config"
      @change:config="onConfigChange"
      editable
    />
  </div>
</template>

<script>
import config from '../config/layout.json'
import LayoutComposer from './components/LayoutComposer'

import Item from './components/Item'

export default {
  name: 'app',
  components: {
    LayoutComposer,
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
    onConfigChange(newConfig) {
      console.log(newConfig)
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
