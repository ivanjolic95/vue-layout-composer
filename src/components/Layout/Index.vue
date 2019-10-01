<template>
  <div class="Layout"
    :class="classes"
  >
    <Cell
      :display="child.display"
      v-for="child in children"
      :id="child.id"
      :key="child.id"
    >
      <component
        v-bind="child.props"
        :id="child.id"
        :config="child"
        :is="child.component" />
    </Cell>
  </div>
</template>

<script>
import Cell from './components/Cell'
import Item from './components/Item'

import UiUtils from './utils/ui'

export default {
  name: 'Layout',
  components: {
    Cell,
    Item,
  },
  props: {
    config: Object,
  },
  data() {
    return {
      x:      0,
      y:      0,
      width:  0,
      height: 0,
    }
  },
  mounted() {
    if (window.documentHasDropListener) return

    document.addEventListener('dragover', (event) => {
      event.preventDefault()
    })

    document.addEventListener('drop', (event) => {
      const cellId = event.dataTransfer.getData("text")

      UiUtils.moveCellToPlaceholderPosition(cellId)
    })

    window.documentHasDropListener = true
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
}
</script>

<style>
.Layout {
  display: flex;
  box-sizing: border-box;
  border: 2px solid #0f0;
  padding: 15px;
  background: #000;
}

  .Layout--horizontal {
    flex-direction: row;
  }

  .Layout--vertical {
    flex-direction: column;
  }
</style>
