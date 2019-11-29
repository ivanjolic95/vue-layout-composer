<template>
  <div
    :id="`cell-${id}`"
    ref="cell"
    class="Layout_Cell"
    :class="classes"
    :style="style"
    :draggable="draggable"
    @mousemove.stop="onMouseMove"
    @mouseout.stop="hovered = false"
    @drag.stop="$emit('internal:drag', $event)"
    @dragstart="$emit('internal:dragstart', $event)"
    @dragend.stop="$emit('internal:dragend', $event)"
  >
    <div v-if="draggable" class="Layout_Cell__actions">
      <span
        v-if="$parent.$options.name !== 'Layout'"
        class="Layout_Cell__edit"
        @click="$emit('edit:content')"
        ><font-awesome-icon icon="edit"
      /></span>
      <span
        v-if="
          $parent.$options.name !== 'Layout' || !$parent.config.children.length
        "
        class="Layout_Cell__delete"
        @click="$emit('delete:content')"
        ><font-awesome-icon icon="trash"
      /></span>
    </div>
    <!-- <span class="Layout_Cell__id" v-if="draggable">{{id}}</span> -->
    <slot />
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */

import UiUtils from '../../../../utils/ui'
import LayoutUtils from '../../../../utils/layout'

import EventBus from '../../../../eventBus'

