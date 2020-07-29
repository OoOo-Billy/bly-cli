exports.getPromptModules = () => {
  return [
    'template',
    'babel',
    'typescript',
    // "pwa",
    // "router",
    'store',
    'cssPreprocessor'
    // "linter",
    // "unit",
    // "e2e"
  ].map(file => require(`../promptModules/${file}`))
}

exports.getTemplateGenerators = () => {
  return ['template', 'typescript', 'store'].map(file =>
    require(`../generators/${file}`)
  )
}
