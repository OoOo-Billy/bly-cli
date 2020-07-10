const { runRender } = require('./index')

module.exports = (setting, api) => {
  if (!setting.plugins.hasOwnProperty('typescript')) return

  const { template, targetDir } = setting
  let fileTree
  if (template === 'vue') {
    fileTree = {
      '.': 'tsconfig.json',
    }
  }
  if (template === 'react') {
  }

  const filePathList = api.parseFileTree(fileTree)
  runRender(filePathList, template, targetDir, api)
}
