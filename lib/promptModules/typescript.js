module.exports = (cli, { useVue }) => {
  cli.injectFeature({
    name: 'TypeScript',
    value: 'ts',
    short: 'TS',
    description: 'Add support for the TypeScript language'
  })

  cli.injectPrompt({
    name: 'tsClassComponent',
    when: answers =>
      answers.features.includes('ts') && (answers.template === 'vue' || useVue),
    type: 'confirm',
    message: 'Use class-style component syntax?',
    description: 'Use the @Component decorator on classes.',
    link:
      'https://vuejs.org/v2/guide/typescript.html#Class-Style-Vue-Components',
    default: true
  })

  cli.injectPrompt({
    name: 'useTsWithBabel',
    when: answers => answers.features.includes('ts'),
    type: 'confirm',
    message:
      'Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)?',
    description:
      'It will output ES2015 and delegate the rest to Babel for auto polyfill based on browser targets.',
    default: answers => answers.features.includes('babel')
  })

  cli.onPromptComplete((answers, options) => {
    if (answers.features.includes('ts')) {
      options.plugins['typescript'] = true

      if (answers.useTsWithBabel) {
        options.useTsWithBabel = true
      }

      if (answers.template === 'vue') {
        if (answers.tsClassComponent) {
          options.classComponent = answers.tsClassComponent
          options.plugins['vue-class-component'] = true
          options.plugins['vue-property-decorator'] = true
        }
        options.plugins['@types/webpack-env'] = true
      }

      if (answers.template === 'react') {
        options.plugins['@types/node'] = true
        options.plugins['@types/react'] = true
        options.plugins['@types/react-dom'] = true
        // TODO: `redux mobx react-redux react-router` will manual configuration in next major version.
        // if (answers.redux) {}
      }
    }
  })
}
