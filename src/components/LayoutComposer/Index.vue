<template>
  <div class="LayoutComposer">
    <Layout
      ref="rootLayout"
      :dragging="dragging"
      :display-components="displayComponents"
      :initial-config="configInternal"
      v-bind="configInternal.props"
      :editable="editable"
    />
  </div>
</template>

<script>
import _ from 'lodash'

import LayoutUtils from './utils/layout'

import EventBus from './eventBus'

import Layout from './components/Layout'

export default {
  name: 'LayoutComposer',
  components: {
    Layout,
  },
  props: {
    displayComponents: {
      type: Object,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    editable: Boolean,
  },
  data() {
    return {
      dragging: false,
      configInternal: {},
    }
  },
  computed: {
    cellProps() {
      const { configInternal, dragging } = this
      return {
        id: configInternal.id,
        dragging,
        layoutOrientation: '',
        isFirstChild: true,
      }
    },
    configHumanized: {
      get() {
        const configInternalNoIds = _.cloneDeep(this.configInternal)
        LayoutUtils.removeIds(configInternalNoIds)
        return JSON.stringify(configInternalNoIds, null, 4)
      },
      set(newValue) {
        try {
          this.configInternal = JSON.parse(newValue)
          LayoutUtils.addIds(this.configInternal)
        } catch (e) {
          // catch
        }
      },
    },
  },
  watch: {
    configInternal() {
      const configInternalNoIds = _.cloneDeep(this.configInternal)
      LayoutUtils.removeIds(configInternalNoIds)
    },
    config() {
      this.configInternal = _.cloneDeep(this.config)
      LayoutUtils.addIds(this.configInternal)
    },
    editable(newValue) {
      // calculate config ONLY if editable is false &
      // the parent component is listening on 'lock' event
      if (!newValue && this.$listeners.lock)
        this.$emit('lock', this.$children[0].getConfig())
    },
  },
  created() {
    this.configInternal = _.cloneDeep(this.config)
    LayoutUtils.addIds(this.configInternal)
  },
  mounted() {
    this.setCellProps()

    if (window.documentHasDropListener) return

    document.addEventListener('dragstart', () => {
      setTimeout(() => {
        this.dragging = true
      }, 100)
    })

    document.addEventListener('dragover', event => {
      event.preventDefault()
      if (!this.editable) return true
    })

    document.addEventListener('drop', event => {
      event.preventDefault()
    })

    EventBus.$on('global:dragend', () => {
      if (!this.editable) return false
      setTimeout(() => {
        // calculate config ONLY if parent component is listening
        // on 'move:cell' event
        if (this.$listeners['move:cell'])
          this.$emit('move:cell', this.$children[0].getConfig())
        this.dragging = false
      }, 100)
    })

    window.documentHasDropListener = true
  },
  methods: {
    setCellProps() {
      if (!this.$refs.rootLayout) return
      if (!this.$refs.rootLayout.$children) return
      this.$refs.rootLayout.$children[0].cellConfig = this.cellProps
    },
  },
}
</script>

<style>
.LayoutComposer {
  display: flex;
  width: 100%;
  flex-direction: column;
}
</style>
