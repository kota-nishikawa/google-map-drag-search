import Vue from 'vue'
import App from './App.vue'

import * as VueGoogleMaps from "vue2-google-maps" // Import package

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: "xxxx",
    libraries: "places"
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
