# vue-layout-composer

GIF_PLACEHOLDER

Dynamic, drag & drop, JSON-based grid layout for Vue. 

Create your components, specify your JSON layout configuration and let the vue-layout-composer handle the rest.

## Installation

INSTALLATION_PLACEHOLDER

## Usage

1. Add the `ComponentRegister` plugin in your `main.js`

```
Vue.use(ComponentRegister)
```

2. Use the `LayoutComposer` component

```javascript
<template>
  <div id="app">
    <LayoutComposer
      :displayComponents="displayComponents"  // register your components
      :config="config"                        // provide your layout config
      @change:config="onConfigChange($event)" // listen for changes in config (e.g. save it on server)
      editable                                // make the layout editable in browser
    />
  </div>
</template>

<script>
import config from '../config/layout.json'
import LayoutComposer from './components/LayoutComposer'

import Item from './components/Item'

export default {
  name: 'app',
  components: {
    LayoutComposer,
  },
  data() {
    return {
      displayComponents: {
        'Item': Item,
      },
      config,
    }
  },
  methods: {
    onConfigChange(event) {
      console.log(event)
    },
  },
}
</script>
```

## Example layout config (JSON)

```json
{
  "component": "Layout",
  "props": {
    "orientation": "vertical"
  },
  "children": [
    {
      "component": "Layout",
      "props": {
        "orientation": "horizontal"
      },
      "children": [
        {
          "component": "Item",
          "display": {
            "weight": 1
          },
          "props": {
            "background": "#E6E7E8",
            "content": "This"
          }
        },
        {
          "component": "Item",
          "display": {
            "weight": 2
          },
          "props": {
            "background": "#E6E7E8",
            "content": "is"
          }
        }
      ]
    },
    {
      "component": "Item",
      "props": {
        "background": "#E6E7E8",
        "content": "This"
      }
    },
    {
      "component": "Layout",
      "props": {
        "orientation": "horizontal"
      },
      "children": [
        {
          "component": "Item",
          "display": {
            "weight": 1
          },
          "props": {
            "background": "#E6E7E8",
            "content": "This"
          }
        },
        {
          "component": "Layout",
          "display": {
            "weight": 1
          },
          "props": {
            "orientation": "vertical"
          },
          "children": [
            {
              "component": "Item",
              "display": {
                "weight": 1
              },
              "props": {
                "background": "#E6E7E8",
                "content": "and"
              }
            },
            {
              "component": "Item",
              "display": {
                "weight": 1
              },
              "props": {
                "background": "#E6E7E8",
                "content": "vertical."
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Props

### `displayComponents` (required)

Used to register your local components in the grid system context. Just specify the object with following structure:

```javascript
{
  'Item': Item,
  'OtherComponent': OtherComponent,
}
```

And you'll be able to write `"component": "Item"` and `"component": "OtherComponent"` in your layout config file and vue-layout-composer will understand which components you want to use.

### `config` (required)

Your layout config JSON, used to structure the grid.

### `editable`

Add if you want to be able to edit the grid (drag & drop).

## Events

### `change`

Triggered whenever the layout config JSON is changed. For example, when you move a component into a different position in `editable` mode.

Returns the updated layout config JSON.

You could send an API request to save the layout config data and load it whenever you want. Or save the config in local storage.

## Layout config

Layout config is a tree-based JSON structure with 2 main parts:

1. Layout nodes
2. Component nodes

There **always needs to be** one root layout node.

### Layout nodes

```json
{
  "component": "Layout",
  "props": {
    "orientation": "horizontal"
  },
  "children": [
    ...
  ]
}
```

Layout nodes are the ones that contain `"component": "Layout"`. Layout is a built-in layout component in vue-layout-composer.

Layout nodes can be `horizontal` or `vertical`, which is specified in `props.orientation` attribute. The orientation specifies the direction the layout will put the components in.

They also contain children nodes in `children` attribute. The children nodes can be either `layout nodes` or `component nodes`.

### Component nodes

```json
{
  "component": "YOUR_COMPONENT_NAME",
  "display": {
    "weight": 1
  },
  "props": {
    "background": "#E6E7E8",
    "content": "This"
  }
}
```

Component nodes are the ones you put your own Vue components in.

Specify the component with `"component": "YOUR_COMPONENT_NAME"` and pass any props via the `props` attribute. Props are your Vue component props.

### `display` attribute

Every node supports a `display` attribute.

At the moment only `weight` is supported. It can be thought of as the `flex-grow` CSS attribute.

## Goals

- [ ] Mobile support
- [ ] Resize in editor
- [ ] Registered components picker
- [ ] Server-side rendering support

## Long-term Goals

- [ ] Data down, actions up
- [ ] Power layout - support for OpenGL
