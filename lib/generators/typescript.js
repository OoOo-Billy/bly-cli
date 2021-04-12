const { runRender } = require('./index')

module.exports = (setting, api) => {
  if (!setting.plugins.hasOwnProperty('typescript')) return
  api.transformTs()

  const { template } = setting
  const fileTree = {
    '.': 'tsconfig.json'
  }

  if (template === 'vue') {
    fileTree.src = 'shims-vue.d.ts'
  }

  if (template === 'react') {
    fileTree.src = 'react-app-env.d.ts'
  }

  runRender(fileTree, template, api)
}
