module.exports = cli => {
  cli.injectFeature({
    name: 'CSS Pre-processors',
    value: 'css-preprocessor',
    description: 'Add support for CSS pre-processors like Sass, Less or Stylus'
  })

  const notice = 'PostCSS, Autoprefixer and CSS Modules are supported by default'

  cli.injectPrompt({
    name: 'cssPreprocessor',
    when: answers => answers.features.includes('css-preprocessor'),
    type: 'list',
    message: `Pick a CSS pre-processor (${notice}):`,
    description: `${notice}.`,
    choices: [
      {
        name: 'Sass/SCSS (with dart-sass)',
        value: 'dart-sass'
      },
      {
        name: 'Sass/SCSS (with node-sass)',
        value: 'node-sass'
      },
      {
        name: 'Less',
        value: 'less'
      },
      {
        name: 'Stylus',
        value: 'stylus'
      }
    ]
  })

  cli.onPromptComplete((answers, options) => {
    if ((options.cssPreprocessor = answers.cssPreprocessor)) {
      switch (answers.cssPreprocessor) {
        case 'dart-sass':
          options.plugins['sass'] = '^1.26.5'
          options.plugins['sass-loader'] = '^8.0.2'
          break
        case 'node-sass':
          options.plugins['node-sass'] = '^4.12.0'
          options.plugins['sass-loader'] = '^8.0.2'
          break
        case 'less':
          options.plugins['less'] = '^3.0.4'
          options.plugins['less-loader'] = '^5.0.0'
          break
        case 'stylus':
          options.plugins['stylus'] = '^0.54.7'
          options.plugins['stylus-loader'] = '^3.0.2'
      }
    }
  })
}
