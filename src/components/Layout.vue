<template>
  <div class="Layout" :class="classes">
    <component
      v-for="child in children"
      v-bind="child.props"
      :config="child"
      :is="child.component"
      :key="child.component" />
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'Layout',
  components: {
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