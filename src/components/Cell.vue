<template>
  <div
    class="Layout_Cell"
    :style="style"
    :id="`cell-${id}`"
    draggable
    @dragstart="onDragStart($event)"
    @drag="onDrag($event)"
  >
    <span class="Layout_Cell__id">{{id}}</span>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    id:       Number,
    display:  Object,
  },
  data() {
    return {
      lastLayoutEl:         null,
      lastLayoutComponent:  null,
      fakeEl:               null,
      posX:                 0,
      posY:                 0,
    }
  },
  computed: {
    style() {
      if (!this.display) return {}

      const { weight: flexGrow } = this.display

      return {
        flexGrow,
      }
    }
  },
  methods: {
    onDragStart(event) {
      const rect = event.target.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      this.posX = x > 100 ? 100 : x
      this.posY = y > 100 ? 100 : y

      event.dataTransfer.setData('text/plain', event.target.id)

      let text = document.createElement('p')
      text.innerText = 'Drop here!'

      let realChild = event.target.children[0].cloneNode(false)
      let fakeChild = document.createElement('div')
      fakeChild.prepend(text)
      fakeChild.style.height = '100%'
      fakeChild.style.minHeight = realChild.style.minHeight
      fakeChild.style.width = realChild.style.width
      fakeChild.style.display = 'flex'
      fakeChild.style.justifyContent = 'center'
      fakeChild.style.alignItems = 'center'

      let fakeEl = document.createElement('div')
      fakeEl.addEventListener('dragover', function(e) {
         e.preventDefault()
      })
      fakeEl.className = 'Layout_Cell--placeholder'
      fakeEl.prepend(fakeChild)

      this.fakeEl = fakeEl
    },
    onDrag(event) {
      console.log("Cell:", event)

      const { fakeEl } = this

      const startX = event.clientX - this.posX
      const startY = event.clientY - this.posY

      const layoutEl = document
        .elementsFromPoint(startX, startY)
        .find(el => el.className.indexOf('Layout ') !== -1)

      let el = layoutEl
      let layoutComponent
      while (el) {
        if (el.__vue__) {
          layoutComponent = el.__vue__
          el = null
        } else {
          el = layoutEl.parentNode
        }
      }

      if (layoutComponent) this.lastLayoutComponent = layoutComponent
      if (layoutEl) this.lastLayoutEl = layoutEl

      const { lastLayoutComponent, lastLayoutEl } = this
      
      console.log("Layout ID:", lastLayoutComponent.$attrs.id)
      console.log("Layout orientation:", lastLayoutComponent.$attrs.orientation)
      
      const siblings = [ ...lastLayoutEl.children ].filter(el => {
        return el.__vue__ && el.__vue__.id !== event.srcElement.__vue__.id
      })
      console.log("Layout Children/Siblings", siblings)
    
      let minDistance = 10000000000000
      let childBeforeEl = null
      siblings.forEach(el => {
        const { x, y } = el.getBoundingClientRect()

        if (lastLayoutComponent.$attrs.orientation === 'horizontal') {
          if (x < startX && minDistance > (startX - x)) {
            minDistance = startX - x
            childBeforeEl = el
          }
        }
        else if (lastLayoutComponent.$attrs.orientation === 'vertical') {
          console.log('y, eY')
          console.log(y, event.clientY)
          if (y < startY && minDistance > (startY - y)) {
            minDistance = startY - y
            childBeforeEl = el
          }
        }
      })

      console.log("Child before", childBeforeEl)

      if (childBeforeEl && childBeforeEl.nextSibling === event.srcElement) return

      [...document.querySelectorAll('.Layout_Cell--placeholder')].forEach(el => el.remove())
      event.srcElement.style.display = 'none'
      childBeforeEl && childBeforeEl.parentNode.insertBefore(fakeEl, childBeforeEl.nextSibling)
      !childBeforeEl && layoutEl.prepend(fakeEl)
    }
  }
}
</script>

<style>
.Layout_Cell, .Layout_Cell--placeholder {
  position: relative;
  flex-grow: 1;
  padding: 5px;
  background: #fff;
  margin: 15px;
  flex-basis: 0;
}

.Layout_Cell--placeholder {
  background: #c3c3c3;
}

  .Layout_Cell__id {
    position: absolute;
    top: 7px;
    left: 7px;
    font-size: 12px;
  }
</style>
