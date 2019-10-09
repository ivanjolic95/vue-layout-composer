<template>
  <div class="Layout"
    :class="classes"
    @mousemove="hovered = true"
    @mouseout="hovered = false"
  >
    <div
      class="Layout__move"
      v-if="config.id !== 0 && editable"
      @mouseenter.stop="moveHovered = true"
      @mouseleave.stop="moveHovered = false"
    >
      <font-awesome-icon icon="arrows-alt" />
      <span v-if="hovered || moveHovered">Move Layout</span>
    </div>
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
  data() {
    return {
      moveHovered:  false,
      hovered:      false,
    }
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
      const { id, props: { orientation } } = this.config
      const { editable, hovered, moveHovered } = this

      return {
        'Layout--move-hovered': id !== 0 && editable && (hovered || moveHovered),
        'Layout--horizontal':   orientation === 'horizontal',
        'Layout--vertical':     orientation === 'vertical',
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
