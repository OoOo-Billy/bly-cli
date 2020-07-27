module.exports = (cli, { useReact }) => {
  cli.injectFeature({
    name: 'State Manager',
    value: 'store',
    description: 'Manage the app state with a centralized store.'
  })

  cli.injectPrompt({
    name: 'store',
    when: answers =>
      answers.features.includes('store') &&
      (answers.template === 'react' || useReact),
    type: 'list',
    message: `Pick a state manager with your app:`,
    choices: [
      {
        name: 'Redux',
        value: 'redux'
      },
      {
        name: 'MobX',
        value: 'mobx'
      }
    ]
  })

  cli.onPromptComplete((answers, options) => {
    if (answers.features.includes('store')) {
      if (answers.template === 'vue') {
        options.modules['vuex'] = '^3.4.0'
      }
      if (answers.template === 'react') {
        if (answers.store === 'redux') {
          options.modules['redux'] = true
        }
        if (answers.store === 'mobx') {
          options.modules['mobx'] = true
        }
      }
    }
  })
}