export default {
  name: 'Cell',
  props: {
    // set by Layout component
    id: Number,
    dragging: Boolean,
    layoutOrientation: String,
    isFirstChild: Boolean,

    // user controlled
    display: Object,
    draggable: Boolean,
  },
  data() {
    return {
      targetEl: null,
      parentLayoutComponent: null,
      prevParentId: null,
      lastLayoutEl: null,
      lastLayoutComponent: null,
      placeholderEl: null,
      mousePosInElX: 0,
      mousePosInElY: 0,
      hovered: false,
      dropped: false,
    }
  },
  computed: {
    internalConfig() {
      return this.config
    },
    style() {
      let marginTop
      let marginLeft
      if (this.layoutOrientation) {
        if (this.layoutOrientation === 'horizontal') {
          marginLeft = this.isFirstChild ? '0px' : '8px'
        } else {
          marginTop = this.isFirstChild ? '0px' : '8px'
        }
      }

      if (!this.display)
        return {
          marginTop,
          marginLeft,
        }

      const { weight: flexGrow } = this.display

      return {
        flexGrow,
        marginTop,
        marginLeft,
      }
    },
    classes() {
      const { draggable, hovered, dragging, dropped } = this

      return {
        'Layout_Cell--hovered': draggable && hovered,
        'Layout_Cell--dragging': dragging,
        'Layout_Cell--dropped': dropped,
      }
    },
  },
  watch: {
    dragging(newValue) {
      this.dropped = !newValue
    },
  },
  created() {
    this.parentLayoutComponent = this.$parent.$parent.$parent

    if (/firefox/i.test(navigator.userAgent)) {
      document.addEventListener('dragover', event => {
        this.onDrag(event)
      })
      this.$on('internal:dragend', () => {
        setTimeout(() => {
          this.onDragEnd()
        }, 10)
      })
    } else {
      this.$on('internal:dragend', this.onDragEnd.bind(this))
      this.$on('internal:drag', this.onDrag)
    }
    this.$on('internal:dragstart', this.onDragStart)

    EventBus.$on('global:dragend', () => {
      this.hovered = false
    })
  },
  methods: {
    onMouseMove() {
      this.hovered = !window.isDragging
    },
    setMousePositionInDraggedElement(event) {
      const rect = event.target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const dragAreaTreshold = 10

      this.mousePosInElX = x > dragAreaTreshold ? dragAreaTreshold : x
      this.mousePosInElY = y > dragAreaTreshold ? dragAreaTreshold : y
    },
    createPlaceholderElement() {
      const { targetEl, placeholderEl } = this

      if (placeholderEl) return

      const $placeholderText = document.createElement('p')
      $placeholderText.style.width = '100%'
      $placeholderText.style.textAlign = 'center'
      $placeholderText.style.marginTop = '0px'
      $placeholderText.style.marginBottom = '0px'
      $placeholderText.style.position = 'absolute'
      $placeholderText.style.top = '50%'
      $placeholderText.style.transform = 'translateY(-50%)'
      $placeholderText.innerText = 'Drop here!'

      const $placeholderChild = document.createElement('div')
      $placeholderChild.prepend($placeholderText)
      const child = [...targetEl.children].filter(
        el => el.className.indexOf('Layout_Cell__actions') === -1
      )[0]
      $placeholderChild.style.height = '100%'
      $placeholderChild.style.minHeight = window
        .getComputedStyle(child)
        .getPropertyValue('min-height')
      $placeholderChild.style.display = 'block'

      const $placeholderEl = document.createElement('div')
      $placeholderEl.addEventListener('dragover', e => {
        e.preventDefault()
      })
      $placeholderEl.className = 'Layout_Cell--placeholder'
      $placeholderEl.style.opacity = 1
      $placeholderEl.style.flexGrow = targetEl.style.flexGrow || '1'
      $placeholderEl.prepend($placeholderChild)

      this.placeholderEl = $placeholderEl
    },
    onDragStart(event) {
      if (!this.draggable || window.isDragging) return
      window.isDragging = true
      this.targetEl = event.target
      window.targetEl = this.targetEl
      this.prevParentId = UiUtils.getParentId(event.target)

      this.setMousePositionInDraggedElement(event)

      event.dataTransfer.setData('text/plain', this.targetEl.id)

      this.createPlaceholderElement()
    },
    getUnderlyingLayoutEl(startX, startY) {
      const LAYOUT_CLASS = 'Layout'
      return document
        .elementsFromPoint(startX, startY)
        .find(
          el =>
            el.className &&
            typeof el.className.indexOf === 'function' &&
            el.className.indexOf(`${LAYOUT_CLASS} `) !== -1
        )
    },
    setLayoutComponent($layoutEl) {
      let $currEl = $layoutEl
      let layoutComponent
      while ($currEl) {
        if ($currEl.__vue__) {
          if ($currEl.__vue__.$options.name === 'Cell')
            layoutComponent = $currEl.__vue__.$parent
          else layoutComponent = $currEl.__vue__
          $currEl = null
        } else {
          $currEl = $currEl.parentNode
        }
      }

      if (layoutComponent) this.lastLayoutComponent = layoutComponent
      if ($layoutEl) this.lastLayoutEl = $layoutEl
    },
    emphasizeCurrentLayout() {
      const EMPHASIZE_CELL_CLASS = '.Layout_Cell--emphasized'
      ;[...document.querySelectorAll(EMPHASIZE_CELL_CLASS)].forEach(el => {
        // eslint-disable-next-line no-param-reassign
        el.className = el.className.replace(/Layout_Cell--emphasized/, '')
      })
      if (!this.lastLayoutComponent) return
      if (this.lastLayoutComponent.$parent.$options.name === 'LayoutComposer')
        return
      this.lastLayoutComponent.$children[0].$el.className = `${
        this.lastLayoutComponent.$children[0].$el.className
      } Layout_Cell--emphasized`
    },
    getSiblingsFromLayout() {
      const { targetEl, lastLayoutEl } = this
      return (
        (lastLayoutEl &&
          [...lastLayoutEl.children].filter($el => {
            return (
              $el.__vue__ &&
              (!targetEl || $el.__vue__.id !== targetEl.__vue__.id)
            )
          })) ||
        []
      )
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

      if (!placeholderEl) return

      let minDistance = BIG_NUMBER
      let $childBeforeEl = null
      $siblings.forEach($el => {
        let { x, y } = $el.getBoundingClientRect()

        if (lastLayoutComponent.$attrs.orientation === 'horizontal') {
          placeholderEl.style.marginTop = '0px'
          placeholderEl.style.marginLeft = '8px'

          if (
            $el.previousSibling &&
            $el.previousSibling.className &&
            $el.previousSibling.className.indexOf('move')
          ) {
            x += $el.clientWidth / 2
          }
          if (x < startX && minDistance > startX - x) {
            minDistance = startX - x
            $childBeforeEl = $el
          }
        } else if (lastLayoutComponent.$attrs.orientation === 'vertical') {
          placeholderEl.style.marginTop = '8px'
          placeholderEl.style.marginLeft = null

          if (
            $el.previousSibling &&
            $el.previousSibling.className &&
            $el.previousSibling.className.indexOf('move')
          ) {
            y += $el.clientHeight / 2
          }
          if (y < startY && minDistance > startY - y) {
            minDistance = startY - y
            $childBeforeEl = $el
          }
        }
      })

      if (
        $childBeforeEl &&
        (($childBeforeEl.nextSibling &&
          $childBeforeEl.nextSibling.className ===
            CELL_PLACEHOLDER_CLASS.replace(/\./, '')) ||
          ($childBeforeEl.nextSibling === targetEl &&
            targetEl.style.display &&
            targetEl.style.display !== 'none'))
      )
        return
      if (
        !$childBeforeEl &&
        lastLayoutEl &&
        lastLayoutEl.children &&
        lastLayoutEl.children[0].className ===
          CELL_PLACEHOLDER_CLASS.replace(/\./, '')
      )
        return
      ;[...document.querySelectorAll(CELL_PLACEHOLDER_CLASS)].forEach(el =>
        el.remove()
      )
      targetEl.style.display = 'none'

      $childBeforeEl &&
        $childBeforeEl.parentNode.insertBefore(
          placeholderEl,
          $childBeforeEl.nextSibling
        )
      !$childBeforeEl && lastLayoutEl && lastLayoutEl.prepend(placeholderEl)

      if (!lastLayoutComponent) return

      if (lastLayoutComponent.$attrs.orientation === 'horizontal') {
        placeholderEl.style.marginTop = '0px'
        placeholderEl.style.marginBottom = '0px'
        if (!placeholderEl.previousSibling) {
          placeholderEl.style.marginLeft = '0px'
          if (placeholderEl.nextSibling) {
            placeholderEl.style.marginRight = '8px'
          }
        } else if (placeholderEl.nextSibling) {
          placeholderEl.style.marginRight = '0px'
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
        } else if (placeholderEl.nextSibling) {
          placeholderEl.style.marginBottom = '0px'
        }
      }
    },
    onDrag(event) {
      if (!this.draggable) return
      if (this.targetEl !== window.targetEl) return
      const startX = event.clientX - this.mousePosInElX
      const startY = event.clientY - this.mousePosInElY

      const $layoutEl = this.getUnderlyingLayoutEl(startX, startY)

      if (!$layoutEl) return

      this.setLayoutComponent($layoutEl)
      this.emphasizeCurrentLayout()

      const $siblings = this.getSiblingsFromLayout()

      this.appendPlaceholderToDOM($siblings, startX, startY)
    },
    onDragEnd() {
      if (!this.draggable || !window.isDragging) return true
      window.isDragging = false
      const CELL_PLACEHOLDER_CLASS = '.Layout_Cell--placeholder'
      const { targetEl, lastLayoutEl, prevParentId } = this

      if (!targetEl || !targetEl.parentElement) return true

      const cellId = targetEl.id

      UiUtils.moveCellToPlaceholderPosition(
        cellId,
        lastLayoutEl,
        targetEl.parentElement
      )

      const parentId = UiUtils.getParentId(targetEl)
      const prevSiblingId = UiUtils.getPrevSiblingId(targetEl)

      const {
        newPrevParentLayoutJson,
        newNextParentLayoutJson,
      } = LayoutUtils.moveElementToNewPosition(
        targetEl.__vue__.$parent.getConfig(),
        this.parentLayoutComponent.config,
        this.lastLayoutComponent.config,
        UiUtils.extractCellId(cellId),
        parentId,
        prevParentId,
        prevSiblingId
      )

      this.parentLayoutComponent.configUpdate(newPrevParentLayoutJson)
      if (newNextParentLayoutJson)
        this.lastLayoutComponent.configUpdate(newNextParentLayoutJson)
      ;[...document.querySelectorAll(CELL_PLACEHOLDER_CLASS)].forEach(el =>
        el.remove()
      )
      if (targetEl) targetEl.style.display = 'block'

      EventBus.$emit('global:dragend')

      return false
    },
  },
}
</script>

