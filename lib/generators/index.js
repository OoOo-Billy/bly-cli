const path = require('path')

const templatePath = './templates'

const runRender = function (templates, branch = '.', context, api) {
  api.render(
    templates,
    path.relative(process.cwd(), path.resolve(__dirname, templatePath)) +
      '/' +
      branch,
    context
  )
}

module.exports = {
  runRender
}
