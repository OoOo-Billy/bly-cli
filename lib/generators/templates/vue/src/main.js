import Vue from 'vue'
import App from './App.vue'
<%_ if (renderOptions.store) { _%>
import store from './store'
<%_ } _%>
<%_ if (renderOptions.router) { _%>
import router from './router'
<%_ } _%>

Vue.config.productionTip = false

new Vue({
<%_ if (renderOptions.store) { _%>
  store,
<%_ } _%>
<%_ if (renderOptions.router) { _%>
  router,
<%_ } _%>
  render: h => h(App),
}).$mount('#app')
