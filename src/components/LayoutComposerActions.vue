<template>
  <div class="LayoutComposerActions">
    <a
      href="#"
      class="LayoutComposerActions__StateButton"
      @click.prevent="onClick"
    >
      {{ stateButtonText }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'LayoutComposerActions',
  props: {
    editable: Boolean,
  },
  data() {
    return {
      editableInternal: this.editable,
    }
  },
  computed: {
    stateButtonText() {
      return this.editableInternal ? 'Save' : 'Edit'
    },
  },
  methods: {
    onClick() {
      this.editableInternal = !this.editableInternal
      this.$emit('change:state', this.editableInternal)
    },
  },
}
</script>

<style scoped>
.LayoutComposerActions {
  display: flex;
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid #e3e3e3;
  margin-bottom: 15px;
  padding-bottom: 10px;
}

.LayoutComposerActions__StateButton {
  align-self: flex-end;
  margin: 10px;
  text-decoration: none;
  color: #007bff;
  background-color: transparent;
  background-image: none;
  border: 1px solid #007bff;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.25;
  border-radius: 0.25rem;
}
</style>
