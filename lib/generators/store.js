const { runRender } = require('./index')

module.exports = (setting, api) => {
  const { template } = setting

  let fileTree
  if (template === 'vue') {
    fileTree = {
      src: {
        store: 'index.js'
      }
    }
  }
  if (template === 'react') {
  }

  runRender(fileTree, template, api)
}
