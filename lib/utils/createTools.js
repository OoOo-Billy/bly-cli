exports.getPromptModules = () => {
  return [
    'template',
    'babel',
    'typescript',
    'router',
    'store',
    'cssPreprocessor',
    'linter'
  ].map(file => require(`../promptModules/${file}`))
}

exports.getTemplateGenerators = () => {
  return ['template', 'typescript', 'store', 'router', 'linter', 'babel'].map(file =>
    require(`../generators/${file}`)
  )
}
