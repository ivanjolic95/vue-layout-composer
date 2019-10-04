<template>
  <div class="MetodaGrid">
    <template v-if="internalEditable">
      <div class="MetodaGrid__Actions">
        <a
          href="#"
          class="MetodaGrid__ActionButton"
          @click.prevent="internalEditable = !internalEditable"
        >
          Lock
        </a>
        <a
          href="#"
          class="MetodaGrid__ActionButton"
          @click.prevent="isEditorShown = !isEditorShown"
        >
          {{editorButtonText}}
        </a>
      </div>
      <textarea
        v-if="isEditorShown"
        v-model="configHumanized"
        class="MetodaGrid__Editor"
      ></textarea>
    </template>

    <Layout
      :displayComponents="displayComponents"
      :config="internalConfig"
      :id="internalConfig.id"
      v-bind="internalConfig.props"
      :editable="internalEditable"
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
  name: 'MetodaGrid',
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

    document.addEventListener('dragover', (event) => {
      if (!this.internalEditable) return true
      event.preventDefault()
    })

    document.addEventListener('drop', (event) => {
      if (!this.internalEditable) return false
 
      const cellId = event.dataTransfer.getData("text")

      UiUtils.moveCellToPlaceholderPosition(cellId)

      setTimeout(() => {
        const parentId = UiUtils.getParentId(cellId)
        const prevSiblingId = UiUtils.getPrevSiblingId(cellId)

        this.internalConfig = LayoutUtils.moveElementToNewPosition(this.internalConfig, UiUtils.extractCellId(cellId), parentId, prevSiblingId)
      }, 100)
    })

    window.documentHasDropListener = true
  },
  data() {
    return {
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
}
</script>

<style>
.MetodaGrid {
  display: flex;
  width: 100%;
  flex-direction: column;
}

  .MetodaGrid__Actions {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }

  .MetodaGrid__ActionButton {
    align-self: flex-end;
    margin: 4px;
    padding: 10px 20px;
    text-decoration: none;
    color: #284664;
    background: #E6E7E8;
  }

  .MetodaGrid__Editor {
    width: 100%;
    height: 400px;
  }
</style>
