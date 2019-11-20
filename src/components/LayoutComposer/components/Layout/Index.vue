<template>
  <Cell
    :display="config.display"
    :id="config.id"
    :config="config"
    :editable="internalEditable"
    :key="config.id"
    :dragging="dragging"
  >
    <div class="Layout"
      :class="classes"
      @mousemove="hovered = true"
      @mouseout="hovered = false"
    >
      <div
        class="Layout__move"
        v-if="config.id !== 0 && internalEditable"
        @mouseenter.stop="moveHovered = true"
        @mouseleave.stop="moveHovered = false"
      >
        <font-awesome-icon icon="arrows-alt" />
        <span v-if="hovered || moveHovered">Move Layout</span>
      </div>

      <component
        v-for="child in children"
        v-bind="child.props"
        :id="child.id"
        :key="child.id"
        :editable="editable"
        :initialConfig="child"
        :is="getComponentName(child)"
        :dragging="dragging"
        @delete:content="deleteChild(child.id)" />
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
    initialConfig:      Object,
    displayComponents:  Object,
    editable:           Boolean,
    dragging:           Boolean,
  },
  data() {
    return {
      config:       _.cloneDeep(this.initialConfig),
      moveHovered:  false,
      hovered:      false,
    }
  },
  created() {
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize(1)
    if (!this.displayComponents) return
    Object.keys(this.displayComponents).forEach(name =>
      this.$layoutComposer.registerComponent(name, this.displayComponents[name])
    )
  },
  computed: {
    internalEditable() {
      if (this.config.id === 0) return false;
      return this.editable
    },
    classes() {
      if (!this.config) return ''
      const { id, props: { orientation } } = this.config
      const { internalEditable, hovered, moveHovered } = this

      return {
        'Layout--move-hovered': id !== 0 && internalEditable && (hovered || moveHovered),
        'Layout--horizontal':   orientation === 'horizontal',
        'Layout--vertical':     orientation === 'vertical',
      }
    },
    children() {
      return this.config.children || []
    },
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
        return _.cloneDeep(this.$children[0].$children.find(childComponent => childComponent.config.id === child.id).getConfig())
      })
    },
    getComponentName(config) {
      if (!config) return null
      if (config.component.indexOf('Layout') === -1)
        return this.$layoutComposer.getComponentName(config.component)
      else
        return config.component
    },
    onWindowResize() {
      if (window.innerWidth >= 600) {
        this.config.props.orientation = this.initialConfig.props.orientation
      } else {
        this.config.props.orientation = 'vertical'
      }
      LayoutUtils.addMargins(this.config)
    },
    deleteChild(childId) {
      LayoutUtils.removeCell(this.config, childId)
    },
  }
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
    background: #f0f0f0;
    cursor: grab;
  }

    .Layout--move-hovered .Layout _Cell {
      opacity: 0.2;
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
