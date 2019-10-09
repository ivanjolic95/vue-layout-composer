<template>
  <div id="app">
    <LayoutComposer
      :displayComponents="displayComponents"
      :config="config"
      @change:config="onConfigChange($event)"
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
