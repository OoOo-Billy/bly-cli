module.exports = cli => {
  cli.injectFeature({
    name: 'Babel',
    value: 'babel',
    short: 'Babel',
    description:
      'Transpile modern JavaScript to older versions (for compatibility)',
    link: 'https://babeljs.io/',
    checked: true
  })

  cli.onPromptComplete((answers, options) => {
    if (answers.features.includes('ts')) {
      if (!answers.useTsWithBabel) {
        return
      }
    } else if (!answers.features.includes('babel')) {
      return
    }
    if (answers.template === 'vue') {
      // options.plugins['@vue/cli-plugin-babel'] = true
    }
    // "react-scripts" contains the babel, but just temporary.
    // if (answers.template === "react") {
    // options.plugins["@babel/core"] = true;
    // options.plugins["babel-loader"] = true;
    // options.plugins["babel-preset-react-app"] = true;
    // options.plugins["babel-plugin-named-asset-import"] = true;
    // options.plugins["react-dev-utils"] = true;
    // }
  })
}
