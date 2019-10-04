<template>
  <div
    class="Layout_Cell"
    :class="classes"
    :style="style"
    :id="`cell-${id}`"
    @mousemove.stop="hovered = true"
    @mouseout="hovered = false"
    :draggable="editable"
    @dragstart="onDragStart($event)"
    @drag="onDrag($event)"
    @dragend="onDragEnd($event)"
  >
    <!-- <span class="Layout_Cell__id" v-if="editable">{{id}}</span> -->
    <slot />
  </div>
</template>

<script>
import UiUtils from '../../../../utils/ui'

export default {
  name: 'Cell',
  props: {
    id:       Number,
    display:  Object,
    editable: Boolean,
  },
  data() {
    return {
      targetEl:             null,
      lastLayoutEl:         null,
      lastLayoutComponent:  null,
      placeholderEl:        null,
      mousePosInElX:        0,
      mousePosInElY:        0,
      hovered:              false,
    }
  },
  computed: {
    style() {
      if (!this.display) return {}

      const {
        weight: flexGrow,
        marginTop,
        marginLeft,
      } = this.display

      return {
        flexGrow,
        marginTop,
        marginLeft,
      }
    },
    classes() {
      const { hovered, editable } = this

      return {
        'Layout_Cell--hovered': hovered && editable,
      }
    }
  },
  methods: {
    setMousePositionInDraggedElement(event) {
      const rect = event.target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const dragAreaTreshold = 10

      this.mousePosInElX = x > dragAreaTreshold ? dragAreaTreshold : x
      this.mousePosInElY = y > dragAreaTreshold ? dragAreaTreshold : y
    },
    createPlaceholderElement() {
      const { targetEl } = this

      const $placeholderText = document.createElement('p')
      $placeholderText.style.lineHeight = `${targetEl.clientHeight}px`
      $placeholderText.style.textAlign = 'center'
      $placeholderText.style.marginTop = '0px'
      $placeholderText.style.marginBottom = '0px'
      $placeholderText.innerText = 'Drop here!'

      const $cellChild = targetEl.children[0].cloneNode(false)
      const $placeholderChild = document.createElement('div')
      $placeholderChild.prepend($placeholderText)
      $placeholderChild.style.height = `${targetEl.clientHeight}px`
      $placeholderChild.style.width = '100%'
      $placeholderChild.style.display = 'block'

      const $placeholderEl = document.createElement('div')
      $placeholderEl.addEventListener('dragover', function(e) {
         e.preventDefault()
      })
      $placeholderEl.className = 'Layout_Cell--placeholder'
      $placeholderEl.style.flexGrow = targetEl.style.flexGrow
      $placeholderEl.style.minHeight = `${targetEl.clientHeight}px`
      $placeholderEl.style.maxHeight = `${targetEl.clientHeight}px`
      $placeholderEl.prepend($placeholderChild)

      this.placeholderEl = $placeholderEl
    },
    onDragStart(event) {
      if (!this.editable) return
      this.targetEl = event.target

      this.setMousePositionInDraggedElement(event)

      event.dataTransfer.setData('text/plain', this.targetEl.id)

      this.createPlaceholderElement()
    },
    getUnderlyingLayoutEl(startX, startY) {
      const LAYOUT_CLASS = 'Layout'
      return document
        .elementsFromPoint(startX, startY)
        .find(el => el.className.indexOf(`${LAYOUT_CLASS} `) !== -1)
    },
    setLayoutComponent($layoutEl) {
      let $currEl = $layoutEl
      let layoutComponent
      while ($currEl) {
        if ($currEl.__vue__) {
          layoutComponent = $currEl.__vue__
          $currEl = null
        } else {
          $currEl = $layoutEl.parentNode
        }
      }

      if (layoutComponent) this.lastLayoutComponent = layoutComponent
      if ($layoutEl) this.lastLayoutEl = $layoutEl
    },
    getSiblingsFromLayout() {
      const { targetEl, lastLayoutEl } = this
      return lastLayoutEl && [ ...lastLayoutEl.children ].filter($el => {
        return $el.__vue__ && $el.__vue__.id !== targetEl.__vue__.id
      }) || []
    },
    appendPlaceholderToDOM($siblings, startX, startY) {
      const BIG_NUMBER = 100000000000
      const CELL_PLACEHOLDER_CLASS = '.Layout_Cell--placeholder'
      const {
        targetEl,
        placeholderEl,
        lastLayoutComponent,
        lastLayoutEl,
      } = this

      let minDistance = BIG_NUMBER
      let $childBeforeEl = null
      $siblings.forEach($el => {
        let { x, y } = $el.getBoundingClientRect()

        if (lastLayoutComponent.$attrs.orientation === 'horizontal') {
          placeholderEl.style.marginTop = '0px'
          placeholderEl.style.marginLeft = '8px'

          if ($el.previousSibling && $el.previousSibling.className && $el.previousSibling.className.indexOf('move')) {
            x += $el.clientWidth / 2
          }
          if (x < startX && minDistance > (startX - x)) {
            minDistance = startX - x
            $childBeforeEl = $el
          }
        }
        else if (lastLayoutComponent.$attrs.orientation === 'vertical') {
          placeholderEl.style.marginTop = '8px'
          placeholderEl.style.marginLeft = null

          if ($el.previousSibling && $el.previousSibling.className && $el.previousSibling.className.indexOf('move')) {
            y += $el.clientHeight / 2
          }
          if (y < startY && minDistance > (startY - y)) {
            minDistance = startY - y
            $childBeforeEl = $el
          }
        }
      })

      if ($childBeforeEl && ($childBeforeEl.nextSibling === targetEl && targetEl.style.display && targetEl.style.display !== 'none')) return

      [...document.querySelectorAll(CELL_PLACEHOLDER_CLASS)].forEach(el => el.remove())
      targetEl.style.display = 'none'

      $childBeforeEl && $childBeforeEl.parentNode.insertBefore(placeholderEl, $childBeforeEl.nextSibling)
      !$childBeforeEl && lastLayoutEl.prepend(placeholderEl)

      if (lastLayoutComponent.$attrs.orientation === 'horizontal') {
        placeholderEl.style.marginTop = '0px'
        placeholderEl.style.marginBottom = '0px'
        if (!placeholderEl.previousSibling) {
          placeholderEl.style.marginLeft = '0px'
          if (placeholderEl.nextSibling) {
            placeholderEl.style.marginRight = '8px'
          }
        } else {
          if (placeholderEl.nextSibling) {
            placeholderEl.style.marginRight = '0px'
          }
        }
      } else {
        placeholderEl.style.marginLeft = '0px'
        placeholderEl.style.marginRight = '0px'
        if (!placeholderEl.previousSibling) {
          placeholderEl.style.marginTop = '0px'
          if (placeholderEl.nextSibling) {
            placeholderEl.style.marginRight = '0px'
            placeholderEl.style.marginBottom = '8px'
          }
        } else {
          if (placeholderEl.nextSibling) {
            placeholderEl.style.marginBottom = '0px'
          }
        }
      }
    },
    onDrag(event) {
      if (!this.editable) return
      const startX = event.clientX - this.mousePosInElX
      const startY = event.clientY - this.mousePosInElY

      const $layoutEl = this.getUnderlyingLayoutEl(startX, startY)

      this.setLayoutComponent($layoutEl)
      
      const $siblings = this.getSiblingsFromLayout()
    
      this.appendPlaceholderToDOM($siblings, startX, startY)
    },
    onDragEnd(event) {
      if (!this.editable) return
      const CELL_PLACEHOLDER_CLASS = '.Layout_Cell--placeholder';
      const { targetEl, placeholderEl } = this;

      [...document.querySelectorAll(CELL_PLACEHOLDER_CLASS)].forEach(el => el.remove())
      if (targetEl) targetEl.style.display = 'block'
    }
  }
}
</script>

<style>
.Layout_Cell, .Layout_Cell--placeholder {
  position: relative;
  flex-grow: 1;
  margin: 0;
  flex-basis: 0;
}

.Layout_Cell--hovered {
  cursor: grab;
  background: #ccc;
  opacity: 0.5;
}

.Layout_Cell--placeholder {
  background: #03A696;
  color: #fff;
}

  .Layout_Cell__id {
    position: absolute;
    top: 2px;
    left: 2px;
    font-size: 10px;
  }
</style>