<style>
@keyframes pop-in {
  0% {
    padding: 0;
  }
  25% {
    padding: 3px;
  }
  50% {
    padding: 6px;
  }
  100% {
    padding: 10px;
  }
}

@keyframes pop-out {
  0% {
    padding: 10px;
  }
  25% {
    padding: 6px;
  }
  50% {
    padding: 3px;
  }
  100% {
    padding: 0;
  }
}

@keyframes grow-right {
  0% {
    flex-grow: 0;
    opacity: 0;
  }
  60% {
    flex-grow: 1;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes grow-down {
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.Layout_Cell,
.Layout_Cell--placeholder {
  position: relative;
  flex-grow: 1;
  flex-basis: 0;
  box-sizing: border-box;
}

.Layout_Cell--hovered {
  cursor: grab;
  background: #03a696;
  opacity: 0.4;
}

.Layout_Cell--dragging {
  border: 1px solid #e3e3e3;
  padding: 10px;
  animation: pop-in 0.2s cubic-bezier(0.075, 0.82, 0.165, 1) 0s 1;
}

.Layout_Cell--emphasized {
  border-color: #aaaaaa;
}

.Layout_Cell--dropped {
  padding: 0;
  animation: pop-out 0.2s cubic-bezier(0.075, 0.82, 0.165, 1) 0s 1;
}

.Layout_Cell--placeholder {
  opacity: 1;
  background: #03a696;
  color: #fff;
  min-height: 50px;
}

.Layout--horizontal > .Layout_Cell--placeholder {
  animation: grow-right 0.2s linear 0s 1;
}

.Layout--vertical > .Layout_Cell--placeholder {
  animation: grow-down 0.2s linear 0s 1;
  transition: height 0.2s linear;
}

.Layout_Cell__id {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 10px;
}

.Layout_Cell__actions {
  position: absolute;
  font-size: 10px;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  z-index: 50;
}

.Layout_Cell__actions span {
  position: relative;
  display: block;
  margin: 2px 5px;
  cursor: pointer;
  font-size: 12px;
}

.Layout_Cell__edit {
  color: #909090;
}

.Layout_Cell__delete {
  color: #b38484;
}
</style>
