<template>
  <cell
    :key="config.id"
    :display="config.display"
    :id="config.id"
    :config="config"
    editable
  >
    <div class="Item" :style="style" @click="onClick">
      {{ content }}
    </div>
  </cell>
</template>

<script>
import Cell from './LayoutComposer/components/Layout/components/Cell'

export default {
  name: 'Item',
  components: {
    Cell,
  },
  props: {
    initialConfig:  Object,
    content:        String,
    background:     String,
  },
  data() {
    return {
      config: {},
    }
  },
  created() {
    this.config = {
      ...this.initialConfig,
      hello: 'world'
    }
  },
  computed: {
    style() {
      const { background } = this

      return {
        background,
      }
    }
  },
  methods: {
    getConfig() {
      return this.config
    },
    onClick() {
      console.log('clicked')
    }
  }
}
</script>

<style>
.Item {
  height: 100%;
  min-height: 50px;
  line-height: 50px;
}
</style>
