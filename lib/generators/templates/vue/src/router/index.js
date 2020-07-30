import Vue from 'vue'
<%_ if (renderOptions.plugins.typescript) { _%>
import VueRouter, { RouteConfig } from 'vue-router'
<%_ } else { _%>
import VueRouter from 'vue-router'
<%_ } _%>
import Home from '../views/Home.vue'

Vue.use(VueRouter)

<%_ if (renderOptions.plugins.typescript) { _%>
const routes: Array<RouteConfig> = [
<%_ } else { _%>
  const routes = [
<%_ } _%>
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
