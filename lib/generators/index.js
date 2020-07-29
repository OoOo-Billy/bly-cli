const path = require('path')

const templatePath = './templates'

const runRender = function (fileTree, branch = '.', api) {
  api.render(
    api.parseFileTree(fileTree),
    path.relative(process.cwd(), path.resolve(__dirname, templatePath)) +
      '/' +
      branch
  )
}

module.exports = {
  runRender
}
