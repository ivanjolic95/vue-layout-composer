<template>
  <div class="Item" :style="style">
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
.Item {
  height: 50px;
  line-height: 50px;
}
</style>
