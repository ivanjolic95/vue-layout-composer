import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowsAlt, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ComponentRegister from './plugins/ComponentRegister'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(ComponentRegister)

library.add(faArrowsAlt)
library.add(faEdit)
library.add(faTrash)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  render: h => h(App),
}).$mount('#app')
