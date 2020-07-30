<%_ if (renderOptions.router) { _%>
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>
<%_ } else { _%>
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js <% if (renderOptions.plugins.typescript) { _%>+ TypeScript <% } _%>App" />
  </div>
</template>
<%_ } _%>

<%_ if (!renderOptions.router) { _%>
  <%_ if (renderOptions.plugins.typescript) { _%>
<script lang="ts">
    <%_ if (!renderOptions.classComponent) { _%>
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'App',
  components: {
    HelloWorld
  }
});
    <%_ } else { _%>
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {}
    <%_ } _%>
</script>
  <%_ } else { _%>
<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
  <%_ } _%>
<%_ } _%>

<%_ if (renderOptions.cssPreprocessor !== 'stylus') { _%>
<style<%-
  renderOptions.cssPreprocessor
    ? ` lang="${
        renderOptions.cssPreprocessor.includes('sass')
          ? 'scss'
          : renderOptions.cssPreprocessor
      }"`
    : ``
%>>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  <%_ if (renderOptions.router) { _%>
}
    <%_ if (!renderOptions.cssPreprocessor) { _%>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
    <%_ } else { _%>
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
    <%_ } _%>
  <%_ } else { _%>
  margin-top: 60px;
}
  <%_ } _%>
</style>
<%_ } else { _%>
<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  <%_ if (renderOptions.router) { _%>
  #nav
    padding 30px
    a
      font-weight bold
      color #2c3e50
      &.router-link-exact-active
        color #42b983
  <%_ } else { _%>
  margin-top 60px
  <%_ } _%>
</style>
<%_ } _%>
