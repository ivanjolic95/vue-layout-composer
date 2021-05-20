<template>
  <Cell
    ref="cell"
    :key="config.id"
    :display="config.display"
    @delete:content="$emit('delete:content')"
  >
    <div
      class="Layout"
      :class="classes"
      @mousemove="hovered = true"
      @mouseout="hovered = false"
    >
      <div v-if="!config.children.length">
        {{ config.props.orientation }} layout
      </div>
      <div
        v-if="config.id !== 0 && internalEditable"
        class="Layout__move"
        @mouseenter.stop="moveHovered = true"
        @mouseleave.stop="moveHovered = false"
      >
        <font-awesome-icon icon="arrows-alt" />
        <span v-if="moveHovered">Move Layout</span>
      </div>

      <component
        :is="getComponentName(child)"
        v-for="child in children"
        :key="child.id"
        ref="customComponent"
        v-bind="child.props"
        :dragging="dragging"
        :editable="editable"
        :initial-config="child"
        @delete:content="deleteChild(child.id)"
      />
    </div>
  </Cell>
</template>

<script>
import _ from 'lodash'
import LayoutUtils from '../../utils/layout'

import Cell from './components/Cell'

export default {
  name: 'Layout',
  components: {
    Cell,
  },
  props: {
    // vue-layout-composer props
    initialConfig: Object,
    editable: Boolean,
    dragging: Boolean,

    // Layout props
    displayComponents: Object,
  },
  data() {
    return {
      config: _.cloneDeep(this.initialConfig),
      hovered: false,
      moveHovered: false,
    }
  },
  computed: {
    internalEditable() {
      if (this.config.id === 0) return false
      return this.editable
    },
    classes() {
      if (!this.config) return ''
      const {
        id,
        props: { orientation },
      } = this.config
      const { internalEditable, moveHovered } = this

      return {
        'Layout--empty': !this.config.children.length,
        'Layout--move-hovered': id !== 0 && internalEditable && moveHovered,
        'Layout--horizontal': orientation === 'horizontal',
        'Layout--vertical': orientation === 'vertical',
      }
    },
    children() {
      return this.config.children || []
    },
  },
  watch: {
    editable() {
      this.setCellsProps()
    },
    config() {
      this.setCellsProps()
    },
    dragging() {
      this.setCellsProps()
    },
  },
  created() {
    window.addEventListener('resize', this.configureForMobile)
    this.configureForMobile()
    if (!this.displayComponents) return
    Object.keys(this.displayComponents).forEach(name =>
      this.$layoutComposer.registerComponent(name, this.displayComponents[name])
    )
  },
  mounted() {
    this.setCellsProps()
  },
  methods: {
    configUpdate(newConfig) {
      this.config = newConfig
    },
    getConfig() {
      return {
        ...this.config,
        children: this.getChildrenConfigurations(),
      }
    },
    getChildrenConfigurations() {
      return this.config.children
        .map(child => {
          const component = this.$children[0].$children.find(childComponent => {
            const initialConfig = childComponent.initialConfig ||
              childComponent.$attrs['initial-config'] || { id: -1 }
            return initialConfig.id === child.id
          })
          return component && _.cloneDeep(component.getConfig())
        })
        .filter(Boolean)
    },
    configureForMobile() {
      if (window.innerWidth >= 600) {
        this.config.props.orientation = this.initialConfig.props.orientation
      } else {
        this.config.props.orientation = 'vertical'
      }
    },

    // cell methods
    getComponentName(config) {
      if (!config || !config.component) return null
      if (config.component.indexOf('Layout') === -1)
        return this.$layoutComposer.getComponentName(config.component)
      return `${config.component}`
    },
    getCellProps(config) {
      return {
        id: config.id,
        dragging: config.component === 'Layout' && this.dragging,
        layoutOrientation: this.config.props.orientation,
        isFirstChild:
          this.config.children && this.config.children[0].id === config.id,
      }
    },
    setCellsProps() {
      this.$children[0].$children.forEach(child => {
        const initialConfig = child.initialConfig ||
          child.$attrs['initial-config'] || { id: -1 }
        const config = this.config.children.find(
          childConfig => initialConfig.id === childConfig.id
        )
        if (config) this.setCellProps(child, config)
      })
    },
    setCellProps(component, config) {
      if (!component) return
      if (!component.$children) return
      // eslint-disable-next-line no-param-reassign
      component.$children[0].cellConfig = this.getCellProps(config)
      // eslint-disable-next-line no-param-reassign
      component.$children[0].draggable = this.editable
    },
    deleteChild(childId) {
      LayoutUtils.removeCell(this.config, childId)
    },
  },
}
</script>

<style>
.Layout {
  display: flex;
  padding: 0px;
  min-height: 50px;
  position: relative;
}

.Layout--empty {
  background: #ebf4ff;
  align-items: center;
  justify-content: center;
}

.Layout--horizontal {
  flex-direction: row;
}

.Layout--vertical {
  flex-direction: column;
}

.Layout--move-hovered {
  background: #ebf4ff;
  cursor: grab;
}

.Layout .Layout--move-hovered > .Layout__move {
  color: #284664;
}

.Layout .Layout__move {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 12px;
  z-index: 100;
  color: #c4c4c4;
  min-width: 50px;
  height: 20px;
  text-align: left;
}

.Layout .Layout__move span {
  margin-left: 2px;
}
</style>
