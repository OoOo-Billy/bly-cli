module.exports = cli => {
  cli.injectFeature({
    name: 'TypeScript',
    value: 'ts',
    short: 'TS',
    description: 'Add support for the TypeScript language'
  });

  // cli.injectPrompt({
  //   name: 'tsClassComponent',
  //   when: answers => answers.features.includes('ts'),
  //   type: 'confirm',
  //   message: 'Use class-style component syntax?',
  //   description: 'Use the @Component decorator on classes.',
  //   default: true
  // });

  cli.injectPrompt({
    name: 'useTsWithBabel',
    when: answers => answers.features.includes('ts'),
    type: 'confirm',
    message: 'Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)?',
    description: 'It will output ES2015 and delegate the rest to Babel for auto polyfill based on browser targets.',
    default: answers => answers.features.includes('babel')
  });

  cli.onPromptComplete((answers, options) => {
    if (answers.features.includes('ts')) {
      const tsOptions = {};
      if (answers.template === "vue") {
        // tsOptions.classComponent = answers.tsClassComponent;
        if (answers.eslintConfig === 'tslint') {
          tsOptions.tsLint = true;
        }
        if (answers.useTsWithBabel) {
          tsOptions.useTsWithBabel = true;
        }
        options.plugins['@vue/cli-plugin-typescript'] = tsOptions;
      }
      if (answers.template === "react") {
        options.plugins['@types/react'] = true;
        options.plugins['@types/react-dom'] = true;
        // TODO: redux react-redux react-router
        // if (answers.redux) {}
      }
    };
  })
};