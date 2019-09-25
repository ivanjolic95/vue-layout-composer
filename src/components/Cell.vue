<template>
  <div
    class="Layout_Cell"
    :style="style"
    draggable
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Cell',
  props: {
    display:  Object,
  },
  computed: {
    style() {
      if (!this.display) return {}

      const { weight: flexGrow } = this.display

      return {
        flexGrow,
      }
    }
  }
}
</script>

<style scoped>
.Layout_Cell {
  flex-grow: 1;
}
</style>
