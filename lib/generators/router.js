const { runRender } = require('./index')

module.exports = (setting, api) => {
  if (!setting.router) return
  const { template } = setting

  let fileTree
  if (template === 'vue') {
    fileTree = {
      src: {
        router: 'index.js',
        views: ['About.vue', 'Home.vue']
      }
    }
  }
  if (template === 'react') {
  }

  runRender(fileTree, template, api)
}
