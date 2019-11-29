/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    this.Vue = Vue

    const { registerComponent, getComponentName } = this

    Vue.prototype.$layoutComposer = {
      registerComponent: registerComponent(Vue),
      getComponentName,
    }
  },
  registerComponent(Vue) {
    return (name, Component) =>
      Vue.component(`layout-composer-presenter-${name}`, Component)
  },
  getComponentName(name) {
    return `layout-composer-presenter-${name}`
  },
}
