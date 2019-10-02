export default {
  install(Vue) {
    this.Vue = Vue

    const {
      registerComponent,
      getComponentName,
    } = this
    
    Vue.prototype.$metodaGrid = {
      registerComponent: registerComponent(Vue),
      getComponentName,
    }
  },
  registerComponent(Vue) {
    const self = this
    return (name, Component) =>
      Vue.component(`metoda-grid-presenter-${name}`, Component)
  },
  getComponentName(name) {
    return `metoda-grid-presenter-${name}`
  }
}
