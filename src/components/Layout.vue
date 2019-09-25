<template>
  <div class="Layout"
    :class="classes"
    @dragover.prevent
    @drop.stop="onDrop($event)"
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
  data() {
    return {
      x:      0,
      y:      0,
      width:  0,
      height: 0,
    }
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
    onDrop(event) {
      event.preventDefault()
      const fakeEl = document.querySelector('.Layout_Cell--placeholder')
      const data = event.dataTransfer.getData("text")
      const el = document.getElementById(data)
      
      fakeEl.parentNode.insertBefore(el, fakeEl.nextSibling)
      fakeEl.remove()

      el.style.display = 'block'
    }
  }
}
</script>

<style scoped>
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
