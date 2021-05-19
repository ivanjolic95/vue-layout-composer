<template>
  <component
    :is="getComponentName(config)"
    ref="customComponent"
    v-bind="config.props"
    :dragging="dragging"
    :editable="editable"
    :initial-config="config"
    @delete:content="deleteChild(config.id)"
  />
</template>

<script>
import LayoutUtils from '../../../../utils/layout'

export default {
  name: 'CustomComponent',
  props: {
    config: {
      type: Object,
      required: true,
    },
    parent: {
      type: Object,
      required: true,
    },
    dragging: {
      type: Boolean,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    cellProps() {
      const { config, parent, siblings, dragging } = this
      return {
        id: config.id,
        dragging: config.component === 'Layout' && dragging,
        layoutOrientation: parent.props.orientation,
        isFirstChild: siblings[0].id === config.id,
      }
    },
    siblings() {
      return this.parent.children || []
    },
  },
  mounted() {
    this.setCellProps()
  },
  watch: {
    cellProps() {
      this.setCellProps()
    },
    editable() {
      this.setCellProps()
    },
  },
  methods: {
    setCellProps() {
      if (!this.$refs.customComponent) return
      if (!this.$refs.customComponent.$children) return
      this.$refs.customComponent.$children[0].cellConfig = this.cellProps
      this.$refs.customComponent.$children[0].draggable = this.editable
    },
    getComponentName(config) {
      if (!config || !config.component) return null
      if (config.component.indexOf('Layout') === -1)
        return this.$layoutComposer.getComponentName(config.component)
      return `Lc${config.component}`
    },
    deleteChild(childId) {
      LayoutUtils.removeCell(this.config, childId)
    },
  },
}
</script>
