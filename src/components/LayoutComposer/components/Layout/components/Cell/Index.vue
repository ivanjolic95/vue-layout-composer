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
    @dragend.stop="onDragEnd($event)"
  >
    <div v-if="editable && $parent.$options.name !== 'Layout'" class="Layout_Cell__actions">
      <span class="Layout_Cell__edit" @click="$emit('edit:content')"><font-awesome-icon icon="edit" /></span>
      <span class="Layout_Cell__delete" @click="$emit('delete:content')"><font-awesome-icon icon="trash" /></span>
    </div>
    <!-- <span class="Layout_Cell__id" v-if="editable">{{id}}</span> -->
    <slot />
  </div>
</template>

<script>
import UiUtils from '../../../../utils/ui'
import LayoutUtils from '../../../../utils/layout'

export default {
  name: 'Cell',
  props: {
    id:       Number,
    display:  Object,
    editable: Boolean,
    config:   Object,
    dragging: Boolean,
  },
  data() {
    return {
      internalConfig:         {},
      targetEl:               null,
      parentLayoutComponent:  null,
      prevParentId:           null,
      lastLayoutEl:           null,
      lastLayoutComponent:    null,
      placeholderEl:          null,
      mousePosInElX:          0,
      mousePosInElY:          0,
      hovered:                false,
    }
  },
  created() {
    this.internalConfig = this.config
    this.parentLayoutComponent = this.$parent.$parent.$parent

    document.addEventListener('dragover', (event) => {
      if (/firefox/i.test(navigator.userAgent)) this.onDrag(event)
    })
  },
  computed: {
    style() {
      if (!this.internalConfig || !this.internalConfig.internalDisplay) return {}

      const {
        marginTop,
        marginLeft,
      } = this.internalConfig.internalDisplay

      if (!this.display) return {
        marginTop,
        marginLeft,
      }

      const {
        weight: flexGrow,
      } = this.display

      return {
        flexGrow,
        marginTop,
        marginLeft,
      }
    },
    classes() {
      const { hovered, editable, dragging } = this

      return {
        'Layout_Cell--hovered': hovered && editable,
        'Layout_Cell--dragging': dragging,
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
      this.prevParentId = UiUtils.getParentId(event.target)

      this.setMousePositionInDraggedElement(event)

      event.dataTransfer.setData('text/plain', this.targetEl.id)

      this.createPlaceholderElement()
    },
    getUnderlyingLayoutEl(startX, startY) {
      const LAYOUT_CLASS = 'Layout'
      return document
        .elementsFromPoint(startX, startY)
        .find(el => el.className && el.className.indexOf(`${LAYOUT_CLASS} `) !== -1)
    },
    setLayoutComponent($layoutEl) {
      let $currEl = $layoutEl
      let layoutComponent
      while ($currEl) {
        if ($currEl.__vue__) {
          if ($currEl.__vue__.$options.name === 'Cell')
            layoutComponent = $currEl.__vue__.$parent
          else
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
        return $el.__vue__ && (!targetEl || $el.__vue__.id !== targetEl.__vue__.id)
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

      if (!placeholderEl) return

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

      if (!$layoutEl) return

      this.setLayoutComponent($layoutEl)
      
      const $siblings = this.getSiblingsFromLayout()
    
      this.appendPlaceholderToDOM($siblings, startX, startY)
    },
    onDragEnd() {
      console.log('drag end')
      if (!this.editable) return
      const CELL_PLACEHOLDER_CLASS = '.Layout_Cell--placeholder';
      const { targetEl, lastLayoutEl, prevParentId } = this;

      const cellId = targetEl.id

      UiUtils.moveCellToPlaceholderPosition(cellId, lastLayoutEl, targetEl.parentNode)

      const parentId = UiUtils.getParentId(targetEl)
      const prevSiblingId = UiUtils.getPrevSiblingId(targetEl)

      const { newPrevParentLayoutJson, newNextParentLayoutJson } = LayoutUtils.moveElementToNewPosition(this.parentLayoutComponent.config, this.lastLayoutComponent.config, UiUtils.extractCellId(cellId), parentId, prevParentId, prevSiblingId)

      this.parentLayoutComponent.configUpdate(newPrevParentLayoutJson)
      if (newNextParentLayoutJson) this.lastLayoutComponent.configUpdate(newNextParentLayoutJson);

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
  box-sizing: border-box;
}

.Layout_Cell--dragging {
  border: 1px solid #e3e3e3;
  padding: 10px;
}

.Layout_Cell--hovered {
  cursor: grab;
  background: #eeeeee;
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

  .Layout_Cell__actions {
    position: absolute;
    font-size: 10px;
    display: flex;
    width: 100%;
    justify-content: flex-end;
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
