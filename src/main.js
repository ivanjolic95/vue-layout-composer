import Vue from 'vue'
import App from './App.vue'

import ComponentRegister from './plugins/ComponentRegister'

Vue.config.productionTip = false

Vue.use(ComponentRegister)

new Vue({
  render: h => h(App),
}).$mount('#app')
