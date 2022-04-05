import Vue from 'vue'
import App from './App2.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueApexCharts from 'vue-apexcharts'

Vue.config.productionTip = false
Vue.use(VueApexCharts)
Vue.component('vue-apexchart', VueApexCharts)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
