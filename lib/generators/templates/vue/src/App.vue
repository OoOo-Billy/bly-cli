<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js <% if (renderOptions.plugins.typescript) { _%>+ TypeScript <% } _%>App" />
  </div>
</template>

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
  margin-top: 60px;
}
</style>
<%_ } else { _%>
<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
<%_ } _%>
