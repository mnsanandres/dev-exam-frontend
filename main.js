import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.config.productionTip = false


Vue.use(VueRouter)

import Main from './components/Main.vue';

const routes = [
  { path: '/', component: Main },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(Main)
}).$mount('#app')