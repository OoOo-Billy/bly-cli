const { runRender } = require('./index')

module.exports = (setting, api) => {
  const { template } = setting

  let fileTree
  if (template === 'vue') {
    fileTree = {
      public: ['favicon.ico', 'index.html'],
      src: {
        assets: 'logo.png',
        components: 'HelloWorld.vue',
        '.': ['App.vue', 'main.js']
      },
      '.': '__gitignore'
    }
  }
  // TODO
  if (template === 'react') {
  }

  runRender(fileTree, template, api)
}
