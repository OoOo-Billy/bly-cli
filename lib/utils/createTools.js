exports.getPromptModules = () => {
  return [
    'template',
    'babel',
    'typescript',
    // "pwa",
    // "router",
    // "vuex",
    'cssPreprocessor'
    // "linter",
    // "unit",
    // "e2e"
  ].map(file => require(`../promptModules/${file}`))
}

exports.getTemplateGenerators = () => {
  return ['template', 'typescript'].map(file =>
    require(`../generators/${file}`)
  )
}
