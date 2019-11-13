<template>
  <div class="LayoutComposer">
    <template v-if="internalEditable">
      <div class="LayoutComposer__Actions">
        <a
          href="#"
          class="LayoutComposer__ActionButton"
          @click.prevent="internalEditable = !internalEditable; buildConfig()"
        >
          Lock
        </a>
        <a
          href="#"
          class="LayoutComposer__ActionButton"
          @click.prevent="isEditorShown = !isEditorShown"
        >
          {{editorButtonText}}
        </a>
      </div>
      <textarea
        v-if="isEditorShown"
        v-model="configHumanized"
        class="LayoutComposer__Editor"
      ></textarea>
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
    internalEditable() {
      this.isEditorShown = false
    },
    internalConfig() {
      const internalConfigNoIds = _.cloneDeep(this.internalConfig)
      LayoutUtils.removeIds(internalConfigNoIds)

      this.$emit('change:config', {
        config: internalConfigNoIds,
      })
    },
    config() {
      this.internalConfig = _.cloneDeep(this.config)
      LayoutUtils.addIds(this.internalConfig)
    },
  },
  created() {
    this.internalConfig = _.cloneDeep(this.config)
    LayoutUtils.addIds(this.internalConfig)
    LayoutUtils.addMargins(this.internalConfig)
  },
  mounted() {
    if (window.documentHasDropListener) return

    document.addEventListener('dragstart', (event) => {
      setTimeout(() => {
        this.dragging = true
      }, 10)
    })

    document.addEventListener('drop', (event) => {
      this.dragging = false
    })

    document.addEventListener('dragover', (event) => {
      if (!this.internalEditable) return true
      event.preventDefault()
    })

    document.addEventListener('drop', () => {
      if (!this.internalEditable) return false
    })

    window.documentHasDropListener = true
  },
  data() {
    return {
      dragging:         false,
      internalConfig:   {},
      internalEditable: this.editable,
      isEditorShown:    false,
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
          LayoutUtils.addMargins(this.internalConfig)
        } catch(e) {}
      },
    },
    editorButtonText() {
      return !this.isEditorShown ? 'Show Editor' : 'Hide Editor'
    }
  },
  methods: {
    buildConfig() {
      console.log(JSON.stringify(this.$children[0].getConfig(), null, 2))
      return this.$children[0].getConfig()
    }
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
    justify-content: flex-end;
  }

  .LayoutComposer__ActionButton {
    align-self: flex-end;
    margin: 4px;
    padding: 10px 20px;
    text-decoration: none;
    color: #284664;
    background: #E6E7E8;
  }

  .LayoutComposer__Editor {
    width: 100%;
    height: 400px;
  }
</style>
