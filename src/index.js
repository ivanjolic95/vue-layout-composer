import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import LayoutComposer from './components/LayoutComposer'
import Layout from './components/LayoutComposer/components/Layout'
import Cell from './components/LayoutComposer/components/Layout/components/Cell'

import ComponentRegister from './plugins/ComponentRegister'

const components = {
  LayoutComposer,
  Layout,
  Cell
}

const plugin = (Vue, opts = { prefix: 'Lc' }) => {
  const { prefix } = opts
  const compNames = Object.keys(components)
  for (let i = 0; i < compNames.length; i++) {
    const name = compNames[i]
    if (name !== 'LayoutComposer')
      Vue.component(`${prefix}${name}`, components[name])
    else
      Vue.component(name, components[name])
  }

  Vue.use(ComponentRegister)
}

export default plugin

const version = '__VERSION__'

export {
  version,

  LayoutComposer,
  Layout,
  Cell,
}
