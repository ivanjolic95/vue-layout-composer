<template>
  <cell
    :key="config.id"
    :display="config.display"
    :id="config.id"
    :config="config"
    :editable="editable"
    :layout-orientation="layoutOrientation"
    :is-first-child="isFirstChild"
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
    initialConfig:      Object,
    content:            String,
    background:         String,
    editable:           Boolean,
    layoutOrientation:  String,
    isFirstChild:       Boolean,
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
