<template>
  <div id="app">
    <Layout :config="config">
      <Layout orientation="horizontal">
        <Item background="red">This</Item>
        <Item background="green">is</Item>
        <Item background="blue">horizontal.</Item>
      </Layout>
      <Item background="yellow">This</Item>
      <Item background="cyan">is</Item>
      <Item background="magenta">vertical.</Item>
    </Layout>
  </div>
</template>

<script>
import layoutConfig from '../config/layout.json'
import Layout from './components/Layout.vue'
import Item from './components/Item.vue'

export default {
  name: 'app',
  components: {
    Layout,
    Item,
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
