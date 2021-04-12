module.exports = cli => {
  cli.injectFeature({
    name: 'Router',
    value: 'router',
    description: 'Structure the app with dynamic pages'
  })

  cli.onPromptComplete((answers, options) => {
    if ((options.router = answers.features.includes('router'))) {
      if (answers.template === 'vue') {
        options.modules['vue-router'] = '^3.2.0'

        if (answers.features.includes('ts')) {
          options.plugins['@types/vue-router'] = '^2.0.0'
        }
      }

      if (answers.template === 'react') {
        options.modules['react-router'] = true
        options.modules['react-router-dom'] = true

        if (answers.features.includes('ts')) {
          options.plugins['@types/react-router'] = true
          options.plugins['@types/react-router-dom'] = true
        }
      }
    }
  })
}
