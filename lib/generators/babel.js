const { runRender } = require('./index')

module.exports = (setting, api) => {
  if (!setting.babel) return
  const { template } = setting

  const fileTree = {
    '.': '__browserslistrc'
  }

  runRender(fileTree, template, api)
}
