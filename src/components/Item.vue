<template>
  <cell
    v-bind="cellProps"
    :display="config.display"
    :draggable="editable"
    @delete:content="$emit('delete:content')"
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
    // vue-layout-composer props
    initialConfig:      Object,
    editable:           Boolean,
    cellProps:          Object,

    // custom props
    content:            String,
    background:         String,
  },
  computed: {
    config() {
      return {
        ...this.initialConfig,
        hello: 'world'
      }
    },
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
