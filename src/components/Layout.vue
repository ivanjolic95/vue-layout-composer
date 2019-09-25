<template>
  <div class="Layout" :class="classes">
    <Cell
      :display="child.display"
      v-for="child in children"
      :key="child.component"
    >
      <component
        v-bind="child.props"
        :config="child"
        :is="child.component" />
    </Cell>
  </div>
</template>

<script>
import Cell from './Cell'
import Item from './Item'

export default {
  name: 'Layout',
  components: {
    Cell,
    Item,
  },
  props: {
    config: Object,
  },
  computed: {
    classes() {
      if (!this.config) return ''
      const { props: { orientation } } = this.config

      return {
        'Layout--horizontal': orientation === 'horizontal',
        'Layout--vertical':   orientation === 'vertical',
      }
    },
    children() {
      return this.config.children || []
    }
  }
}
</script>

<style scoped>
.Layout {
  display: flex;
}

  .Layout--horizontal {
    flex-direction: row;
  }

  .Layout--vertical {
    flex-direction: column;
  }
</style>
