<template>
  <div id="app">
    <layout-composer-actions
      :editable="editable"
      @change:state="editable = $event"
    />

    <layout-composer
      :display-components="displayComponents"
      :config="config"
      :editable="editable"
      @move:cell="onConfigChange"
      @lock="onConfigChange"
    />
  </div>
</template>

<script>
import config from '../config/layout.json'
import LayoutComposer from './components/LayoutComposer'

import LayoutComposerActions from './components/LayoutComposerActions'
import Item from './components/Item'

export default {
  name: 'App',
  components: {
    LayoutComposer,
    LayoutComposerActions,
  },
  data() {
    return {
      displayComponents: {
        Item,
      },
      config,
      editable: false,
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
