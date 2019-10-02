<template>
  <div class="Layout"
    :class="classes"
  >
    <Cell
      :display="child.display"
      v-for="child in children"
      :id="child.id"
      :key="child.id"
      :editable="editable"
    >
      <component
        v-bind="child.props"
        :id="child.id"
        :config="child"
        :editable="editable"
        :is="getComponentName(child)" />
    </Cell>
  </div>
</template>

<script>
import Cell from './components/Cell'

export default {
  name: 'Layout',
  components: {
    Cell,
  },
  props: {
    config:             Object,
    displayComponents:  Object,
    editable:           Boolean,
  },
  created() {
    if (!this.displayComponents) return
    Object.keys(this.displayComponents).forEach(name =>
      this.$metodaGrid.registerComponent(name, this.displayComponents[name])
    )
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
  },
  methods: {
    getComponentName(config) {
      if (config.component.indexOf('Layout') === -1)
        return this.$metodaGrid.getComponentName(config.component)
      else
        return config.component
    },
  }
}
</script>

<style>
.Layout {
  display: flex;
  box-sizing: border-box;
  border: 1px solid #E6E7E8;
  padding: 5px;
  min-height: 50px;
}

  .Layout--horizontal {
    flex-direction: row;
  }

  .Layout--vertical {
    flex-direction: column;
  }
</style>
