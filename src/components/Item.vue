<template>
  <div class="Layout_Item" :style="style">
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    content:    String,
    background: String,
  },
  computed: {
    style() {
      const { background } = this

      return {
        background,
      }
    }
  }
}
</script>

<style scoped>
.Layout_Item {
  flex-grow: 1;
}
</style>