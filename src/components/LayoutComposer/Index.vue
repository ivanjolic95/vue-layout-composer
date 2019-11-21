<template>
  <div class="LayoutComposer">
    <template v-if="!internalEditable">
      <div class="LayoutComposer__Actions">
        <a
          href="#"
          class="LayoutComposer__ActionButton"
          @click.prevent="internalEditable = !internalEditable;"
        >
          Edit
        </a>
      </div>
    </template>
    <template v-else>
      <div class="LayoutComposer__Actions">
        <a
          href="#"
          class="LayoutComposer__ActionButton"
          @click.prevent="internalEditable = !internalEditable; buildConfig()"
        >
          Save
        </a>
      </div>
    </template>

    <Layout
      :displayComponents="displayComponents"
      :initialConfig="internalConfig"
      :id="internalConfig.id"
      v-bind="internalConfig.props"
      :editable="internalEditable"
      :dragging="dragging"
    />
  </div>
</template>

<script>
import fs from 'fs'
import _ from 'lodash'

import UiUtils from './utils/ui'
import LayoutUtils from './utils/layout'

import Layout from './components/Layout'

export default {
  name: 'LayoutComposer',
  components: {
    Layout,
  },
  props: {
    displayComponents:  Object,
    config:             Object,
    editable:           Boolean,
  },
  watch: {
    internalConfig() {
      const internalConfigNoIds = _.cloneDeep(this.internalConfig)
      LayoutUtils.removeIds(internalConfigNoIds)
    },
    config() {
      this.internalConfig = _.cloneDeep(this.config)
      LayoutUtils.addIds(this.internalConfig)
    },
  },
  created() {
    this.internalConfig = _.cloneDeep(this.config)
    LayoutUtils.addIds(this.internalConfig)
  },
  mounted() {
    if (window.documentHasDropListener) return

    document.addEventListener('dragstart', (event) => {
      setTimeout(() => {
        this.dragging = true
      }, 100)
    })

    document.addEventListener('dragover', (event) => {
      if (!this.internalEditable) return true
      event.preventDefault()
    })

    document.addEventListener('drop', () => {
      if (!this.internalEditable) return false
      setTimeout(() => {
        this.dragging = false
      }, 100)
    })

    window.documentHasDropListener = true
  },
  data() {
    return {
      dragging:         false,
      internalConfig:   {},
      internalEditable: this.editable,
    }
  },
  computed: {
    configHumanized: {
      get() {
        const internalConfigNoIds = _.cloneDeep(this.internalConfig)
        LayoutUtils.removeIds(internalConfigNoIds)
        return JSON.stringify(internalConfigNoIds, null, 4)
      },
      set(newValue) {
        try {
          this.internalConfig = JSON.parse(newValue)
          LayoutUtils.addIds(this.internalConfig)
        } catch(e) {}
      },
    },
  },
  methods: {
    buildConfig() {
      this.$emit('change:config', this.$children[0].getConfig())
    },
  }
}
</script>

<style>
.LayoutComposer {
  display: flex;
  width: 100%;
  flex-direction: column;
}

  .LayoutComposer__Actions {
    display: flex;
    width: 100%;
    justify-content: center;
    border-bottom: 1px solid #e3e3e3;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }

  .LayoutComposer__ActionButton {
    align-self: flex-end;
    margin: 10px;
    text-decoration: none;
    color: #007bff;
    background-color: transparent;
    background-image: none;
    border: 1px solid #007bff;
    padding: .5rem .75rem;
    font-size: 1rem;
    line-height: 1.25;
    border-radius: .25rem;
  }
</style>
