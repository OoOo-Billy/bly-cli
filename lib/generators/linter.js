const { runRender } = require('./index')

module.exports = (setting, api) => {
  if (!setting.linter) return
  const { template } = setting

  const fileTree = {
    '.': '__eslintrc.js'
  }

  api.excludeTs(['.eslintrc.js'])
  runRender(fileTree, template, api)
}
