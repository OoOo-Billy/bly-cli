const VUE_ESLINT_DEPS_MAP = {
  base: {
    eslint: '^6.7.2',
    'eslint-plugin-vue': '^6.2.2'
  },
  prettier: {
    '@vue/eslint-config-prettier': '^6.0.0',
    'eslint-plugin-prettier': '^3.1.3',
    prettier: '^1.19.1'
  },
  standard: {
    '@vue/eslint-config-standard': '^5.1.2',
    'eslint-plugin-import': '^2.20.2',
    'eslint-plugin-node': '^11.1.0',
    'eslint-plugin-promise': '^4.2.1',
    'eslint-plugin-standard': '^4.0.0'
  },
  typescript: {
    '@vue/eslint-config-typescript': '^5.0.2',
    '@typescript-eslint/eslint-plugin': '^2.33.0',
    '@typescript-eslint/parser': '^2.33.0'
  }
}

module.exports = cli => {
  cli.injectFeature({
    name: 'Linter / Formatter',
    value: 'linter',
    short: 'linter',
    description: 'Check and enforce code quality with ESLint or Prettier',
    plugins: ['eslint'],
    checked: true
  })

  cli.injectPrompt({
    name: 'linter',
    when: answers => answers.features.includes('linter'),
    type: 'list',
    message: 'Pick a linter / formatter you want:',
    choices: [
      {
        name: 'eslint',
        value: 'base'
      },
      {
        name: 'eslint-prettier',
        value: 'prettier'
      },
      {
        name: 'eslint-standard',
        value: 'standard'
      }
    ]
  })

  cli.onPromptComplete((answers, options) => {
    if ((options.linter = answers.linter)) {
      if (answers.template === 'vue') {
        options.scripts['lint'] = 'vue-cli-service lint'

        Object.assign(
          options.plugins,
          VUE_ESLINT_DEPS_MAP.base,
          VUE_ESLINT_DEPS_MAP[answers.linter]
        )
        if (answers.features.includes('ts')) {
          Object.assign(options.plugins, VUE_ESLINT_DEPS_MAP.typescript)
        } else if (answers.features.includes('babel')) {
          Object.assign(options.plugins, {
            'babel-eslint': '^10.1.0'
          })
        }
      }

      if (answers.template === 'react') {
        options.scripts['lint'] = answers.features.includes('ts')
          ? 'eslint --ext .ts,.tsx src'
          : 'eslint --ext .js,.jsx src'
      }
    }
  })
}
