const { runRender } = require('./index')

module.exports = (setting, api) => {
  if (!setting.plugins.hasOwnProperty('typescript')) return
  api.transformTs()

  const { template } = setting
  let fileTree
  if (template === 'vue') {
    fileTree = {
      '.': 'tsconfig.json',
      src: 'shims-vue.d.ts'
    }
  }
  if (template === 'react') {
  }

  runRender(fileTree, template, api)
}
