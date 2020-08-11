const { runRender } = require('./index')

module.exports = (setting, api) => {
  if (!setting.linter) return
  const { template } = setting

  let fileTree
  if (template === 'vue') {
    fileTree = {
      '.': '__eslintrc.js'
    }
  }
  if (template === 'react') {
  }
  api.excludeTs(['__eslintrc.js'])
  runRender(fileTree, template, api)
}
