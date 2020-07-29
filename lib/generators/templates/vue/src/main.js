import Vue from 'vue'
import App from './App.vue'
<%_ if (renderOptions.modules.vuex) { _%>
import store from './store'
<%_ } _%>

Vue.config.productionTip = false

new Vue({
<%_ if (renderOptions.modules.vuex) { _%>
  store,
<%_ } _%>
  render: h => h(App),
}).$mount('#app')
