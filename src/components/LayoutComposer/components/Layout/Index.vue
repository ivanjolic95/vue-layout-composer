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
      <div
        v-if="config.id !== 0 && internalEditable"
        class="Layout__move"
        @mouseenter.stop="moveHovered = true"
        @mouseleave.stop="moveHovered = false"
      >
        <font-awesome-icon icon="arrows-alt" />
        <span v-if="moveHovered">Move Layout</span>
      </div>

      <custom-component
        v-for="child in children"
        :key="child.id"
        :config="child"
        :parent="config"
        :dragging="dragging"
        :editable="editable"
      />
    </div>
  </Cell>
</template>

<script>
import _ from 'lodash'

import Cell from './components/Cell'
import CustomComponent from './components/CustomComponent'

export default {
  name: 'Layout',
  components: {
    Cell,
    CustomComponent,
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
        'Layout--move-hovered': id !== 0 && internalEditable && moveHovered,
        'Layout--horizontal': orientation === 'horizontal',
        'Layout--vertical': orientation === 'vertical',
      }
    },
    children() {
      return this.config.children || []
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
      return this.config.children.map(child => {
        let component = this.$children[0].$children.find(
          childComponent => childComponent.config.id === child.id
        )
        if (component.$options.name === 'CustomComponent') {
          // eslint-disable-next-line prefer-destructuring
          component = component.$children[0]
        }
        return _.cloneDeep(component.getConfig())
      })
    },
    configureForMobile() {
      if (window.innerWidth >= 600) {
        this.config.props.orientation = this.initialConfig.props.orientation
      } else {
        this.config.props.orientation = 'vertical'
      }
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

.Layout--horizontal {
  flex-direction: row;
}

.Layout--vertical {
  flex-direction: column;
}

.Layout--move-hovered {
  background: #03a696;
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
