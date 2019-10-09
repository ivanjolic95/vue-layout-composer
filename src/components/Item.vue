<template>
  <div class="Item" :style="style" @click="onClick">
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
  },
  methods: {
    onClick() {
      console.log('clicked')
    }
  }
}
</script>

<style>
.Item {
  height: 100%;
  min-height: 50px;
  line-height: 50px;
}
</style>
